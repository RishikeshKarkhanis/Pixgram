import { useState } from "react";
import { X, Send } from "lucide-react";

const CommentsModal = ({
    comments,
    user,
    profilePicture,
    currentPostId,
    onClose,
    onDeleteComment,
    onPostComment,
}) => {

    const [commentText, setCommentText] = useState("");


    const handleSubmit = async () => {

        const content = commentText.trim();

        if (!content) {
            return;
        }

        await onPostComment(
            currentPostId,
            content
        );

        setCommentText("");
    };


    const handleKeyDown = (e) => {

        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }

    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

            <div className="flex h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-xl">

                {/* HEADER */}
                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">

                    <h3 className="text-lg font-semibold">
                        Comments
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-600 hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* COMMENTS BODY */}
                <div className="flex-1 overflow-y-auto">

                    {comments && comments.length > 0 ? (

                        comments.map((comment) => (

                            <div
                                key={comment._id}
                                className="border-b border-gray-100 px-4 py-3"
                            >

                                {/* COMMENT HEADER */}
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2">

                                        <img
                                            src={
                                                comment.userId
                                                    ?.profilePicture
                                            }
                                            alt=""
                                            className="
                                                h-8
                                                w-8
                                                rounded-full
                                                object-cover
                                            "
                                        />

                                        <span className="font-semibold">
                                            {comment.userId?.username}
                                        </span>

                                    </div>


                                    {/* DELETE */}
                                    {comment.userId?._id === user?._id && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDeleteComment(
                                                    comment._id
                                                )
                                            }
                                            className="
                                                rounded-full
                                                p-1
                                                text-gray-500
                                                hover:bg-gray-100
                                                hover:text-red-500
                                            "
                                        >
                                            <X size={17} />
                                        </button>

                                    )}

                                </div>


                                {/* COMMENT CONTENT */}
                                <p className="ml-10 mt-1 text-sm text-gray-700">
                                    {comment.content}
                                </p>

                            </div>

                        ))

                    ) : (

                        <div className="flex h-full items-center justify-center">

                            <p className="text-gray-600">
                                No comments available.
                            </p>

                        </div>

                    )}

                </div>


                {/* ADD COMMENT */}
                <div className="shrink-0 border-t border-gray-200 bg-white p-3">

                    <div className="flex items-center gap-2">

                        <img
                            src={profilePicture}
                            alt=""
                            className="
                                h-8
                                w-8
                                shrink-0
                                rounded-full
                                object-cover
                            "
                        />

                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) =>
                                setCommentText(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Write a comment..."
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
                                focus:border-green-600
                            "
                        />


                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!commentText.trim()}
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-green-600
                                hover:bg-green-50
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <Send size={20} />
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CommentsModal;