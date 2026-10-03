import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
} from "../../api/notifications.api.js";

import {
    Search,
    Bell,
    House,
    User,
    Pencil,
    CirclePlus,
    LogOut,
} from "lucide-react";


function Navbar({ user, onSearch, onNotifications, onCreatePost }) {
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);


    // =====================================================
    // LOAD UNREAD COUNT
    // =====================================================

    useEffect(() => {
        const loadUnreadCount = async () => {
            try {
                const data = await getUnreadNotificationCount();

                setUnreadCount(data?.count || 0);
            } catch (error) {
                console.error(
                    "Failed to fetch unread notification count:",
                    error
                );
            }
        };

        loadUnreadCount();
    }, []);


    // =====================================================
    // HOME
    // =====================================================

    const goHome = () => {
        setProfileOpen(false);
        setNotificationOpen(false);

        navigate("/");
    };


    // =====================================================
    // PROFILE
    // =====================================================

    const goToProfile = () => {
        setProfileOpen(false);
        setNotificationOpen(false);

        if (!user?.username) {
            return;
        }

        navigate(`/${user.username}`);
    };


    // =====================================================
    // EDIT
    // =====================================================

    const goToEdit = () => {
        setProfileOpen(false);
        setNotificationOpen(false);

        navigate("/edit");
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {
        setProfileOpen(false);
        setNotificationOpen(false);

        onSearch?.();
    };


    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    const handleNotifications = async () => {
        setProfileOpen(false);

        const willOpen = !notificationOpen;

        setNotificationOpen(willOpen);

        if (!willOpen) {
            return;
        }

        try {
            setNotificationsLoading(true);

            const data = await getNotifications();

            const notificationList =
                Array.isArray(data) ? data : [];

            setNotifications(notificationList);

            // Keep badge synchronized with backend
            const unread = notificationList.filter(
                (notification) => notification.read === false
            ).length;

            setUnreadCount(unread);

        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error
            );

            setNotifications([]);

        } finally {
            setNotificationsLoading(false);
        }

        onNotifications?.();
    };


    // =====================================================
    // MARK NOTIFICATION AS READ
    // =====================================================

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read if unread
            if (!notification.read) {
                await markNotificationAsRead(notification._id);

                setNotifications((previous) =>
                    previous.map((item) =>
                        item._id === notification._id
                            ? {
                                ...item,
                                read: true,
                            }
                            : item
                    )
                );

                setUnreadCount((previous) =>
                    Math.max(previous - 1, 0)
                );
            }

            // Close notification dropdown
            setNotificationOpen(false);

            // Follow notification → sender's profile
            if (
                notification.type === "follow" &&
                notification.sender?.username
            ) {
                navigate(`/${notification.sender.username}`);
                return;
            }

            // Like / Comment notification → post
            if (
                (notification.type === "like" ||
                    notification.type === "comment") &&
                notification.post?._id
            ) {
                navigate(`/singlepost/${notification.post._id}`);
                return;
            }
        } catch (error) {
            console.error(
                "Failed to handle notification click:",
                error
            );
        }
    };


    // =====================================================
    // PROFILE DROPDOWN
    // =====================================================

    const handleProfile = () => {
        setNotificationOpen(false);

        setProfileOpen((previous) => !previous);
    };


    // =====================================================
    // ADD POST
    // =====================================================

    const handleCreatePost = () => {
        setProfileOpen(false);
        setNotificationOpen(false);

        onCreatePost?.();
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        setProfileOpen(false);
        setNotificationOpen(false);

        navigate("/logout");
    };


    return (
        <nav
            className="
                fixed
                left-0
                top-0
                z-40

                flex
                w-full
                items-center
                justify-between

                bg-white

                px-[5px]
                pt-[2px]
                pb-[6px]

                shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]
            "
        >

            {/* =================================================
                LOGO
            ================================================= */}

            <div
                className="
                    flex
                    items-center
                "
            >
                <button
                    type="button"
                    onClick={goHome}
                    className="
                        border-none
                        bg-transparent
                        p-0
                    "
                >
                    <h1
                        className="
                            m-0
                            text-[38px]
                            leading-none
                        "
                    >
                        <span className="text-green-600">
                            Pix
                        </span>

                        <span className="text-black">
                            Gram
                        </span>
                    </h1>
                </button>
            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-end
                    gap-[5px]
                "
            >

                {/* =================================================
                    SEARCH
                ================================================= */}

                <button
                    type="button"
                    onClick={handleSearch}
                    aria-label="Search"
                    className="
                        flex
                        h-[50px]
                        w-[50px]

                        cursor-pointer

                        items-center
                        justify-center

                        rounded-full

                        border-none
                        bg-transparent

                        text-black

                        hover:text-[#28a745]
                    "
                >
                    <Search size={21} />
                </button>


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <div
                    className="
                        relative
                        flex
                        items-center
                    "
                >
                    <button
                        type="button"
                        onClick={handleNotifications}
                        aria-label="Notifications"
                        className="
                            flex
                            h-[50px]
                            w-[50px]

                            cursor-pointer

                            items-center
                            justify-center

                            rounded-full

                            border-none
                            bg-transparent

                            text-black

                            hover:text-[#28a745]
                        "
                    >

                        <div className="relative">

                            <Bell size={21} />

                            {/* UNREAD BADGE */}

                            {unreadCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -right-[7px]
                                        -top-[7px]

                                        flex

                                        h-[18px]
                                        min-w-[18px]

                                        items-center
                                        justify-center

                                        rounded-full

                                        bg-green-600

                                        px-[4px]

                                        text-[10px]
                                        font-bold
                                        leading-none
                                        text-white
                                    "
                                >
                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}
                                </span>
                            )}

                        </div>

                    </button>
                </div>


                {/* =================================================
                    PROFILE
                ================================================= */}

                <div
                    className="
                        relative
                        flex
                        items-center
                        pb-[3px]
                    "
                >

                    <img
                        src={user?.profilePicture}
                        alt="Profile"
                        onClick={handleProfile}
                        className="
                            ml-[10px]

                            h-[50px]
                            w-[50px]

                            cursor-pointer

                            rounded-full

                            bg-white

                            object-cover
                        "
                    />


                    {/* =================================================
                        PROFILE DROPDOWN
                        MOBILE ONLY
                    ================================================= */}

                    {profileOpen && (
                        <div
                            className="
                                absolute

                                right-[2px]
                                top-[58px]

                                hidden

                                w-[170px]

                                rounded-[5px]

                                bg-white

                                shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]

                                min-[0px]:block
                                min-[600px]:hidden
                            "
                        >

                            <ul
                                className="
                                    my-[5px]
                                    list-none
                                    p-0
                                "
                            >

                                {/* HOME */}

                                <li className="my-[3px]">

                                    <button
                                        type="button"
                                        onClick={goHome}
                                        className="
                                            flex
                                            w-full

                                            cursor-pointer

                                            items-center
                                            gap-2

                                            border-none
                                            bg-transparent

                                            px-4
                                            py-2

                                            text-left
                                            text-[18px]
                                            text-black

                                            hover:bg-gray-100
                                            hover:text-[#28a745]
                                        "
                                    >
                                        <House size={19} />

                                        <span>
                                            Home
                                        </span>
                                    </button>

                                </li>


                                {/* PROFILE */}

                                <li className="my-[3px]">

                                    <button
                                        type="button"
                                        onClick={goToProfile}
                                        className="
                                            flex
                                            w-full

                                            cursor-pointer

                                            items-center
                                            gap-2

                                            border-none
                                            bg-transparent

                                            px-4
                                            py-2

                                            text-left
                                            text-[18px]
                                            text-black

                                            hover:bg-gray-100
                                            hover:text-[#28a745]
                                        "
                                    >
                                        <User size={19} />

                                        <span>
                                            Profile
                                        </span>
                                    </button>

                                </li>


                                {/* EDIT */}

                                <li className="my-[3px]">

                                    <button
                                        type="button"
                                        onClick={goToEdit}
                                        className="
                                            flex
                                            w-full

                                            cursor-pointer

                                            items-center
                                            gap-2

                                            border-none
                                            bg-transparent

                                            px-4
                                            py-2

                                            text-left
                                            text-[18px]
                                            text-black

                                            hover:bg-gray-100
                                            hover:text-[#28a745]
                                        "
                                    >
                                        <Pencil size={19} />

                                        <span>
                                            Edit
                                        </span>
                                    </button>

                                </li>


                                {/* ADD POST */}

                                <li className="my-[3px]">

                                    <button
                                        type="button"
                                        onClick={handleCreatePost}
                                        className="
                                            flex
                                            w-full

                                            cursor-pointer

                                            items-center
                                            gap-2

                                            border-none
                                            bg-transparent

                                            px-4
                                            py-2

                                            text-left
                                            text-[18px]
                                            text-black

                                            hover:bg-gray-100
                                            hover:text-[#28a745]
                                        "
                                    >
                                        <CirclePlus size={19} />

                                        <span>
                                            Add Post
                                        </span>
                                    </button>

                                </li>


                                {/* LOGOUT */}

                                <li className="my-[3px]">

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="
                                            flex
                                            w-full

                                            cursor-pointer

                                            items-center
                                            gap-2

                                            border-none
                                            bg-transparent

                                            px-4
                                            py-2

                                            text-left
                                            text-[18px]
                                            text-red-600

                                            hover:bg-red-50
                                        "
                                    >
                                        <LogOut size={19} />

                                        <span>
                                            Logout
                                        </span>
                                    </button>

                                </li>

                            </ul>

                        </div>
                    )}

                </div>

            </div>


            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {notificationOpen && (
                <div
                    className="
                        fixed

                        right-[5px]
                        top-[62px]

                        flex

                        w-[300px]
                        max-w-[calc(100vw-10px)]

                        justify-center

                        rounded-[5px]

                        bg-white

                        shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]
                    "
                >

                    <ul
                        className="
                            max-h-[420px]
                            w-full
                            overflow-y-auto
                        "
                    >

                        {/* LOADING */}

                        {notificationsLoading ? (

                            <li
                                className="
                                    px-4
                                    py-6

                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Loading...
                            </li>

                        ) : notifications.length === 0 ? (

                            /* EMPTY */

                            <li
                                className="
                                    px-4
                                    py-6

                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No notifications yet.
                            </li>

                        ) : (

                            /* NOTIFICATIONS */

                            notifications.map((notification) => (

                                <li
                                    key={notification._id}

                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }

                                    className={`
                                        flex
                                        cursor-pointer
                                        gap-3

                                        border-b
                                        border-gray-100

                                        px-4
                                        py-3

                                        hover:bg-gray-50

                                        ${!notification.read
                                            ? "bg-green-50"
                                            : "bg-white"
                                        }
                                    `}
                                >

                                    {/* POST IMAGE */}

                                    {notification.post?.imageUrl && (
                                        <img
                                            src={
                                                notification
                                                    .post
                                                    .imageUrl
                                            }
                                            alt="Post"

                                            className="
                                                h-11
                                                w-11
                                                shrink-0

                                                rounded-lg

                                                object-cover
                                            "
                                        />
                                    )}


                                    {/* NOTIFICATION CONTENT */}

                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >

                                        {/* FOLLOW */}

                                        {notification.type ===
                                            "follow" && (

                                                <p
                                                    className="
                                                    text-sm
                                                    text-gray-800
                                                "
                                                >
                                                    <span
                                                        className="
                                                        font-semibold
                                                    "
                                                    >
                                                        {
                                                            notification
                                                                .sender
                                                                ?.username
                                                        }
                                                    </span>{" "}
                                                    started following
                                                    you.
                                                </p>

                                            )}


                                        {/* LIKE */}

                                        {notification.type ===
                                            "like" && (

                                                <p
                                                    className="
                                                    text-sm
                                                    text-gray-800
                                                "
                                                >
                                                    <span
                                                        className="
                                                        font-semibold
                                                    "
                                                    >
                                                        {
                                                            notification
                                                                .sender
                                                                ?.username
                                                        }
                                                    </span>{" "}
                                                    liked your post.
                                                </p>

                                            )}


                                        {/* COMMENT */}

                                        {notification.type ===
                                            "comment" && (

                                                <>

                                                    <p
                                                        className="
                                                        text-sm
                                                        text-gray-800
                                                    "
                                                    >
                                                        <span
                                                            className="
                                                            font-semibold
                                                        "
                                                        >
                                                            {
                                                                notification
                                                                    .sender
                                                                    ?.username
                                                            }
                                                        </span>{" "}
                                                        commented on your
                                                        post.
                                                    </p>


                                                    {notification.comment
                                                        ?.content && (

                                                            <p
                                                                className="
                                                            mt-1
                                                            truncate
                                                            text-sm
                                                            text-gray-500
                                                        "
                                                            >
                                                                "
                                                                {
                                                                    notification
                                                                        .comment
                                                                        .content
                                                                }
                                                                "
                                                            </p>

                                                        )}

                                                </>

                                            )}


                                        {/* TIME */}

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-gray-400
                                            "
                                        >
                                            {new Date(
                                                notification.createdAt
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </li>

                            ))

                        )}

                    </ul>

                </div>
            )}

        </nav>
    );
}

export default Navbar;