import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { ArrowLeft, Trash2, Upload } from "lucide-react";

import { storage } from "../../firebase.js";

import { getCurrentUser } from "../api/auth.api.js";

import { updateUser } from "../api/users.api.js";

function EditProfile() {
    const navigate = useNavigate();

    // =====================================================
    // USER DATA
    // =====================================================

    const [uid, setUid] = useState("");

    const [email, setEmail] = useState("");

    const [username, setUsername] = useState("");

    const [doc, setDoc] = useState("");

    const [bio, setBio] = useState("");

    const [password, setPassword] = useState("");

    const [profilePicture, setProfilePicture] = useState(null);

    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef(null);

    // =====================================================
    // FETCH CURRENT USER
    // =====================================================

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentUser();

                if (!data) {
                    navigate("/login");

                    return;
                }

                setUid(data._id || "");

                setEmail(data.email || "");

                setUsername(data.username || "");

                setDoc(data.createdAt || "");

                setBio(data.bio || "");

                setPassword(data.password || "");

                setProfilePicture(data.profilePicture || null);
            } catch (error) {
                console.error("Error fetching user:", error);

                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // =====================================================
    // IMAGE UPLOAD BUTTON
    // =====================================================

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    // =====================================================
    // PROFILE PICTURE CHANGE
    // =====================================================

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploading(true);

            const storageRef = ref(
                storage,
                `${username}/Profile Pictures/${username}`,
            );

            await uploadBytes(storageRef, file);

            const url = await getDownloadURL(storageRef);

            setProfilePicture(url);
        } catch (error) {
            console.error("Error uploading profile picture:", error);

            alert("Failed to upload profile picture.");
        } finally {
            setUploading(false);
        }
    };

    // =====================================================
    // UPDATE USER
    // =====================================================

    const handleUpdate = async () => {
        if (!uid) {
            return;
        }

        try {
            setSaving(true);

            const userData = {
                email,

                password,

                username,

                profilePicture,

                bio,
            };

            const data = await updateUser(uid, userData);

            /*
             * Update local state using
             * backend response.
             */

            if (data) {
                setEmail(data.email ?? email);

                setPassword(data.password ?? password);

                setBio(data.bio ?? bio);

                setProfilePicture(data.profilePicture ?? profilePicture);

                setUsername(data.username ?? username);
            }

            alert("Profile updated successfully!");

            /*
             * If username was changed,
             * go to the new profile URL.
             */

            if (data?.username && data.username !== username) {
                navigate(`/${data.username}`);

                return;
            }
        } catch (error) {
            console.error("Error updating profile:", error);

            alert(error.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE ACCOUNT
    // =====================================================

    const handleDelete = () => {
        /*
         * Keeping your existing flow for now.
         *
         * We can later create a proper
         * delete-account confirmation modal
         * and call deleteUser() directly.
         */

        window.location.href = "/delete_user";
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[rgb(244,242,238)]
                "
            >
                <p className="text-gray-600">Loading profile...</p>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div
            className="
                flex
                min-h-screen
                w-full

                items-center
                justify-center

                bg-[rgb(244,242,238)]

                px-3
                py-8
            "
        >
            <div
                className="
                    w-full
                    max-w-[1000px]

                    overflow-hidden

                    rounded-[5px]

                    bg-white

                    shadow-[0_4px_8px_rgba(0,0,0,0.2)]
                "
            >
                {/* =================================================
                    TOP BAR
                ================================================= */}

                <div
                    className="
                        flex
                        items-center

                        border-b
                        border-gray-200

                        px-4
                        py-3
                    "
                >
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            flex
                            items-center
                            justify-center

                            rounded-full

                            p-1

                            text-gray-700

                            transition

                            hover:bg-gray-100
                            hover:text-[#28a745]
                        "
                    >
                        <ArrowLeft size={26} />
                    </button>

                    <h1
                        className="
                            ml-3

                            text-xl
                            font-semibold
                        "
                    >
                        Edit Profile
                    </h1>
                </div>

                {/* =================================================
                    MAIN
                ================================================= */}

                <div
                    className="
                        flex

                        flex-col

                        md:flex-row
                    "
                >
                    {/* =============================================
                        LEFT SIDE
                    ============================================= */}

                    <div
                        className="
                            flex

                            w-full

                            flex-col
                            items-center
                            justify-center

                            border-b
                            border-gray-200

                            px-5
                            py-8

                            md:w-[30%]

                            md:border-b-0
                            md:border-r
                        "
                    >
                        {/* PROFILE PICTURE */}

                        <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={uploading}
                            className="
                                group

                                relative

                                h-[180px]
                                w-[180px]

                                overflow-hidden

                                rounded-full

                                border-0

                                bg-gray-100

                                shadow-[0_4px_8px_rgba(0,0,0,0.2)]

                                sm:h-[210px]
                                sm:w-[210px]

                                md:h-[220px]
                                md:w-[220px]
                            "
                        >
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="
                                        h-full
                                        w-full

                                        object-cover
                                    "
                                />
                            ) : (
                                <div
                                    className="
                                        flex
                                        h-full
                                        w-full

                                        items-center
                                        justify-center

                                        text-gray-400
                                    "
                                >
                                    No Photo
                                </div>
                            )}

                            {/* HOVER OVERLAY */}

                            <div
                                className="
                                    absolute
                                    inset-0

                                    flex
                                    items-center
                                    justify-center

                                    bg-black/40

                                    text-center
                                    text-sm
                                    font-medium
                                    text-white

                                    opacity-0

                                    transition

                                    group-hover:opacity-100
                                "
                            >
                                {uploading ? (
                                    "Uploading..."
                                ) : (
                                    <span
                                        className="
                                            flex
                                            flex-col
                                            items-center
                                            gap-1
                                        "
                                    >
                                        <Upload size={22} />
                                        Change Photo
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* HIDDEN FILE INPUT */}

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <p
                            className="
                                mt-4

                                text-center
                                text-sm
                                text-gray-500
                            "
                        >
                            Click your profile picture to change it.
                        </p>
                    </div>

                    {/* =============================================
                        RIGHT SIDE
                    ============================================= */}

                    <div
                        className="
                            flex
                            w-full

                            flex-col

                            px-4
                            py-6

                            md:w-[70%]
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col

                                gap-4
                            "
                        >
                            {/* =====================================
                                UID
                            ===================================== */}

                            <div
                                className="
                                    flex

                                    flex-col
                                    gap-1

                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <label
                                    htmlFor="uid"
                                    className="
                                        w-full
                                        text-sm
                                        font-medium
                                        text-gray-700

                                        sm:w-[30%]

                                        sm:text-base
                                    "
                                >
                                    UID:
                                </label>

                                <input
                                    id="uid"
                                    type="text"
                                    readOnly
                                    value={uid}
                                    className="
                                        w-full

                                        rounded-[5px]

                                        border
                                        border-gray-200

                                        bg-gray-50

                                        px-3
                                        py-2

                                        text-center
                                        text-sm
                                        text-gray-400

                                        outline-none

                                        sm:w-[70%]
                                        sm:text-base
                                    "
                                />
                            </div>

                            {/* =====================================
                                CREATED AT
                            ===================================== */}

                            <div
                                className="
                                    flex

                                    flex-col
                                    gap-1

                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <label
                                    htmlFor="doc"
                                    className="
                                        w-full
                                        text-sm
                                        font-medium
                                        text-gray-700

                                        sm:w-[30%]

                                        sm:text-base
                                    "
                                >
                                    Created At:
                                </label>

                                <input
                                    id="doc"
                                    type="text"
                                    readOnly
                                    value={doc}
                                    className="
                                        w-full

                                        rounded-[5px]

                                        border
                                        border-gray-200

                                        bg-gray-50

                                        px-3
                                        py-2

                                        text-center
                                        text-sm
                                        text-gray-400

                                        outline-none

                                        sm:w-[70%]
                                        sm:text-base
                                    "
                                />
                            </div>

                            {/* =====================================
                                USERNAME
                            ===================================== */}

                            <div
                                className="
                                    flex

                                    flex-col
                                    gap-1

                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <label
                                    htmlFor="username"
                                    className="
                                        w-full
                                        text-sm
                                        font-medium
                                        text-gray-700

                                        sm:w-[30%]

                                        sm:text-base
                                    "
                                >
                                    Username:
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    readOnly
                                    value={username}
                                    autoComplete="username"
                                    className="
                                        w-full

                                        rounded-[5px]

                                        border
                                        border-gray-200

                                        bg-gray-50

                                        px-3
                                        py-2

                                        text-center
                                        text-sm
                                        text-gray-400

                                        outline-none

                                        sm:w-[70%]
                                        sm:text-base
                                    "
                                />
                            </div>

                            {/* =====================================
                                EMAIL
                            ===================================== */}

                            <div
                                className="
                                    flex

                                    flex-col
                                    gap-1

                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <label
                                    htmlFor="email"
                                    className="
                                        w-full
                                        text-sm
                                        font-medium
                                        text-gray-700

                                        sm:w-[30%]

                                        sm:text-base
                                    "
                                >
                                    Email:
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    readOnly
                                    value={email}
                                    autoComplete="email"
                                    className="
                                        w-full

                                        rounded-[5px]

                                        border
                                        border-gray-200

                                        bg-gray-50

                                        px-3
                                        py-2

                                        text-center
                                        text-sm
                                        text-gray-400

                                        outline-none

                                        sm:w-[70%]
                                        sm:text-base
                                    "
                                />
                            </div>

                            {/* =====================================
                                PASSWORD
                            ===================================== */}

                            <div
                                className="
                                    flex

                                    flex-col
                                    gap-1

                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <label
                                    htmlFor="password"
                                    className="
                                        w-full
                                        text-sm
                                        font-medium
                                        text-gray-700

                                        sm:w-[30%]

                                        sm:text-base
                                    "
                                >
                                    Password:
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    autoComplete="new-password"
                                    className="
                                        w-full

                                        rounded-[5px]

                                        border
                                        border-gray-300

                                        px-3
                                        py-2

                                        text-center
                                        text-sm

                                        outline-none

                                        transition

                                        focus:border-[#28a745]

                                        sm:w-[70%]
                                        sm:text-base
                                    "
                                />
                            </div>

                            {/* =====================================
                                BIO
                            ===================================== */}

                            <div
                                className="
                                    flex

                                    flex-col
                                    gap-1

                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <label
                                    htmlFor="bio"
                                    className="
                                        w-full
                                        text-sm
                                        font-medium
                                        text-gray-700

                                        sm:w-[30%]

                                        sm:text-base
                                    "
                                >
                                    Bio:
                                </label>

                                <input
                                    id="bio"
                                    type="text"
                                    value={bio}
                                    onChange={(event) =>
                                        setBio(event.target.value)
                                    }
                                    className="
                                        w-full

                                        rounded-[5px]

                                        border
                                        border-gray-300

                                        px-3
                                        py-2

                                        text-center
                                        text-sm

                                        outline-none

                                        transition

                                        focus:border-[#28a745]

                                        sm:w-[70%]
                                        sm:text-base
                                    "
                                />
                            </div>
                        </div>

                        {/* =============================================
                            BUTTONS
                        ============================================= */}

                        <div
                            className="
                                mt-6

                                flex

                                flex-col

                                gap-3

                                sm:flex-row
                            "
                        >
                            {/* UPDATE */}

                            <button
                                type="button"
                                onClick={handleUpdate}
                                disabled={saving || uploading}
                                className="
                                    flex-1

                                    rounded-[5px]

                                    bg-[#28a745]

                                    px-4
                                    py-2

                                    text-base
                                    font-medium
                                    text-white

                                    transition

                                    hover:bg-[#218838]

                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {saving ? "Updating..." : "Update"}
                            </button>

                            {/* DELETE */}

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="
                                    flex

                                    flex-1

                                    items-center
                                    justify-center
                                    gap-2

                                    rounded-[5px]

                                    bg-red-600

                                    px-4
                                    py-2

                                    text-base
                                    font-medium
                                    text-white

                                    transition

                                    hover:bg-red-700
                                "
                            >
                                <Trash2 size={18} />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
