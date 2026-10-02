import { useEffect, useRef, useState } from "react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase.js";

import { getCurrentUser } from "../api/auth.api.js";
import {
    getFeed,
    createPost,
    updatePost,
    deletePost,
} from "../api/posts.api.js";

import Navbar from "../components/ui/Navbar.jsx";
import Sidebar from "../components/ui/Sidebar.jsx";
import PostCard from "../components/ui/PostCard.jsx";
import AddPostModal from "../components/ui/AddPostModal.jsx";
import SearchModal from "../components/ui/SearchModal.jsx";


const DEFAULT_POST_IMAGE =
    "https://firebasestorage.googleapis.com/v0/b/pixgram-469807.firebasestorage.app/o/default%2FPosts%2Fdefault%2Fdefault.jpg?alt=media&token=88af68e1-119b-426f-807e-e5f49e05dfb0";


function Home() {

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);


    // =====================================================
    // FEED
    // =====================================================

    const [posts, setPosts] = useState([]);


    // =====================================================
    // SEARCH
    // =====================================================

    const [showSearch, setShowSearch] = useState(false);


    // =====================================================
    // ADD POST
    // =====================================================

    const [showAddPost, setShowAddPost] = useState(false);

    const [newPostId, setNewPostId] = useState("");

    const [newPostImage, setNewPostImage] =
        useState(DEFAULT_POST_IMAGE);

    const [newPostCaption, setNewPostCaption] =
        useState("");

    const fileInputRef = useRef(null);


    // =====================================================
    // FETCH CURRENT USER
    // =====================================================

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const currentUser = await getCurrentUser();

                if (!currentUser) {
                    window.location.href = "/auth";
                    return;
                }

                setUser(currentUser);
                setProfilePicture(currentUser.profilePicture);

            } catch (error) {

                console.error(
                    "Error fetching current user:",
                    error
                );

                window.location.href = "/auth";
            }
        };


        fetchUser();

    }, []);


    // =====================================================
    // FETCH FEED
    // =====================================================

    useEffect(() => {

        if (!user?._id) {
            return;
        }


        const fetchFeed = async () => {

            try {

                const data = await getFeed(user._id);

                setPosts(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error fetching feed:",
                    error
                );
            }
        };


        fetchFeed();

    }, [user]);


    // =====================================================
    // POST UPDATE FROM POSTCARD
    //
    // PostCard handles:
    // - Like
    // - Comments
    //
    // Home only updates the corresponding post
    // in its own feed state.
    // =====================================================

    const handlePostUpdate = (postId, updates) => {

        setPosts((currentPosts) =>

            currentPosts.map((post) =>

                post._id === postId
                    ? {
                        ...post,
                        ...updates,
                    }
                    : post

            )

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
    // ADD POST
    // =====================================================

    const openAddPost = async () => {

        if (!user?._id) {
            return;
        }


        try {

            /*
             * Old PixGram flow:
             *
             * 1. Create empty post
             * 2. Upload image
             * 3. Update post
             */

            const post = await createPost({
                postedBy: user._id,
                imageUrl: DEFAULT_POST_IMAGE,
                caption: "No Caption",
            });


            setNewPostId(post._id);

            setNewPostImage(
                DEFAULT_POST_IMAGE
            );

            setNewPostCaption("");

            setShowAddPost(true);

        } catch (error) {

            console.error(
                "Error creating post:",
                error
            );
        }
    };


    // =====================================================
    // CLOSE / CANCEL ADD POST
    // =====================================================

    const closeAddPost = async () => {

        setShowAddPost(false);


        /*
         * If the user created the temporary post
         * but cancelled the upload, remove it.
         */

        if (newPostId) {

            try {

                await deletePost(newPostId);

            } catch (error) {

                console.error(
                    "Error deleting cancelled post:",
                    error
                );
            }
        }


        setNewPostId("");

        setNewPostImage(
            DEFAULT_POST_IMAGE
        );

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

        if (
            !file ||
            !newPostId ||
            !user?.username
        ) {
            return;
        }


        try {

            const storageRef = ref(
                storage,
                `${user.username}/Posts/${newPostId}/${newPostId}`
            );


            await uploadBytes(
                storageRef,
                file
            );


            const url =
                await getDownloadURL(
                    storageRef
                );


            setNewPostImage(url);

        } catch (error) {

            console.error(
                "Error uploading image:",
                error
            );
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

            await updatePost(
                newPostId,
                {
                    caption:
                        newPostCaption.trim() ||
                        "No Caption",

                    imageUrl:
                        newPostImage,
                }
            );


            /*
             * Refresh feed so newly created
             * post appears immediately.
             */

            const updatedFeed =
                await getFeed(user._id);


            setPosts(
                Array.isArray(updatedFeed)
                    ? updatedFeed
                    : []
            );


            setShowAddPost(false);

            setNewPostId("");

            setNewPostImage(
                DEFAULT_POST_IMAGE
            );

            setNewPostCaption("");

        } catch (error) {

            console.error(
                "Error submitting post:",
                error
            );
        }
    };


    // =====================================================
    // WAIT FOR USER
    // =====================================================

    if (!user) {
        return null;
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

            {showSearch && (

                <SearchModal
                    onClose={closeSearch}
                />

            )}


            {/* =================================================
                ADD POST MODAL
            ================================================= */}

            {showAddPost && (

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
                    FIXED SIDEBAR

                    Hidden on mobile.
                    Fixed below navbar on desktop.
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
                    FEED

                    Mobile:
                        full width

                    600px:
                        leaves 150px for sidebar

                    820px:
                        leaves 175px

                    1000px+:
                        leaves 225px
                ============================================= */}

                <main
                    className="
                        min-h-screen

                        bg-[rgb(244,242,238)]

                        px-2
                        pt-[80px]
                        pb-8

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
                            flex-col
                            items-center

                            gap-5
                        "
                    >

                        {posts.length > 0 ? (

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

                                        profilePicture={
                                            profilePicture
                                        }

                                        /*
                                         * Home must NEVER
                                         * display the delete X.
                                         */

                                        canDelete={false}

                                        onPostUpdate={
                                            handlePostUpdate
                                        }

                                    />

                                </div>

                            ))

                        ) : (

                            <p
                                className="
                                    mt-10
                                    text-center
                                    text-gray-600
                                "
                            >
                                No posts available.
                            </p>

                        )}

                    </div>

                </main>

            </div>

        </div>
    );
}


export default Home;