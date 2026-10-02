import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase.js";
import AuthCard from "../components/ui/AuthCard.jsx";

const DEFAULT_PROFILE_PICTURE =
    "https://firebasestorage.googleapis.com/v0/b/pixgram-469807.firebasestorage.app/o/default%2FProfile%20Picture%2Fdefault.webp?alt=media&token=31a832e9-1b81-43d3-a87a-54fc581f4da6";

function Auth({ mode = "login" }) {
    const isLogin = mode === "login";

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [profilePicture, setProfilePicture] = useState(
        DEFAULT_PROFILE_PICTURE,
    );

    const [imageSrc, setImageSrc] = useState(DEFAULT_PROFILE_PICTURE);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    // -------------------------
    // Profile picture upload
    // -------------------------

    const handleImageUpload = () => {
        if (!username) {
            setError("Please Set Username Before Uploading Profile Picture!");
            return;
        }

        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        try {
            setLoading(true);
            setError("");

            const storageRef = ref(
                storage,
                `${username}/Profile Picture/${username}`,
            );

            await uploadBytes(storageRef, file);

            const url = await getDownloadURL(storageRef);

            setImageSrc(url);
            setProfilePicture(url);
        } catch (err) {
            console.error("Profile picture upload failed:", err);
            setError("Failed to upload profile picture.");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // Login
    // -------------------------

    const handleLogin = async () => {
        setError("");

        const user = {
            email,
            password,
        };

        try {
            const response = await fetch("/users/login", {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                window.location.href = "/";
                return;
            }

            setError("Incorrect Username Or Password!");
        } catch (err) {
            console.error("Login failed:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    // -------------------------
    // Register
    // -------------------------

    const handleRegister = async () => {
        setError("");

        const jsonData = {
            username,
            email,
            password,
            profilePicture: imageSrc,
        };

        try {
            const response = await fetch("/users/register", {
                method: "POST",
                body: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                window.location.replace("/login");
                return;
            }

            setError("User Already Exists!");
        } catch (err) {
            console.error("Registration failed:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <AuthCard
            mode={mode}
            username={username}
            email={email}
            password={password}
            profilePicture={profilePicture}
            imageSrc={imageSrc}
            error={error}
            loading={loading}
            fileInputRef={fileInputRef}
            onUsernameChange={setUsername}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onImageUpload={handleImageUpload}
            onFileChange={handleFileChange}
            onLogin={handleLogin}
            onRegister={handleRegister}
        />
    );
}

export default Auth;
