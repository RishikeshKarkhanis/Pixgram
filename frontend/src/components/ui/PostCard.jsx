import { useState } from "react";

import { Heart, MessageCircle, X } from "lucide-react";

import { toggleLike } from "../../api/likes.api.js";

import {
    getPostComments,
    createComment,
    deleteComment,
} from "../../api/comments.api.js";

import CommentsModal from "./CommentsModal.jsx";

function PostCard({
    post,
    user,
    profilePicture,

    // true only when viewing your own profile
    canDelete = false,

    // Parent handles actual post deletion
    onDeletePost,

    // Lets parent update its post array
    onPostUpdate,
}) {
    // =================================================
    // LIKE
    // =================================================

    const [hasLiked, setHasLiked] = useState(Boolean(post.hasLiked));

    const [likeCount, setLikeCount] = useState(post.likes || 0);

    // =================================================
    // DOUBLE TAP HEART
    // =================================================

    const [showHeart, setShowHeart] = useState(false);

    const [showHeartCrack, setShowHeartCrack] = useState(false);

    // =================================================
    // COMMENTS
    // =================================================

    const [showComments, setShowComments] = useState(false);

    const [comments, setComments] = useState([]);

    const [commentCount, setCommentCount] = useState(post.comments || 0);

    // =================================================
    // LIKE
    // =================================================

    const handleLike = async () => {
        if (!user?._id || !post?._id) {
            return false;
        }

        try {
            const result = await toggleLike(user._id, post._id);

            const newLikeCount = result.liked
                ? likeCount + 1
                : Math.max(0, likeCount - 1);

            setHasLiked(result.liked);

            setLikeCount(newLikeCount);

            // Keep parent state in sync
            onPostUpdate?.(post._id, {
                hasLiked: result.liked,
                likes: newLikeCount,
            });

            return result.liked;
        } catch (error) {
            console.error("Failed to toggle like:", error);

            return false;
        }
    };

    // =================================================
    // DOUBLE CLICK
    // =================================================

    const handleDoubleClick = async () => {
        const liked = await handleLike();

        if (liked) {
            setShowHeart(true);

            setTimeout(() => {
                setShowHeart(false);
            }, 800);
        } else {
            setShowHeartCrack(true);

            setTimeout(() => {
                setShowHeartCrack(false);
            }, 800);
        }
    };

    // =================================================
    // COMMENTS
    // =================================================

    const handleOpenComments = async () => {
        try {
            const result = await getPostComments(post._id);

            setComments(Array.isArray(result) ? result : []);

            setShowComments(true);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    // =================================================
    // ADD COMMENT
    // =================================================

    const handlePostComment = async (postId, content) => {
        if (!user?._id || !content?.trim()) {
            return;
        }

        try {
            const result = await createComment({
                userId: user._id,
                postId,
                content: content.trim(),
            });

            // Backend returns userId as an ID.
            // CommentsModal expects populated user info.
            const commentWithUser = {
                ...result,

                userId: {
                    _id: user._id,
                    username: user.username,
                    profilePicture: user.profilePicture,
                },
            };

            setComments((current) => [...current, commentWithUser]);

            const newCommentCount = commentCount + 1;

            setCommentCount(newCommentCount);

            onPostUpdate?.(post._id, {
                comments: newCommentCount,
            });
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    };

    // =================================================
    // DELETE COMMENT
    // =================================================

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);

            setComments((current) =>
                current.filter((comment) => comment._id !== commentId),
            );

            const newCommentCount = Math.max(0, commentCount - 1);

            setCommentCount(newCommentCount);

            onPostUpdate?.(post._id, {
                comments: newCommentCount,
            });
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <>
            {/* =================================================
                POST CARD
            ================================================= */}

            <article
                className="
                    w-full
                    overflow-hidden
                    rounded-[5px]
                    bg-white
                    shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        bg-white
                        px-[10px]
                        py-[10px]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-[10px]
                        "
                    >
                        <img
                            src={post.postedBy?.profilePicture}
                            alt=""
                            className="
                                h-10
                                w-10
                                rounded-full
                                object-cover
                            "
                        />

                        <h6
                            className="
                                m-0
                                text-[18px]
                                font-bold
                            "
                        >
                            <a
                                href={`/${post.postedBy?.username}`}
                                className="
                                    text-black
                                    no-underline
                                "
                            >
                                {post.postedBy?.username}
                            </a>
                        </h6>
                    </div>

                    {/* =================================================
                        DELETE POST
                    ================================================= */}

                    {canDelete && (
                        <button
                            type="button"
                            onClick={() =>
                                onDeletePost?.(post._id, post.postedBy?._id)
                            }
                            className="
                                cursor-pointer
                                rounded-full
                                border-none
                                bg-transparent
                                p-1
                                text-black
                                transition
                                hover:bg-gray-100
                                hover:text-red-500
                            "
                            aria-label="Delete post"
                        >
                            <X size={22} />
                        </button>
                    )}
                </div>

                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="aspect-square w-full">
                    <div
                        className="
                            relative
                            flex
                            h-full
                            w-full
                            cursor-pointer
                            items-center
                            justify-center
                            bg-cover
                            bg-center
                            bg-no-repeat
                        "
                        style={{
                            backgroundImage: `url(${post.imageUrl})`,
                        }}
                        onDoubleClick={handleDoubleClick}
                    >
                        {/* =================================================
                            DOUBLE CLICK HEART
                        ================================================= */}

                        {showHeart && (
                            <Heart
                                size={110}
                                strokeWidth={0}
                                fill="white"
                                className="
                                    pointer-events-none
                                    absolute
                                    z-10
                                    opacity-90
                                "
                            />
                        )}

                        {/* =================================================
                            DOUBLE CLICK HEART CRACK
                        ================================================= */}

                        {showHeartCrack && (
                            <Heart
                                size={110}
                                strokeWidth={3}
                                className="
                                    pointer-events-none
                                    absolute
                                    z-10
                                    text-white
                                    opacity-90
                                "
                            />
                        )}
                    </div>
                </div>

                {/* =================================================
                    CAPTION
                ================================================= */}

                <div
                    className="
                        bg-white
                        px-[10px]
                        py-[5px]
                        text-left
                        text-base
                    "
                >
                    <p className="m-0">{post.caption}</p>
                </div>

                {/* =================================================
                    OPTIONS
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-start
                        gap-1
                        rounded-b-[5px]
                        bg-white
                        p-[10px]
                    "
                >
                    {/* =================================================
                        LIKE
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-[2.5px]
                            bg-white
                            p-[5px]
                        "
                    >
                        <button
                            type="button"
                            onClick={handleLike}
                            className="
                                flex
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                border-none
                                bg-transparent
                                p-1
                                transition
                                hover:bg-gray-100
                            "
                            aria-label={hasLiked ? "Unlike" : "Like"}
                        >
                            <Heart
                                size={21}
                                strokeWidth={2}
                                fill={hasLiked ? "crimson" : "none"}
                                className={
                                    hasLiked ? "text-red-600" : "text-black"
                                }
                            />
                        </button>

                        <div className="px-1">
                            <p className="m-0">{likeCount}</p>
                        </div>
                    </div>

                    {/* =================================================
                        COMMENTS
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-[2.5px]
                            bg-white
                            p-[5px]
                        "
                    >
                        <button
                            type="button"
                            onClick={handleOpenComments}
                            className="
                                flex
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                border-none
                                bg-transparent
                                p-1
                                transition
                                hover:bg-gray-100
                            "
                            aria-label="Comments"
                        >
                            <MessageCircle
                                size={21}
                                strokeWidth={2}
                                className="text-black"
                            />
                        </button>

                        <div className="px-1">
                            <p className="m-0">{commentCount}</p>
                        </div>
                    </div>
                </div>
            </article>

            {/* =================================================
                COMMENTS MODAL
            ================================================= */}

            {showComments && (
                <CommentsModal
                    comments={comments}
                    user={user}
                    profilePicture={profilePicture}
                    currentPostId={post._id}
                    onClose={() => setShowComments(false)}
                    onDeleteComment={handleDeleteComment}
                    onPostComment={handlePostComment}
                />
            )}
        </>
    );
}

export default PostCard;
