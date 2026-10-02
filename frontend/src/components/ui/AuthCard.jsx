import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "../../../firebase.js";
import { loginUser, registerUser } from "../../api/auth.api.js";

const DEFAULT_PROFILE_PICTURE =
    "https://firebasestorage.googleapis.com/v0/b/pixgram-469807.firebasestorage.app/o/Default%2FProfile%20Picture%2FDefaultProfilePic.jpg?alt=media&token=899e81c7-703a-4245-8d0c-572673692abc";

function AuthCard() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    // Login state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register state
    const [username, setUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState(
        DEFAULT_PROFILE_PICTURE
    );

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const switchMode = (loginMode) => {
        setIsLogin(loginMode);
        setError("");
    };

    // ---------------- LOGIN ----------------

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await loginUser({
                email: loginEmail,
                password: loginPassword,
            });

            navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                err.message === "Invalid credentials"
                    ? "Incorrect Username Or Password!"
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------- REGISTER ----------------

    const handleImageUpload = () => {
        if (!username.trim()) {
            setError(
                "Please set username before uploading profile picture!"
            );
            return;
        }

        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setError("");
        setLoading(true);

        try {
            const storageRef = ref(
                storage,
                `${username}/Profile Picture/${username}`
            );

            await uploadBytes(storageRef, file);

            const url = await getDownloadURL(storageRef);

            setProfilePicture(url);
        } catch (err) {
            console.error(err);
            setError("Failed to upload profile picture.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await registerUser({
                username,
                email: registerEmail,
                password: registerPassword,
                profilePicture,
            });

            // Registration successful
            // Switch to login tab
            setLoginEmail(registerEmail);
            setLoginPassword("");
            setIsLogin(true);
            setError("");
        } catch (err) {
            console.error(err);
            setError("User Already Exists!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f5f5f5] flex items-center justify-center px-4 py-8">

            {/* Auth Card */}
            <div className="w-full max-w-md bg-white rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] px-5 py-5">

                {/* Logo */}
                <div className="flex items-center justify-center mb-5">
                    <h1 className="text-5xl font-bold leading-none">
                        <span className="text-green-600">Pix</span>
                        <span className="text-black">Gram</span>
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-5">
                    <div className="flex w-full max-w-sm border border-gray-300 rounded-lg overflow-hidden">

                        <button
                            type="button"
                            onClick={() => switchMode(true)}
                            className={`flex-1 py-2.5 font-medium transition-colors ${
                                isLogin
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => switchMode(false)}
                            className={`flex-1 py-2.5 font-medium transition-colors ${
                                !isLogin
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Register
                        </button>

                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="w-full mb-4 px-3 py-2 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
                    >
                        {error}
                    </div>
                )}

                {/* LOGIN */}
                {isLogin ? (
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center gap-3"
                    >
                        <h2 className="text-2xl font-bold text-black mb-1">
                            Login
                        </h2>

                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 text-center border border-gray-300 rounded-md outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) =>
                                setLoginPassword(e.target.value)
                            }
                            required
                            className="w-full px-3 py-2.5 text-center border border-gray-300 rounded-md outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white rounded-md transition-colors cursor-pointer"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                ) : (

                    /* REGISTER */

                    <form
                        onSubmit={handleRegister}
                        className="flex flex-col items-center gap-3"
                    >
                        <h2 className="text-2xl font-bold text-black mb-1">
                            Register
                        </h2>

                        {/* Profile Picture */}
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={loading}
                            className="relative h-20 w-20 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                            style={{
                                backgroundImage: `url(${profilePicture})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {loading && (
                                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-medium">
                                    Uploading...
                                </span>
                            )}
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 text-center border border-gray-300 rounded-md outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={registerEmail}
                            onChange={(e) =>
                                setRegisterEmail(e.target.value)
                            }
                            required
                            className="w-full px-3 py-2.5 text-center border border-gray-300 rounded-md outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={registerPassword}
                            onChange={(e) =>
                                setRegisterPassword(e.target.value)
                            }
                            required
                            className="w-full px-3 py-2.5 text-center border border-gray-300 rounded-md outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white rounded-md transition-colors cursor-pointer"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                )}

                {/* Bottom switch */}
                <div className="flex items-center justify-center mt-5 mb-1 text-sm sm:text-base">
                    {isLogin ? (
                        <>
                            <p className="mr-1">
                                New To PixGram? :
                            </p>

                            <button
                                type="button"
                                onClick={() => switchMode(false)}
                                className="text-green-600 hover:text-green-700 cursor-pointer"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="mr-1">
                                Already Have An Account? :
                            </p>

                            <button
                                type="button"
                                onClick={() => switchMode(true)}
                                className="text-green-600 hover:text-green-700 cursor-pointer"
                            >
                                Login
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default AuthCard;