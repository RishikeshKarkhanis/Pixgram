import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCurrentUser } from "../api/auth.api.js";
import { getPostById } from "../api/posts.api.js";

import Navbar from "../components/ui/Navbar.jsx";
import PostWindow from "../components/ui/PostWindow.jsx";

function Posts() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();

                if (!currentUser) {
                    navigate("/auth");
                    return;
                }

                setUser(currentUser);
            } catch (error) {
                console.error("Error fetching current user:", error);
                navigate("/auth");
            }
        };

        fetchUser();
    }, [navigate]);

    // Get the post
    useEffect(() => {
        if (!postId) {
            setError("Invalid post URL");
            setLoading(false);
            return;
        }

        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getPostById(postId);

                if (!data) {
                    setError("Post not found");
                    return;
                }

                setPost(data);
            } catch (error) {
                console.error("Error fetching post:", error);
                setError(error.message || "Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    // Loading
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[rgb(244,242,238)]">
                <p className="text-gray-600">Loading post...</p>
            </div>
        );
    }

    // Error
    if (error || !post) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[rgb(244,242,238)]">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Post not found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        {error || "This post does not exist."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-5 rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // Wait for user
    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[rgb(244,242,238)]">
                <p className="text-gray-600">Loading user...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[rgb(244,242,238)]">
            <Navbar
                user={user}
                profilePicture={user.profilePicture}
                onHome={() => navigate("/")}
                onProfile={() => navigate(`/${user.username}`)}
                onEdit={() => navigate("/edit")}
                onLogout={() => navigate("/logout")}
            />

            <main className="flex min-h-[calc(100vh-64px)] items-start justify-center px-4 pt-12 pb-8">
                <PostWindow
                    post={post}
                    user={user}
                    onClose={() => navigate(-1)}
                />
            </main>
        </div>
    );
}

export default Posts;