import { useRef, useState } from "react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "../../firebase.js";

import { loginUser, registerUser } from "../api/auth.api.js";

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

    // =====================================================
    // PROFILE PICTURE UPLOAD
    // =====================================================

    const handleImageUpload = () => {
        if (!username) {
            setError("Please Set Username Before Uploading Profile Picture!");
            return;
        }

        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

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
        } catch (error) {
            console.error("Profile picture upload failed:", error);

            setError("Failed to upload profile picture.");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async () => {
        setError("");

        try {
            await loginUser({
                email,
                password,
            });

            window.location.href = "/";
        } catch (error) {
            console.error("Login failed:", error);

            setError(error.message || "Incorrect Username Or Password!");
        }
    };

    // =====================================================
    // REGISTER
    // =====================================================

    const handleRegister = async () => {
        setError("");

        try {
            await registerUser({
                username,
                email,
                password,
                profilePicture: imageSrc,
            });

            // Registration successful.
            // Go to Auth page in login mode.
            window.location.href = "/auth";
        } catch (error) {
            console.error("Registration failed:", error);

            setError(error.message || "User Already Exists!");
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
