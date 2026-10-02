import apiClient from "./client";


// Get all follows
export const getFollows = () =>
    apiClient("/follows/");


// Check whether follower follows following
export const isFollowing = (
    following,
    follower
) =>
    apiClient(
        "/follows/isfollowing",
        {
            method: "POST",
            body: JSON.stringify({
                following,
                follower,
            }),
        }
    );


// Create follow
export const createFollow = (
    following,
    follower
) =>
    apiClient(
        "/follows/create",
        {
            method: "POST",
            body: JSON.stringify({
                following,
                follower,
            }),
        }
    );


// Delete follow
export const deleteFollow = (
    following,
    follower
) =>
    apiClient(
        "/follows/delete",
        {
            method: "DELETE",
            body: JSON.stringify({
                following,
                follower,
            }),
        }
    );