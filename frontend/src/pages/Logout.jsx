import { useEffect } from "react";
import { logoutUser } from "../api/auth.api.js";

function Logout() {
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutUser();
                window.location.href = "/";
            }

            catch (error) {
                console.error("Logout failed:", error);
                window.location.href = "/";
            }
        };
        handleLogout();
    }, []);

    return null;
}

export default Logout;
