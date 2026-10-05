import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Send,
} from "lucide-react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getMessages,
    sendMessage,
    markMessagesAsRead,
} from "../api/messages.api";

import { getUserById } from "../api/users.api";

const ChatWindow = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatUser, setChatUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const [messagesData, userData] =
                    await Promise.all([
                        getMessages(conversationId),
                        getUserById(conversationId),
                    ]);

                setMessages(
                    Array.isArray(messagesData)
                        ? messagesData
                        : []
                );

                setChatUser(userData);

                await markMessagesAsRead(
                    conversationId
                );
            } catch (error) {
                console.error(
                    "Failed to fetch conversation:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        try {
            const newMessage = await sendMessage(
                conversationId,
                message.trim()
            );

            setMessages((previous) => [
                ...previous,
                newMessage,
            ]);

            setMessage("");
        } catch (error) {
            console.error(
                "Failed to send message:",
                error
            );
        }
    };

    return (
        <div className="
            h-full
            flex
            flex-col
            bg-[#f4f2ee]
        ">

            {/* ================= HEADER ================= */}
            <header className="
                h-16
                shrink-0
                bg-white
                border-b border-gray-200
                flex
                items-center
                gap-3
                px-4
            ">

                {/* Mobile back */}
                <button
                    onClick={() =>
                        navigate("/chats")
                    }
                    className="
                        md:hidden
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
                    title="Back to Chats"
                >
                    <ArrowLeft size={20} />
                </button>


                {/* User profile */}
                {chatUser && (
                    <>
                        <img
                            src={
                                chatUser.profilePicture
                            }
                            alt={
                                chatUser.username
                            }
                            className="
                                w-10
                                h-10
                                rounded-full
                                object-cover
                            "
                        />

                        <div className="
                            min-w-0
                        ">
                            <p className="
                                font-semibold
                                text-black
                                truncate
                            ">
                                {
                                    chatUser.username
                                }
                            </p>

                            <p className="
                                text-xs
                                text-gray-500
                            ">
                                Messages
                            </p>
                        </div>
                    </>
                )}

            </header>


            {/* ================= MESSAGES ================= */}
            <main className="
                flex-1
                min-h-0
                overflow-y-auto
                px-4
                py-6
            ">

                {loading ? (

                    <div className="
                        h-full
                        flex
                        items-center
                        justify-center
                        text-gray-400
                    ">
                        Loading messages...
                    </div>

                ) : messages.length === 0 ? (

                    <div className="
                        h-full
                        flex
                        items-center
                        justify-center
                        text-gray-400
                    ">
                        No messages yet
                    </div>

                ) : (

                    <div className="
                        max-w-3xl
                        mx-auto
                        space-y-3
                    ">

                        {messages.map((item) => {

                            const senderId =
                                item.sender?._id ||
                                item.sender;

                            const isMine =
                                senderId !==
                                conversationId;

                            return (
                                <div
                                    key={item._id}
                                    className={`
                                        flex
                                        ${
                                            isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        }
                                    `}
                                >

                                    <div
                                        className={`
                                            max-w-[75%]
                                            px-4
                                            py-2.5
                                            text-[15px]
                                            leading-relaxed
                                            shadow-sm

                                            ${
                                                isMine
                                                    ? `
                                                        bg-[#28a745]
                                                        text-white
                                                        rounded-2xl
                                                        rounded-br-md
                                                    `
                                                    : `
                                                        bg-white
                                                        text-gray-900
                                                        border
                                                        border-gray-200
                                                        rounded-2xl
                                                        rounded-bl-md
                                                    `
                                            }
                                        `}
                                    >
                                        {item.message}
                                    </div>

                                </div>
                            );
                        })}

                        <div
                            ref={messagesEndRef}
                        />

                    </div>
                )}

            </main>


            {/* ================= INPUT ================= */}
            <footer className="
                shrink-0
                bg-white
                border-t border-gray-200
                px-4
                py-3
            ">

                <form
                    onSubmit={handleSend}
                    className="
                        max-w-3xl
                        mx-auto
                        flex
                        items-center
                        gap-2
                    "
                >

                    <input
                        type="text"
                        value={message}
                        onChange={(e) =>
                            setMessage(
                                e.target.value
                            )
                        }
                        placeholder="Message..."
                        className="
                            flex-1
                            h-11
                            bg-[#f4f2ee]
                            border border-gray-200
                            rounded-full
                            px-5
                            text-black
                            text-sm
                            placeholder:text-gray-400
                            outline-none
                            focus:border-[#28a745]
                            focus:ring-1
                            focus:ring-[#28a745]
                            transition
                        "
                    />

                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="
                            w-11
                            h-11
                            shrink-0
                            rounded-full
                            bg-[#28a745]
                            text-white
                            flex
                            items-center
                            justify-center
                            hover:bg-[#218838]
                            active:scale-95
                            disabled:opacity-40
                            disabled:hover:bg-[#28a745]
                            transition
                        "
                    >
                        <Send
                            size={18}
                            strokeWidth={2}
                        />
                    </button>

                </form>

            </footer>

        </div>
    );
};

export default ChatWindow;