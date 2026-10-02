import { X, Image as ImageIcon } from "lucide-react";

function AddPostModal({
    newPostImage,
    newPostCaption,
    setNewPostCaption,
    fileInputRef,
    onImageUpload,
    onFileChange,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4">

            <div className="flex h-screen w-screen items-center justify-center">

                <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[5px] bg-white shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]">

                    {/* HEADER */}
                    <div className="flex shrink-0 items-center justify-between bg-white p-[10px]">

                        <h3 className="m-0 text-lg font-semibold">
                            Add Post
                        </h3>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="
                                flex
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                border-none
                                bg-transparent
                                p-1
                                text-gray-700
                                hover:bg-gray-100
                                hover:text-red-500
                            "
                            aria-label="Close"
                        >
                            <X size={26} />
                        </button>

                    </div>


                    {/* BODY */}
                    <div className="flex flex-col gap-[20px] overflow-y-auto border-b border-[rgba(200,200,200,0.1)] bg-white p-[10px]">

                        {/* IMAGE */}
                        <div className="h-[400px] w-full rounded-[5px] border-2 border-dashed border-[rgba(200,200,200,0.5)] bg-[rgba(200,200,200,0.1)]">

                            <div
                                className="
                                    flex
                                    h-full
                                    w-full
                                    cursor-pointer
                                    items-center
                                    justify-center
                                    rounded-[5px]
                                    bg-cover
                                    bg-center
                                    bg-no-repeat
                                "
                                style={{
                                    backgroundImage: newPostImage
                                        ? `url(${newPostImage})`
                                        : "none",
                                }}
                                onClick={onImageUpload}
                            >

                                {!newPostImage && (
                                    <ImageIcon
                                        size={90}
                                        strokeWidth={1.5}
                                        className="text-gray-400"
                                    />
                                )}

                            </div>


                            {/* HIDDEN FILE INPUT */}
                            <div className="hidden">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    onChange={onFileChange}
                                />
                            </div>

                        </div>


                        {/* POST DETAILS */}
                        <div className="flex w-full flex-col items-center justify-center gap-[10px] bg-white p-[2px]">

                            <input
                                type="text"
                                value={newPostCaption}
                                onChange={(e) =>
                                    setNewPostCaption(
                                        e.target.value
                                    )
                                }
                                placeholder="Caption"
                                className="
                                    w-full
                                    rounded-[5px]
                                    border
                                    border-[rgba(200,200,200,0.5)]
                                    p-[10px]
                                    text-[16px]
                                    outline-none
                                    focus:border-[#28a745]
                                "
                            />

                        </div>


                        {/* ADD BUTTON */}
                        <div className="flex w-full items-center justify-center gap-[10px] bg-white">

                            <button
                                type="button"
                                onClick={onSubmit}
                                className="
                                    w-full
                                    cursor-pointer
                                    rounded-[5px]
                                    border-none
                                    bg-[#28a745]
                                    px-[20px]
                                    py-[10px]
                                    text-[16px]
                                    text-white
                                    hover:bg-[#218838]
                                "
                            >
                                Add
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AddPostModal;