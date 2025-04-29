/*
    Jason Anghad's component
*/

"use client" //necessary for client side components in Next
import {useEffect, useState} from "react";

//sets up the structure of the joke (same as MP2)
interface Joke {
    id: number;
    type: string;
    setup: string;
    punchline: string
}

// prop interface for Joke subgenre 
interface JokesProps {
    subgenre: string;
}


export default function Jokes ( {subgenre}: JokesProps) {
    const [joke, setJoke] = useState<Joke | null>(null);//Stores the joke or null
    const [loading, setLoading] = useState(true); //State to keep track of loading

    const fetchJoke = async () => {
        setLoading(true);
        try {

            let jokeType = "general"; //Makes the default joke general but can be changed based on the subgenre selected

            if (subgenre === "Programming") {   
                jokeType = "programming";
            } else if (subgenre == "Dad Joke") {
                jokeType = "dad";
            } else if (subgenre === "Knock Knock") {
                jokeType = "knock-knock";
            }
            const endpoint = `https://official-joke-api.appspot.com/jokes/${jokeType}/random`;

            const response = await fetch (endpoint);
            //The API returns an array with one joke for whatever topic the user picks
            const data = await response.json();
            const result = Array.isArray(data) ? data [0] : data;
            setJoke (result);
        } catch (err) {
            console.error("Could not fetch joke:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { //Fetches the joke when the subgenre changes
        fetchJoke();
    }, [subgenre]);

    if (loading)  //If the joke is still loading, show a loading message
        return <p className = "text-center">Loading...</p>;

    if (!joke) { //If there is no joke, show a message saying that there is no joke for the subgenre
        return <p className = "text-center text-gray-500 italic">No joke found for &quot;{subgenre}&quot;.</p>;
    }
    
    return ( //styling the joke with formatting
        <div className="p-4 mt-4 bg-gray-200 rounded-lg shadow">
        <p className="text-lg font-semibold text-gray-700">{joke.setup}</p>
        <p className="mt-2 text-gray-900 italic">{joke.punchline}</p>
        <div className="mt-4 flex justify-end">
            <button 
                onClick={fetchJoke}
                className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-blue-600 transition"
            >
                Next Joke
            </button>
        </div>
    </div>
);
}