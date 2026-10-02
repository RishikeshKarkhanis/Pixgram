import { useEffect } from "react";
import {
    getStorage,
    ref,
    listAll,
    deleteObject,
} from "firebase/storage";

import { getCurrentUser, logoutUser } from "../api/auth.api.js";
import { deleteUser } from "../api/users.api.js";
import { storage } from "../../firebase.js";


function DeleteUser() {

    // =====================================================
    // DELETE FIREBASE FOLDER
    // =====================================================

    const deleteFolderRecursive = async (folderRef) => {

        const result = await listAll(folderRef);

        // Delete files
        await Promise.all(
            result.items.map((itemRef) => {
                console.log(
                    "Deleting file:",
                    itemRef.fullPath
                );

                return deleteObject(itemRef);
            })
        );

        // Delete subfolders recursively
        await Promise.all(
            result.prefixes.map((subfolderRef) =>
                deleteFolderRecursive(subfolderRef)
            )
        );
    };


    // =====================================================
    // DELETE ACCOUNT
    // =====================================================

    useEffect(() => {

        const handleDeleteAccount = async () => {

            try {

                // Get currently logged-in user
                const user = await getCurrentUser();

                if (!user?._id) {
                    window.location.href = "/auth";
                    return;
                }


                // Delete user and related data from MongoDB
                await deleteUser(user._id);

                console.log("User deleted from DB");


                // Delete user's Firebase files
                if (user.username) {

                    const userFolderRef =
                        ref(storage, user.username);

                    await deleteFolderRecursive(
                        userFolderRef
                    );

                    console.log(
                        `Deleted all Firebase files under ${user.username}/`
                    );
                }


                // Logout / clear cookie
                await logoutUser();

                console.log("User logged out");


                // Go back to auth page
                window.location.href = "/auth";

            } catch (error) {

                console.error(
                    "Error deleting account:",
                    error
                );

                // If deletion fails, don't silently
                // redirect the user.
            }
        };


        handleDeleteAccount();

    }, []);


    return null;
}


export default DeleteUser;