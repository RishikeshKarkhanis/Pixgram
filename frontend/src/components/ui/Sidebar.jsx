import { House, User, Compass, Pencil, Plus, LogOut } from "lucide-react";

const Sidebar = ({
    onHome,
    onProfile,
    onExplore,
    onEdit,
    onCreatePost,
    onLogout,
}) => {
    return (
        <nav className="h-full w-full">
            <ul className="flex flex-col gap-2 px-3 py-6">
                <li
                    onClick={onHome}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-lg font-semibold hover:bg-gray-100"
                >
                    <House size={20} />
                    <span>Home</span>
                </li>

                <li
                    onClick={onProfile}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-lg font-semibold hover:bg-gray-100"
                >
                    <User size={20} />
                    <span>Profile</span>
                </li>

                <li
                    onClick={onExplore}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-lg font-semibold hover:bg-gray-100"
                >
                    <Compass size={20} />
                    <span>Explore</span>
                </li>

                <li
                    onClick={onEdit}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-lg font-semibold hover:bg-gray-100"
                >
                    <Pencil size={20} />
                    <span>Edit</span>
                </li>

                <li
                    onClick={onCreatePost}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-lg font-semibold hover:bg-gray-100"
                >
                    <Plus size={20} />
                    <span>Create</span>
                </li>

                <li
                    onClick={onLogout}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 text-lg font-semibold hover:bg-gray-100"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
