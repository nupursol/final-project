"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Show {
    id: number;
    name: string;
    status: string;
    rating: { average: number | null };
    image: { medium: string };
    genres: string[];
}

interface ShowsProps {
    subgenre: string;
}

export default function Shows({ subgenre }: ShowsProps) {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://api.tvmaze.com/shows");
                const data: Show[] = await res.json();
                const filtered = data.filter((show) =>
                    show.genres.includes(subgenre)
                );
                setShows(filtered);
            } catch (err) {
                console.error("Error fetching shows:", err);
            } finally {
                setLoading(false);
            }
        };

        void fetchData(); // tell TypeScript we're intentionally ignoring the promise
    }, [subgenre]);

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="grid gap-4 mt-4">
            {shows.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                    No shows found for &quot;{subgenre}&quot;.
                </p>
            ) : (
                shows.map((show) => (
                    <div
                        key={show.id}
                        className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
                    >
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
                            <h3 className="text-lg font-semibold">{show.name}</h3>
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