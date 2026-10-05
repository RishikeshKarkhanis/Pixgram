import { useEffect, useState } from "react";
import {
    Outlet,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    MessageCircle,
    ArrowLeft,
    Search,
    X,
} from "lucide-react";

import { getChatList } from "../api/messages.api";
import { searchUsers } from "../api/users.api";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const navigate = useNavigate();
    const { conversationId } = useParams();

    // Fetch existing conversations
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

    // Fetch chats
    useEffect(() => {
        fetchChats();
    }, [conversationId]);

    // Search users
    useEffect(() => {
        const query = search.trim();

        if (!query) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setSearching(true);

                const data = await searchUsers(query);

                setSearchResults(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to search users:",
                    error
                );

                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleUserClick = (userId) => {
        setSearch("");
        setSearchResults([]);

        navigate(`/chats/${userId}`);
    };

    const clearSearch = () => {
        setSearch("");
        setSearchResults([]);
    };

    return (
        <div className="
            h-dvh
            bg-[#f4f2ee]
            text-black
            flex
        ">

            {/* =========================
                CONVERSATION LIST
            ========================= */}
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
                <div className="
                    h-full
                    flex
                    flex-col
                ">

                    {/* HEADER */}
                    <div className="
                        px-5
                        py-4
                        border-b
                        border-gray-200
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            {/* Back to Home */}
                            <button
                                onClick={() =>
                                    navigate("/")
                                }
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
                                <ArrowLeft
                                    size={21}
                                />
                            </button>

                            <h1 className="
                                text-xl
                                font-semibold
                            ">
                                Messages
                            </h1>

                        </div>

                        {/* SEARCH */}
                        <div className="
                            relative
                            mt-4
                        ">

                            <Search
                                size={18}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search people..."
                                className="
                                    w-full
                                    h-11
                                    bg-[#f4f2ee]
                                    border
                                    border-gray-200
                                    rounded-full
                                    pl-11
                                    pr-10
                                    text-sm
                                    text-black
                                    placeholder:text-gray-400
                                    outline-none
                                    focus:border-[#28a745]
                                    focus:ring-1
                                    focus:ring-[#28a745]
                                    transition
                                "
                            />

                            {search && (
                                <button
                                    onClick={
                                        clearSearch
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        w-7
                                        h-7
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        text-gray-400
                                        hover:text-gray-700
                                        hover:bg-gray-200
                                        transition
                                    "
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>
                    </div>

                    {/* =========================
                        SEARCH RESULTS
                    ========================= */}
                    {search.trim() ? (

                        <div className="
                            flex-1
                            overflow-y-auto
                        ">

                            {searching ? (

                                <div className="
                                    p-5
                                    text-sm
                                    text-gray-500
                                ">
                                    Searching...
                                </div>

                            ) : searchResults.length === 0 ? (

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
                                    <Search
                                        size={38}
                                        strokeWidth={1.5}
                                    />

                                    <p className="mt-3">
                                        No users found
                                    </p>
                                </div>

                            ) : (

                                searchResults.map(
                                    (user) => (

                                        <button
                                            key={
                                                user._id
                                            }
                                            onClick={() =>
                                                handleUserClick(
                                                    user._id
                                                )
                                            }
                                            className="
                                                w-full
                                                flex
                                                items-center
                                                gap-3
                                                px-5
                                                py-3
                                                text-left
                                                border-b
                                                border-gray-100
                                                hover:bg-[#f8f7f4]
                                                transition
                                            "
                                        >

                                            <img
                                                src={
                                                    user.profilePicture
                                                }
                                                alt={
                                                    user.username
                                                }
                                                className="
                                                    w-11
                                                    h-11
                                                    rounded-full
                                                    object-cover
                                                "
                                            />

                                            <div className="
                                                min-w-0
                                                flex-1
                                            ">
                                                <p className="
                                                    font-semibold
                                                    truncate
                                                ">
                                                    {
                                                        user.username
                                                    }
                                                </p>

                                                <p className="
                                                    text-sm
                                                    text-gray-400
                                                ">
                                                    Start a conversation
                                                </p>
                                            </div>

                                        </button>
                                    )
                                )
                            )}

                        </div>

                    ) : (

                        /* =========================
                           EXISTING CHATS
                        ========================= */

                        <div className="
                            flex-1
                            overflow-y-auto
                        ">

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

                                    <p className="
                                        text-sm
                                        mt-1
                                    ">
                                        Search for someone
                                        to start chatting
                                    </p>
                                </div>

                            ) : (

                                chats.map((chat) => (

                                    <button
                                        key={
                                            chat.user._id
                                        }
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
                                                    ? `
                                                        bg-white
                                                        border-l-[#28a745]
                                                    `
                                                    : `
                                                        border-l-transparent
                                                        hover:bg-[#f8f7f4]
                                                    `
                                            }
                                        `}
                                    >

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
                    )}
                </div>
            </aside>

            {/* =========================
                CHAT WINDOW
            ========================= */}
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