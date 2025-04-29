/**
 *  All code in this file (except code common across files) written by Kevin Li (kevli - U56154766)
 */

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Song {
    id: { label: string , attributes: { "im:id": string }};         // song link and ID
    "im:name": { label: string };                                   // song title
    "im:collection": { "im:name": { label: string } };              // album title
    "im:releaseDate": { attributes: { label: string } };            // release date
    "im:artist": { label: string, attributes: { href: string } };   // artist and artist link
    "im:image": { label: string }[];                                // album images
    link: { attributes: { href: string } }[];                       // audio preview
}

interface SongsProps {
    subgenre: string;   // song genre name
}

export default function Music({ subgenre }: SongsProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    // function to convert genre names to genre IDs (as used in the iTunes API)
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
            // fetch top 10 songs in input subgenre from iTunes API
            const res = await fetch(`https://itunes.apple.com/us/rss/topsongs/genre=${subgenreId}/json`);
            // json structure is as follows: res.json().feed.entry, where entry is a list of songs and associated data
            const { feed } = await res.json();
            const { entry }: { entry: Song[] } = feed;
            setSongs(entry);
        }
        fetchData()
            .then(() => setLoading(false))
            .catch((e: Error) => console.error("Error fetching songs:", e));
    }, [subgenreId]);

    if (loading) return <p className="text-center">Loading...</p>;

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
                    <div    // row div for song information
                        key={song.id.attributes["im:id"]}
                        className="p-4 bg-white rounded-lg flex flex-row items-center gap-15"
                    >
                        {/* col div for album cover art and audio preview */}
                        <div className="flex flex-col items-center gap-3">
                            {/* album cover art */}
                            <Image
                                src={song["im:image"][2].label}                 // link to image
                                alt={song["im:collection"]["im:name"].label}    // album name
                                width={170}
                                height={170}
                                className="rounded object-cover"
                            />

                            {/* audio preview */}
                            <audio src={song.link[1].attributes.href} controls /> {/* link to audio */}
                        </div>

                        {/* col div for song name, album name, artist name, and release date */}
                        <div className="flex flex-col gap-2">
                            <Link href={song.id.label}> {/* link to song in album */}
                                <h2 className="text-lg font-bold">{song["im:name"].label}</h2> {/* song name */}
                            </Link>

                            {/* album name */}
                            <h4 className="text-sm font-medium">{song["im:collection"]["im:name"].label}</h4>

                            <Link href={song["im:artist"].attributes.href}> {/* link to artist profile */}
                                <h3 className="text-base font-semibold">{song["im:artist"].label}</h3> {/* artist name */}
                            </Link>

                            {/* release date */}
                            <h5 className="text-xs font-normal">{song["im:releaseDate"].attributes.label}</h5>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
