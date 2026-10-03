import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Heart,
    MessageCircle,
    Send,
    MoreHorizontal,
    X,
    Trash2,
} from "lucide-react";

import { toggleLike } from "../../api/likes.api.js";

import {
    getPostComments,
    createComment,
    deleteComment,
} from "../../api/comments.api.js";

function PostWindow({
    post,
    user,
    onClose,
    canDelete = false,
    onDeletePost,
}) {
    const navigate = useNavigate();

    // =====================================================
    // LIKE
    // =====================================================

    const [hasLiked, setHasLiked] = useState(
        post?.hasLiked || false,
    );

    const [likeCount, setLikeCount] = useState(
        post?.likes || 0,
    );

    // =====================================================
    // DOUBLE TAP HEART
    // =====================================================

    const [showHeart, setShowHeart] = useState(false);
    const [showHeartCrack, setShowHeartCrack] =
        useState(false);

    // =====================================================
    // COMMENTS
    // =====================================================

    const [comments, setComments] = useState([]);

    const [commentsLoading, setCommentsLoading] =
        useState(true);

    const [commentText, setCommentText] = useState("");

    const [commentSubmitting, setCommentSubmitting] =
        useState(false);

    // =====================================================
    // DELETE MENU
    // =====================================================

    const [showMenu, setShowMenu] = useState(false);

    // =====================================================
    // LOAD COMMENTS
    // =====================================================

    useEffect(() => {
        if (!post?._id) {
            return;
        }

        const loadComments = async () => {
            try {
                setCommentsLoading(true);

                const result =
                    await getPostComments(post._id);

                setComments(
                    Array.isArray(result)
                        ? result
                        : [],
                );
            } catch (error) {
                console.error(
                    "Failed to fetch comments:",
                    error,
                );

                setComments([]);
            } finally {
                setCommentsLoading(false);
            }
        };

        loadComments();
    }, [post?._id]);

    // =====================================================
    // LIKE
    // =====================================================

    const handleLike = async () => {
        if (!user?._id || !post?._id) {
            return false;
        }

        try {
            const result = await toggleLike(
                user._id,
                post._id,
            );

            const newLikeCount = result.liked
                ? likeCount + 1
                : Math.max(0, likeCount - 1);

            setHasLiked(result.liked);
            setLikeCount(newLikeCount);

            return result.liked;
        } catch (error) {
            console.error(
                "Failed to toggle like:",
                error,
            );

            return false;
        }
    };

    // =====================================================
    // DOUBLE CLICK
    // Same behavior as PostCard
    // =====================================================

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

    // =====================================================
    // ADD COMMENT
    // =====================================================

    const handleSubmitComment = async (event) => {
        event.preventDefault();

        const content = commentText.trim();

        if (
            !user?._id ||
            !post?._id ||
            !content ||
            commentSubmitting
        ) {
            return;
        }

        try {
            setCommentSubmitting(true);

            const result = await createComment({
                userId: user._id,
                postId: post._id,
                content,
            });

            const commentWithUser = {
                ...result,

                userId: {
                    _id: user._id,
                    username: user.username,
                    profilePicture:
                        user.profilePicture,
                },
            };

            setComments((current) => [
                ...current,
                commentWithUser,
            ]);

            setCommentText("");
        } catch (error) {
            console.error(
                "Failed to create comment:",
                error,
            );
        } finally {
            setCommentSubmitting(false);
        }
    };

    // =====================================================
    // DELETE COMMENT
    // =====================================================

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);

            setComments((current) =>
                current.filter(
                    (comment) =>
                        comment._id !== commentId,
                ),
            );
        } catch (error) {
            console.error(
                "Failed to delete comment:",
                error,
            );
        }
    };

    // =====================================================
    // SHARE
    // =====================================================

    const handleShare = async () => {
        if (!post?._id) {
            return;
        }

        const url =
            `${window.location.origin}/singlepost/${post._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "PixGram",
                    text: "Check out this post on PixGram",
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);

                alert("Post link copied!");
            }
        } catch (error) {
            if (error?.name !== "AbortError") {
                console.error(
                    "Failed to share post:",
                    error,
                );
            }
        }
    };

    // =====================================================
    // PROFILE
    // =====================================================

    const handleProfileClick = () => {
        if (!post?.postedBy?.username) {
            return;
        }

        navigate(`/${post.postedBy.username}`);
    };

    // =====================================================
    // DELETE POST
    // =====================================================

    const handleDeletePost = () => {
        setShowMenu(false);

        onDeletePost?.(
            post._id,
            post.postedBy?._id,
        );
    };

    // =====================================================
    // SAFETY
    // =====================================================

    if (!post) {
        return null;
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="flex w-full justify-center px-4 py-8">

            {/* =================================================
                WINDOW
            ================================================= */}

            <article
                className="
                    relative
                    flex
                    h-[min(80vh,700px)]
                    w-full
                    max-w-[1100px]
                    flex-col
                    overflow-hidden
                    rounded-[8px]
                    bg-white
                    shadow-2xl
                    md:grid
                    md:grid-cols-[1.1fr_0.9fr]
                    md:grid-rows-[1fr_auto]
                "
            >

                {/* =================================================
                    CLOSE
                ================================================= */}

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close post"
                    className="
                        absolute
                        right-3
                        top-3
                        z-30
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border-none
                        bg-black/50
                        text-white
                        hover:bg-black/70
                    "
                >
                    <X size={20} />
                </button>

                {/* =================================================
                    POST IMAGE
                ================================================= */}

                <div
                    className="
                        relative
                        flex
                        min-h-0
                        cursor-pointer
                        items-center
                        justify-center
                        overflow-hidden
                        bg-black
                        md:row-start-1
                        md:col-start-1
                    "
                    onDoubleClick={handleDoubleClick}
                >
                    <img
                        src={post.imageUrl}
                        alt={post.caption || "Post"}
                        className="
                            h-full
                            w-full
                            object-contain
                        "
                    />

                    {/* =================================================
                        LIKE HEART
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
                                text-white
                                opacity-90
                            "
                        />
                    )}

                    {/* =================================================
                        HEART CRACK / UNLIKE
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

                {/* =================================================
                    COMMENTS
                ================================================= */}

                <div
                    className="
                        flex
                        min-h-0
                        flex-col
                        border-l
                        border-gray-200
                        bg-white
                        md:row-start-1
                        md:col-start-2
                    "
                >

                    {/* =============================================
                        POST HEADER
                    ============================================= */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-between
                            border-b
                            border-gray-200
                            px-4
                            py-3
                        "
                    >
                        <button
                            type="button"
                            onClick={handleProfileClick}
                            className="
                                flex
                                items-center
                                gap-3
                                border-none
                                bg-transparent
                                p-0
                                text-left
                            "
                        >
                            <img
                                src={
                                    post.postedBy
                                        ?.profilePicture
                                }
                                alt=""
                                className="
                                    h-10
                                    w-10
                                    rounded-full
                                    object-cover
                                "
                            />

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                {
                                    post.postedBy
                                        ?.username
                                }
                            </span>
                        </button>

                        {/* POST MENU */}

                        {canDelete && (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowMenu(
                                            (current) =>
                                                !current,
                                        )
                                    }
                                    className="
                                        border-none
                                        bg-transparent
                                        p-2
                                        text-gray-700
                                        hover:text-black
                                    "
                                >
                                    <MoreHorizontal
                                        size={20}
                                    />
                                </button>

                                {showMenu && (
                                    <div
                                        className="
                                            absolute
                                            right-0
                                            top-10
                                            z-20
                                            w-[150px]
                                            rounded-md
                                            bg-white
                                            py-1
                                            shadow-lg
                                            ring-1
                                            ring-black/5
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={
                                                handleDeletePost
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-2
                                                border-none
                                                bg-transparent
                                                px-4
                                                py-2
                                                text-left
                                                text-sm
                                                text-red-600
                                                hover:bg-red-50
                                            "
                                        >
                                            <Trash2
                                                size={16}
                                            />

                                            Delete post
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* =============================================
                        CAPTION + COMMENTS
                    ============================================= */}

                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            px-4
                            py-4
                        "
                    >

                        {/* CAPTION */}

                        {post.caption && (
                            <div
                                className="
                                    mb-5
                                    flex
                                    gap-3
                                "
                            >
                                <img
                                    src={
                                        post.postedBy
                                            ?.profilePicture
                                    }
                                    alt=""
                                    className="
                                        h-8
                                        w-8
                                        shrink-0
                                        rounded-full
                                        object-cover
                                    "
                                />

                                <p
                                    className="
                                        m-0
                                        text-sm
                                        leading-6
                                        text-gray-800
                                    "
                                >
                                    <span
                                        className="
                                            mr-2
                                            font-semibold
                                        "
                                    >
                                        {
                                            post.postedBy
                                                ?.username
                                        }
                                    </span>

                                    {post.caption}
                                </p>
                            </div>
                        )}

                        {/* COMMENTS */}

                        {commentsLoading ? (
                            <p
                                className="
                                    py-8
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Loading comments...
                            </p>
                        ) : comments.length === 0 ? (
                            <p
                                className="
                                    py-8
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No comments yet.
                            </p>
                        ) : (
                            <div className="space-y-5">
                                {comments.map(
                                    (comment) => (
                                        <div
                                            key={
                                                comment._id
                                            }
                                            className="
                                                flex
                                                gap-3
                                            "
                                        >
                                            <img
                                                src={
                                                    comment
                                                        .userId
                                                        ?.profilePicture
                                                }
                                                alt=""
                                                className="
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    rounded-full
                                                    object-cover
                                                "
                                            />

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >
                                                <p
                                                    className="
                                                        m-0
                                                        text-sm
                                                        text-gray-800
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            mr-2
                                                            font-semibold
                                                        "
                                                    >
                                                        {
                                                            comment
                                                                .userId
                                                                ?.username
                                                        }
                                                    </span>

                                                    {
                                                        comment.content
                                                    }
                                                </p>

                                                {/* DELETE OWN COMMENT */}

                                                {comment
                                                    .userId
                                                    ?._id ===
                                                    user?._id && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment._id,
                                                            )
                                                        }
                                                        className="
                                                            mt-1
                                                            border-none
                                                            bg-transparent
                                                            p-0
                                                            text-xs
                                                            text-gray-400
                                                            hover:text-red-500
                                                        "
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>

                    {/* =============================================
                        COMMENT INPUT
                    ============================================= */}

                    <form
                        onSubmit={handleSubmitComment}
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                            border-t
                            border-gray-200
                            px-4
                            py-3
                        "
                    >
                        <input
                            data-comment-input
                            type="text"
                            value={commentText}
                            onChange={(event) =>
                                setCommentText(
                                    event.target.value,
                                )
                            }
                            placeholder="Add a comment..."
                            className="
                                min-w-0
                                flex-1
                                rounded-full
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                outline-none
                                focus:border-green-500
                            "
                        />

                        <button
                            type="submit"
                            disabled={
                                commentSubmitting ||
                                !commentText.trim()
                            }
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border-none
                                bg-green-600
                                text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>

                {/* =================================================
                    BOTTOM ACTION PANEL
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-t
                        border-gray-200
                        bg-white
                        px-5
                        py-3
                        md:col-span-2
                        md:row-start-2
                    "
                >

                    {/* LEFT ACTIONS */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        {/* LIKE */}

                        <button
                            type="button"
                            onClick={handleLike}
                            aria-label={
                                hasLiked
                                    ? "Unlike"
                                    : "Like"
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                border-none
                                bg-transparent
                                p-2
                                text-gray-900
                            "
                        >
                            <Heart
                                size={24}
                                fill={
                                    hasLiked
                                        ? "currentColor"
                                        : "none"
                                }
                                className={
                                    hasLiked
                                        ? "text-red-500"
                                        : "text-gray-900"
                                }
                            />

                            <span className="text-sm">
                                {likeCount}
                            </span>
                        </button>

                        {/* COMMENT */}

                        <button
                            type="button"
                            onClick={() => {
                                document
                                    .querySelector(
                                        "[data-comment-input]",
                                    )
                                    ?.focus();
                            }}
                            aria-label="Comment"
                            className="
                                border-none
                                bg-transparent
                                p-2
                                text-gray-900
                            "
                        >
                            <MessageCircle
                                size={24}
                            />
                        </button>

                        {/* SHARE */}

                        <button
                            type="button"
                            onClick={handleShare}
                            aria-label="Share"
                            className="
                                border-none
                                bg-transparent
                                p-2
                                text-gray-900
                            "
                        >
                            <Send size={24} />
                        </button>
                    </div>

                    {/* LIKE COUNT */}

                    <div
                        className="
                            text-sm
                            font-semibold
                            text-gray-800
                        "
                    >
                        {likeCount}{" "}
                        {likeCount === 1
                            ? "like"
                            : "likes"}
                    </div>
                </div>
            </article>
        </div>
    );
}

export default PostWindow;