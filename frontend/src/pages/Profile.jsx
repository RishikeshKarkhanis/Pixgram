import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
    ref,
    listAll,
    deleteObject,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

import { storage } from "../../firebase.js";

import { getCurrentUser } from "../api/auth.api.js";

import { getUserById, getUserIdByUsername } from "../api/users.api.js";

import {
    getMyPosts,
    createPost,
    updatePost,
    deletePost,
} from "../api/posts.api.js";

import { isFollowing, createFollow, deleteFollow } from "../api/follows.api.js";

import Navbar from "../components/ui/Navbar.jsx";
import Sidebar from "../components/ui/Sidebar.jsx";
import PostCard from "../components/ui/PostCard.jsx";
import AddPostModal from "../components/ui/AddPostModal.jsx";
import SearchModal from "../components/ui/SearchModal.jsx";

const DEFAULT_POST_IMAGE =
    "https://firebasestorage.googleapis.com/v0/b/pixgram-469807.firebasestorage.app/o/default%2FPosts%2Fdefault%2Fdefault.jpg?alt=media&token=88af68e1-119b-426f-807e-e5f49e05dfb0";

function Profile() {
    // =====================================================
    // URL
    // =====================================================

    const { username } = useParams();

    // =====================================================
    // LOGGED-IN USER
    // =====================================================

    const [user, setUser] = useState(null);

    const [profilePicture, setProfilePicture] = useState(null);

    // =====================================================
    // PROFILE OWNER
    //
    // This is the user whose profile we are viewing.
    // It can be the logged-in user OR another user.
    // =====================================================

    const [profileOwner, setProfileOwner] = useState(null);

    // =====================================================
    // POSTS
    // =====================================================

    const [posts, setPosts] = useState([]);

    // =====================================================
    // FOLLOW STATE
    // =====================================================

    const [following, setFollowing] = useState(false);

    // =====================================================
    // SEARCH
    // =====================================================

    const [showSearch, setShowSearch] = useState(false);

    // =====================================================
    // ADD POST
    // =====================================================

    const [showAddPost, setShowAddPost] = useState(false);

    const [newPostId, setNewPostId] = useState("");

    const [newPostImage, setNewPostImage] = useState(DEFAULT_POST_IMAGE);

    const [newPostCaption, setNewPostCaption] = useState("");

    const fileInputRef = useRef(null);

    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(true);

    // =====================================================
    // DERIVED STATE
    // =====================================================

    const isOwnProfile = user?._id === profileOwner?._id;

    // =====================================================
    // FETCH LOGGED-IN USER
    // =====================================================

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();

                if (!currentUser) {
                    window.location.href = "/login";

                    return;
                }

                setUser(currentUser);

                setProfilePicture(currentUser.profilePicture);
            } catch (error) {
                console.error("Error fetching current user:", error);

                window.location.href = "/login";
            }
        };

        fetchUser();
    }, []);

    // =====================================================
    // FETCH PROFILE OWNER
    //
    // URL:
    //
    // /hrishikeshkarkhanis25
    //
    // username = "hrishikeshkarkhanis25"
    //
    // username → user ID → complete user
    // =====================================================

    useEffect(() => {
        if (!user?._id || !username) {
            return;
        }

        const fetchProfileOwner = async () => {
            try {
                setLoading(true);

                /*
                 * Get profile owner's ID
                 * from their username.
                 */

                const profileId = await getUserIdByUsername(username);

                /*
                 * Existing backend returns:
                 *
                 * {
                 *     uid: "..."
                 * }
                 */

                if (!profileId?.uid) {
                    console.error("Profile user ID not found");

                    setProfileOwner(null);
                    setPosts([]);

                    return;
                }

                /*
                 * Get complete profile data.
                 */

                const owner = await getUserById(profileId.uid);

                setProfileOwner(owner);
            } catch (error) {
                console.error("Error fetching profile:", error);

                setProfileOwner(null);
                setPosts([]);
            }
        };

        fetchProfileOwner();
    }, [user, username]);

    // =====================================================
    // FETCH PROFILE POSTS
    // =====================================================

    useEffect(() => {
        if (!profileOwner?._id) {
            return;
        }

        const fetchPosts = async () => {
            try {
                setLoading(true);

                const data = await getMyPosts(profileOwner._id);

                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching profile posts:", error);

                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [profileOwner]);

    // =====================================================
    // CHECK FOLLOW STATUS
    //
    // Only necessary when viewing somebody else's profile.
    // =====================================================

    useEffect(() => {
        if (!user?._id || !profileOwner?._id || isOwnProfile) {
            return;
        }

        const checkFollowStatus = async () => {
            try {
                const result = await isFollowing(profileOwner._id, user._id);

                setFollowing(!!result?.isFollowing);
            } catch (error) {
                console.error("Error checking follow status:", error);

                setFollowing(false);
            }
        };

        checkFollowStatus();
    }, [user, profileOwner, isOwnProfile]);

    // =====================================================
    // POST UPDATE FROM POSTCARD
    //
    // PostCard handles:
    // - Likes
    // - Comments
    //
    // Profile keeps its local post state synchronized.
    // =====================================================

    const handlePostUpdate = (postId, updates) => {
        setPosts((currentPosts) =>
            currentPosts.map((post) =>
                post._id === postId
                    ? {
                          ...post,
                          ...updates,
                      }
                    : post,
            ),
        );
    };

    // =====================================================
    // NAVIGATION
    // =====================================================

    const goToHome = () => {
        window.location.href = "/";
    };

    const goToProfile = () => {
        if (!user?.username) {
            return;
        }

        window.location.href = `/${user.username}`;
    };

    const goToEdit = () => {
        window.location.href = "/edit";
    };

    const logout = () => {
        window.location.href = "/logout";
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const openSearch = () => {
        setShowSearch(true);
    };

    const closeSearch = () => {
        setShowSearch(false);
    };

    // =====================================================
    // FOLLOW
    // =====================================================

    const handleFollow = async () => {
        if (!user?._id || !profileOwner?._id) {
            return;
        }

        try {
            await createFollow(profileOwner._id, user._id);

            setFollowing(true);

            /*
             * Update follower count locally.
             */

            setProfileOwner((currentOwner) => ({
                ...currentOwner,

                followers: (currentOwner.followers || 0) + 1,
            }));
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    // =====================================================
    // UNFOLLOW
    // =====================================================

    const handleUnfollow = async () => {
        if (!user?._id || !profileOwner?._id) {
            return;
        }

        try {
            await deleteFollow(profileOwner._id, user._id);

            setFollowing(false);

            /*
             * Update follower count locally.
             */

            setProfileOwner((currentOwner) => ({
                ...currentOwner,

                followers: Math.max(0, (currentOwner.followers || 0) - 1),
            }));
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };

    // =====================================================
    // ADD POST
    //
    // Only relevant when viewing own profile.
    // =====================================================

    const openAddPost = async () => {
        if (!isOwnProfile || !user?._id) {
            return;
        }

        try {
            /*
             * Create temporary post first.
             */

            const post = await createPost({
                postedBy: user._id,

                imageUrl: DEFAULT_POST_IMAGE,

                caption: "No Caption",
            });

            setNewPostId(post._id);

            setNewPostImage(DEFAULT_POST_IMAGE);

            setNewPostCaption("");

            setShowAddPost(true);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    // =====================================================
    // CLOSE / CANCEL ADD POST
    // =====================================================

    const closeAddPost = async () => {
        setShowAddPost(false);

        if (newPostId) {
            try {
                await deletePost(newPostId);
            } catch (error) {
                console.error("Error deleting cancelled post:", error);
            }
        }

        setNewPostId("");

        setNewPostImage(DEFAULT_POST_IMAGE);

        setNewPostCaption("");
    };

    // =====================================================
    // IMAGE UPLOAD
    // =====================================================

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file || !newPostId || !user?.username) {
            return;
        }

        try {
            const storageRef = ref(
                storage,
                `${user.username}/Posts/${newPostId}/${newPostId}`,
            );

            await uploadBytes(storageRef, file);

            const url = await getDownloadURL(storageRef);

            setNewPostImage(url);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // =====================================================
    // SUBMIT POST
    // =====================================================

    const submitPost = async () => {
        if (!newPostId) {
            return;
        }

        try {
            await updatePost(newPostId, {
                caption: newPostCaption.trim() || "No Caption",

                imageUrl: newPostImage,
            });

            /*
             * Refresh profile posts.
             */

            const updatedPosts = await getMyPosts(profileOwner._id);

            setPosts(Array.isArray(updatedPosts) ? updatedPosts : []);

            /*
             * Update post counter.
             */

            setProfileOwner((currentOwner) => ({
                ...currentOwner,

                posts: (currentOwner.posts || 0) + 1,
            }));

            setShowAddPost(false);

            setNewPostId("");

            setNewPostImage(DEFAULT_POST_IMAGE);

            setNewPostCaption("");
        } catch (error) {
            console.error("Error submitting post:", error);
        }
    };

    // =====================================================
    // DELETE POST
    //
    // Only possible on own profile.
    // =====================================================

    const handleDeletePost = async (postId) => {
        if (!isOwnProfile) {
            return;
        }

        try {
            /*
             * Delete MongoDB post.
             */

            await deletePost(postId);

            /*
             * Immediately remove from UI.
             */

            setPosts((currentPosts) =>
                currentPosts.filter((post) => post._id !== postId),
            );

            /*
             * Update post count.
             */

            setProfileOwner((currentOwner) => ({
                ...currentOwner,

                posts: Math.max(0, (currentOwner.posts || 0) - 1),
            }));

            /*
             * Remove image files from Firebase.
             */

            if (user?.username) {
                const folderRef = ref(
                    storage,
                    `${user.username}/Posts/${postId}`,
                );

                try {
                    const result = await listAll(folderRef);

                    const deletePromises = result.items.map((itemRef) =>
                        deleteObject(itemRef),
                    );

                    await Promise.all(deletePromises);
                } catch (storageError) {
                    /*
                     * Database deletion already succeeded.
                     * Firebase cleanup failure shouldn't
                     * bring the post back into the UI.
                     */

                    console.error(
                        "Error deleting Firebase files:",
                        storageError,
                    );
                }
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // =====================================================
    // WAIT FOR DATA
    // =====================================================

    if (!user || !profileOwner) {
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
    // RENDER
    // =====================================================

    return (
        <div
            className="
                min-h-screen
                w-full
                bg-[rgb(244,242,238)]
            "
        >
            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar
                user={user}
                profilePicture={profilePicture}
                onHome={goToHome}
                onProfile={goToProfile}
                onEdit={goToEdit}
                onCreatePost={openAddPost}
                onLogout={logout}
                onSearch={openSearch}
            />

            {/* =================================================
                SEARCH MODAL
            ================================================= */}

            {showSearch && <SearchModal onClose={closeSearch} />}

            {/* =================================================
                ADD POST MODAL
            ================================================= */}

            {showAddPost && isOwnProfile && (
                <AddPostModal
                    newPostImage={newPostImage}
                    newPostCaption={newPostCaption}
                    setNewPostCaption={setNewPostCaption}
                    fileInputRef={fileInputRef}
                    onImageUpload={handleImageUpload}
                    onFileChange={handleFileChange}
                    onSubmit={submitPost}
                    onCancel={closeAddPost}
                />
            )}

            {/* =================================================
                PAGE LAYOUT
            ================================================= */}

            <div
                className="
                    min-h-screen
                    w-full
                "
            >
                {/* =============================================
                    SIDEBAR
                ============================================= */}

                <aside
                    className="
                        fixed
                        left-0
                        top-[60px]
                        z-20

                        hidden

                        h-[calc(100vh-60px)]

                        w-[150px]

                        border-r
                        border-gray-200

                        bg-white

                        min-[600px]:block
                        min-[820px]:w-[175px]
                        min-[1000px]:w-[225px]
                        min-[1200px]:w-[225px]
                    "
                >
                    <Sidebar
                        onHome={goToHome}
                        onProfile={goToProfile}
                        onExplore={openSearch}
                        onCreatePost={openAddPost}
                        onEdit={goToEdit}
                        onLogout={logout}
                    />
                </aside>

                {/* =============================================
                    PROFILE CONTENT
                ============================================= */}

                <main
                    className="
                        min-h-screen

                        bg-[rgb(244,242,238)]

                        px-2
                        pt-[80px]
                        pb-10

                        min-[600px]:ml-[150px]
                        min-[820px]:ml-[175px]
                        min-[1000px]:ml-[225px]
                        min-[1200px]:ml-[225px]
                    "
                >
                    <div
                        className="
                            mx-auto

                            flex
                            w-full
                            max-w-[700px]

                            flex-col
                            items-center

                            gap-6
                        "
                    >
                        {/* =====================================
                            PROFILE HEADER
                        ===================================== */}

                        <section
                            className="
                                w-full
                                max-w-[500px]

                                rounded-[5px]

                                bg-white

                                p-4

                                shadow-[0_4px_8px_rgba(0,0,0,0.15)]
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                "
                            >
                                {/* PROFILE PICTURE */}

                                <div
                                    className="
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={profileOwner.profilePicture}
                                        alt={`${profileOwner.username} profile`}
                                        className="
                                            h-24
                                            w-24

                                            rounded-full

                                            object-cover

                                            sm:h-28
                                            sm:w-28
                                        "
                                    />
                                </div>

                                {/* ACCOUNT DETAILS */}

                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >
                                    {/* USERNAME + BUTTON */}

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-3
                                        "
                                    >
                                        <h2
                                            className="
                                                truncate

                                                text-xl
                                                font-semibold
                                            "
                                        >
                                            {profileOwner.username}
                                        </h2>

                                        {/* =================================
                                            OWN PROFILE → EDIT
                                        ================================= */}

                                        {isOwnProfile ? (
                                            <button
                                                type="button"
                                                onClick={goToEdit}
                                                className="
                                                    rounded-[5px]

                                                    bg-[#28a745]

                                                    px-4
                                                    py-1

                                                    text-sm
                                                    font-medium
                                                    text-white

                                                    transition

                                                    hover:bg-[#218838]
                                                "
                                            >
                                                Edit
                                            </button>
                                        ) : following ? (
                                            /* ===============================
                                                OTHER USER → FOLLOWING
                                            =============================== */

                                            <button
                                                type="button"
                                                onClick={handleUnfollow}
                                                className="
                                                    rounded-[5px]

                                                    bg-[#5cb85c]

                                                    px-4
                                                    py-1

                                                    text-sm
                                                    font-medium
                                                    text-white

                                                    transition

                                                    hover:bg-[#4cae4c]
                                                "
                                            >
                                                Following
                                            </button>
                                        ) : (
                                            /* ===============================
                                                OTHER USER → FOLLOW
                                            =============================== */

                                            <button
                                                type="button"
                                                onClick={handleFollow}
                                                className="
                                                    rounded-[5px]

                                                    bg-[#28a745]

                                                    px-4
                                                    py-1

                                                    text-sm
                                                    font-medium
                                                    text-white

                                                    transition

                                                    hover:bg-[#218838]
                                                "
                                            >
                                                Follow
                                            </button>
                                        )}
                                    </div>

                                    {/* =====================================
                                        PROFILE STATS
                                    ===================================== */}

                                    <div
                                        className="
                                            mt-3

                                            flex
                                            flex-wrap

                                            gap-4

                                            text-sm
                                            text-gray-700
                                        "
                                    >
                                        <span>
                                            <strong>
                                                {profileOwner.posts ?? 0}
                                            </strong>{" "}
                                            Posts
                                        </span>

                                        <span>
                                            <strong>
                                                {profileOwner.followers ?? 0}
                                            </strong>{" "}
                                            Followers
                                        </span>

                                        <span>
                                            <strong>
                                                {profileOwner.following ?? 0}
                                            </strong>{" "}
                                            Following
                                        </span>
                                    </div>

                                    {/* =====================================
                                        BIO
                                    ===================================== */}

                                    {profileOwner.bio && (
                                        <p
                                            className="
                                                mt-3

                                                text-left

                                                text-sm
                                                text-gray-700
                                            "
                                        >
                                            {profileOwner.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* =====================================
                            POSTS
                        ===================================== */}

                        <section
                            className="
                                flex
                                w-full

                                flex-col
                                items-center

                                gap-5
                            "
                        >
                            {loading ? (
                                <p
                                    className="
                                        mt-8
                                        text-gray-600
                                    "
                                >
                                    Loading posts...
                                </p>
                            ) : posts.length > 0 ? (
                                posts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="
                                            w-full

                                            min-[600px]:w-[90%]

                                            min-[1000px]:w-[500px]
                                        "
                                    >
                                        <PostCard
                                            post={post}
                                            user={user}
                                            profilePicture={profilePicture}
                                            /*
                                             * Delete X appears
                                             * ONLY when this is
                                             * the logged user's
                                             * profile.
                                             */

                                            canDelete={isOwnProfile}
                                            onDeletePost={handleDeletePost}
                                            onPostUpdate={handlePostUpdate}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div
                                    className="
                                        mt-8

                                        flex
                                        flex-col
                                        items-center

                                        text-center
                                    "
                                >
                                    <p
                                        className="
                                            text-gray-600
                                        "
                                    >
                                        No posts available.
                                    </p>

                                    {/* Only show Create button
                                        on own profile. */}

                                    {isOwnProfile && (
                                        <button
                                            type="button"
                                            onClick={openAddPost}
                                            className="
                                                mt-3

                                                rounded-[5px]

                                                bg-[#28a745]

                                                px-4
                                                py-2

                                                text-sm
                                                font-medium
                                                text-white

                                                hover:bg-[#218838]
                                            "
                                        >
                                            Create your first post
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
