import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Bell,
    House,
    User,
    Pencil,
    CirclePlus,
    LogOut,
} from "lucide-react";


function Navbar({
    user,
    onSearch,
    onNotifications,
    onCreatePost,
}) {

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [notificationOpen, setNotificationOpen] =
        useState(false);


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

    const handleNotifications = () => {

        setProfileOpen(false);

        setNotificationOpen(
            (previous) => !previous
        );

        onNotifications?.();
    };


    // =====================================================
    // PROFILE DROPDOWN
    // =====================================================

    const handleProfile = () => {

        setNotificationOpen(false);

        setProfileOpen(
            (previous) => !previous
        );
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

                        <Bell size={21} />

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
                        src={
                            user?.profilePicture
                        }

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

                FIXED TO SCREEN RIGHT EDGE

                Works on desktop + mobile.
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
                            my-[5px]

                            w-full

                            list-none

                            p-0
                        "
                    >

                        <li
                            className="
                                my-[5px]
                            "
                        >

                            <p
                                className="
                                    m-0

                                    px-4
                                    py-2

                                    text-[18px]
                                    text-black
                                "
                            >
                                No new notifications.
                            </p>

                        </li>

                    </ul>

                </div>

            )}

        </nav>
    );
}


export default Navbar;