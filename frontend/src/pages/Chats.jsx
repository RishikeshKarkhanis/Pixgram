import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";

import { getChatList } from "../api/messages.api";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { conversationId } = useParams();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getChatList();

                setChats(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch chats:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    return (
        <div className="h-dvh bg-[#f4f2ee] text-black flex">

            {/* Conversation list */}
            <aside
                className={`
                    w-full
                    md:w-[350px]
                    bg-white
                    border-r border-gray-200
                    ${
                        conversationId
                            ? "hidden md:block"
                            : "block"
                    }
                `}
            >
                <div className="h-full flex flex-col">

                    {/* Header */}
                    <div className="
                        px-5
                        py-4
                        border-b
                        border-gray-200
                        flex
                        items-center
                        gap-3
                    ">

                        {/* Back to Home */}
                        <button
                            onClick={() => navigate("/")}
                            className="
                                w-9
                                h-9
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-gray-600
                                hover:text-[#28a745]
                                hover:bg-[#f4f2ee]
                                transition
                            "
                            title="Back to Home"
                        >
                            <ArrowLeft size={21} />
                        </button>

                        <h1 className="
                            text-xl
                            font-semibold
                        ">
                            Messages
                        </h1>

                    </div>


                    {/* Chats */}
                    <div className="flex-1 overflow-y-auto">

                        {loading ? (

                            <div className="
                                p-5
                                text-gray-500
                            ">
                                Loading...
                            </div>

                        ) : chats.length === 0 ? (

                            <div className="
                                h-full
                                flex
                                flex-col
                                items-center
                                justify-center
                                text-gray-400
                                px-6
                                text-center
                            ">
                                <MessageCircle
                                    size={42}
                                    strokeWidth={1.5}
                                />

                                <p className="mt-3">
                                    No conversations yet
                                </p>
                            </div>

                        ) : (

                            chats.map((chat) => (

                                <button
                                    key={chat.user._id}
                                    onClick={() =>
                                        navigate(
                                            `/chats/${chat.user._id}`
                                        )
                                    }
                                    className={`
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        px-5
                                        py-4
                                        text-left
                                        border-b
                                        border-gray-100
                                        border-l-4
                                        transition

                                        ${
                                            conversationId ===
                                            chat.user._id
                                                ? "bg-white border-l-[#28a745]"
                                                : "border-l-transparent hover:bg-[#f8f7f4]"
                                        }
                                    `}
                                >

                                    {/* Profile picture */}
                                    <img
                                        src={
                                            chat.user
                                                .profilePicture
                                        }
                                        alt={
                                            chat.user
                                                .username
                                        }
                                        className="
                                            w-12
                                            h-12
                                            rounded-full
                                            object-cover
                                        "
                                    />

                                    {/* User details */}
                                    <div className="
                                        min-w-0
                                        flex-1
                                    ">
                                        <p className="
                                            font-semibold
                                            truncate
                                        ">
                                            {
                                                chat.user
                                                    .username
                                            }
                                        </p>

                                        <p className="
                                            text-sm
                                            text-gray-500
                                            truncate
                                        ">
                                            {
                                                chat.lastMessage
                                            }
                                        </p>
                                    </div>

                                    {/* Date */}
                                    <span className="
                                        text-xs
                                        text-gray-400
                                    ">
                                        {new Date(
                                            chat.lastMessageAt
                                        ).toLocaleDateString()}
                                    </span>

                                </button>

                            ))

                        )}

                    </div>

                </div>
            </aside>


            {/* Chat window */}
            <main
                className={`
                    flex-1
                    ${
                        conversationId
                            ? "block"
                            : "hidden md:block"
                    }
                `}
            >
                <Outlet />
            </main>

        </div>
    );
};

export default Chats;