import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Logout from "./pages/Logout.jsx";
import Edit from "./pages/Edit.jsx";
import DeleteUser from "./pages/DeleteUser.jsx";
import Profile from "./pages/Profile.jsx";
import Posts from "./pages/Posts.jsx";
import Chats from "./pages/Chats";
import ChatWindow from "./pages/ChatWindow";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/singlepost/:postId" element={<Posts />} />

            <Route path="/logout" element={<Logout />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/delete_user" element={<DeleteUser />} />

            <Route path="/:username" element={<Profile />} />

            <Route path="/chats" element={<Chats />}>
                <Route path=":conversationId" element={<ChatWindow />} />
            </Route>

            <Route path="*" element={<h1>404 Not Found</h1>} />

        </Routes>
    );
}

export default App;