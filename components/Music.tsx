/**
 *  All code in this file (except code common across files) written by Kevin Li (U56154766)
 */

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Song {
    id: { label: string , attributes: { "im:id": string }};         // song link and ID
    "im:name": { label: string }                                    // song title
    "im:collection": { "im:name": { label: string } };              // album title
    "im:releaseDate": { attributes: { label: string } };            // release date
    "im:artist": { label: string, attributes: { href: string } };   // artist and artist link
    "im:image": { label: string }[];                                // album images
    link: { attributes: { href: string } }[];                                                 // audio preview
}

interface SongsProps {
    subgenre: string;   // song genre as a string
}

export default function Music({ subgenre }: SongsProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    // function to convert genre names to genre IDs (as used in the API)
    function subgenreToId(subgenre: string): number {
        if (subgenre === "Pop") {
            return 14;
        } else if (subgenre === "Hip-Hop/Rap") {
            return 18;
        } else if (subgenre === "Rock") {
            return 21;
        } else if (subgenre === "R&B/Soul") {
            return 15
        } else if (subgenre === "Alternative") {
            return 20;
        } else if (subgenre === "Jazz") {
            return 11;
        } else {
            return 14;      // default genre will be Pop
        }
    }
    const subgenreId: number = subgenreToId(subgenre);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            const res = await fetch(`https://itunes.apple.com/us/rss/topsongs/genre=${subgenreId}/json`);
            const { feed } = await res.json();
            const { entry }: { entry: Song[] } = feed;
            setSongs(entry);
        }
        fetchData()
            .then(() => setLoading(false))
            .catch((e: Error) => console.error("Error fetching songs:", e));
    }, [subgenreId]);

    if (loading) return <p className="text-center">Loading...</p>;

    console.log(songs)

    /** display in following order:
     *      - album cover art
     *      - audio preview
     *      - song name (with link to song in album)
     *      - album name
     *      - artist name (with link to artist profile)
     *      - release date
     */
    return (
        <div className="grid gap-4 mt-4">
            {songs.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                    No songs found for &quot;{subgenre}&quot;.
                </p>
            ) : (
                songs.map((song) => (
                    <div
                        key={song.id.attributes["im:id"]}
                        className="p-4 bg-white rounded-lg flex flex-col items-center gap-2.5"
                    >
                        <Image
                            src={song["im:image"][0].label}
                            alt={song["im:collection"]["im:name"].label}
                            width={64}
                            height={96}
                            className="rounded object-cover"
                        />

                        <audio src={song.link[1].attributes.href} controls />

                        <Link href={song.id.label}>
                            <h2 className="text-lg font-semibold">{song["im:name"].label}</h2>
                        </Link>

                        <h4 className="text-lg font-semibold">{song["im:collection"]["im:name"].label}</h4>

                        <Link href={song["im:artist"].attributes.href}>
                            <h3 className="text-lg font-semibold">{song["im:artist"].label}</h3>
                        </Link>

                        <h5 className="text-lg font-semibold">{song["im:releaseDate"].attributes.label}</h5>
                    </div>
                ))
            )}
        </div>
    );
}
