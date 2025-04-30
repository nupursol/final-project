/**
 *  All code in this file written by Nupur Solanki (nupursol - U26346441)
 */

"use client";
import { useEffect, useState } from "react";
import Image from "next/image"; // optimized image component from next.js

//defining the shape of a single show object we get from the tvmaze api
interface Show {
    id: number;
    name: string;
    status: string;
    rating: { average: number | null };
    image: { medium: string };
    genres: string[];
}
//props that this component takes in — basically the subgenre to filter shows by
interface ShowsProps {
    subgenre: string;
}

export default function Shows({ subgenre }: ShowsProps) {
    const [shows, setShows] = useState<Show[]>([]); // state to store list of shows
    const [loading, setLoading] = useState(true); // flag to show loading state

    // fetch data whenever subgenre changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                // get all shows
                const res = await fetch("https://api.tvmaze.com/shows");
                const data: Show[] = await res.json();
                // filter shows to only include ones that match the selected subgenre
                const filtered = data.filter((show) =>
                    show.genres.includes(subgenre)
                );
                setShows(filtered); //update state with filtered list
            } catch (err) {
                //log errors if something goes wrong
                console.error("Error fetching shows:", err);
            } finally {
                // turn off loading no matter what happens
                setLoading(false);
            }
        };
        void fetchData(); // just tells typescript we know this is async and we’re not awaiting it
    }, [subgenre]); // only re-run when subgenre changes
    // show a loading message while we wait for data
    if (loading) return <p className="text-center">Loading...</p>;
    return (
        <div className="grid gap-4 mt-4">
            {shows.length === 0 ? (
                //show a message if nothing matched the subgenre
                <p className="text-center text-gray-500 italic">
                    No shows found for &quot;{subgenre}&quot;.
                </p>
            ) : (
                //display results
                shows.map((show) => (
                    <div
                        key={show.id}
                        className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
                    >
                        {/* show an image if it exists */}
                        {show.image?.medium && (
                            <Image
                                src={show.image.medium}
                                alt={show.name}
                                width={64}
                                height={96}
                                className="rounded object-cover"
                            />
                        )}
                        <div>
                            {/* show name */}
                            <h3 className="text-lg font-semibold">{show.name}</h3>
                            {/* show rating and current status */}
                            <p className="text-sm text-gray-500">
                                Rating: {show.rating.average ?? "N/A"} | Status: {show.status}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}