import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { searchUsers } from "../../api/users.api.js";
import { useNavigate } from "react-router-dom";


function SearchModal({ onClose }) {

    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);


    // =================================================
    // SEARCH USERS
    // =================================================

    useEffect(() => {

        const search = async () => {

            const trimmedQuery = query.trim();

            if (!trimmedQuery) {
                setResults([]);
                return;
            }

            try {

                setLoading(true);

                const data = await searchUsers(
                    trimmedQuery
                );

                setResults(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Search failed:",
                    error
                );

                setResults([]);

            } finally {

                setLoading(false);

            }
        };


        const timeout = setTimeout(
            search,
            400
        );

        return () =>
            clearTimeout(timeout);

    }, [query]);


    // =================================================
    // OPEN PROFILE
    // =================================================

    const handleUserClick = (username) => {

        onClose();

        navigate(`/${username}`);
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                px-4
            "
        >

            <div
                className="
                    flex
                    w-full
                    max-w-lg
                    flex-col
                    overflow-hidden
                    rounded-[5px]
                    bg-white
                    shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                        px-4
                        py-3
                    "
                >

                    <h3 className="m-0 text-lg font-semibold">
                        Search
                    </h3>


                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close search"
                        className="
                            flex
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-full
                            border-none
                            bg-transparent
                            p-1
                            text-gray-600
                            hover:bg-gray-100
                            hover:text-red-500
                        "
                    >
                        <X size={24} />
                    </button>

                </div>


                {/* =================================================
                    BODY
                ================================================= */}

                <div className="flex flex-col gap-2 p-3">

                    {/* SEARCH INPUT */}

                    <div className="relative">

                        <Search
                            size={19}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) =>
                                setQuery(e.target.value)
                            }
                            autoFocus
                            placeholder="Search users..."
                            className="
                                w-full
                                rounded-[5px]
                                border
                                border-gray-300
                                py-2
                                pl-10
                                pr-3
                                text-[16px]
                                outline-none
                                focus:border-[#28a745]
                            "
                        />

                    </div>


                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    <div
                        className="
                            max-h-[300px]
                            overflow-y-auto
                        "
                    >

                        {loading ? (

                            <div className="px-3 py-4 text-center text-gray-500">
                                Searching...
                            </div>

                        ) : query.trim() && results.length === 0 ? (

                            <div className="px-3 py-4 text-center text-gray-500">
                                No users found.
                            </div>

                        ) : (

                            results.map((result) => (

                                <button
                                    key={result._id}
                                    type="button"
                                    onClick={() =>
                                        handleUserClick(
                                            result.username
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        cursor-pointer
                                        items-center
                                        justify-between
                                        border-none
                                        border-b
                                        border-gray-100
                                        bg-white
                                        px-2
                                        py-2
                                        text-left
                                        hover:bg-gray-50
                                    "
                                >

                                    <span className="text-[17px] font-medium">
                                        {result.username}
                                    </span>


                                    <img
                                        src={
                                            result.profilePicture
                                        }
                                        alt={
                                            result.username
                                        }
                                        className="
                                            h-11
                                            w-11
                                            rounded-full
                                            object-cover
                                        "
                                    />

                                </button>

                            ))

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}


export default SearchModal;