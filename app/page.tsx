/**
 *  Final Project Entertainment App
 *  by Nupur Solanki, Jason Anghad, Kevin Li, Jason Senecharles, Liala Jama
 *
 *  This file was collaborative and contributed to by all 5 of us
 */

"use client"; //client-side component
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import Shows from "@/components/Shows";
import Music from "@/components/Music";
import Jokes from "@/components/Jokes";
import Books from "@/components/Books";
import Trivia from "@/components/Trivia";

// lottie animation so we disable server-side rendering here
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "@/public/lottie/entertainment.json"; //animation imported from lottie.com

// entertainment types + subgenres
const entertainmentOptions = {
    Jokes: ["General", "Programming", "Knock Knock", "Dad Joke"],
    Show: ["Drama", "Romance", "Action", "Comedy", "Crime", "Science-Fiction"],
    Books: ["Science Fiction", "Young Adult", "Poetry", "Action"],
    Music: ["Pop", "Hip-Hop/Rap", "Rock", "R&B/Soul", "Alternative", "Jazz"],
    Trivia: ["General Knowledge", "Science: Computers", "History", "Sports", "Entertainment: Music"],
};

export default function HomePage() {
    // keeps track of which main form (jokes, shows, etc.) is picked
    const [selectedForm, setSelectedForm] = useState<keyof typeof entertainmentOptions | null>(null);
    // keeps track of which subgenre is picked
    const [selectedSubgenre, setSelectedSubgenre] = useState<string>("");

    // when someone picks a main entertainment form
    const handleFormSelect = (form: keyof typeof entertainmentOptions) => {
        setSelectedForm(form);
        setSelectedSubgenre(""); // reset subgenre when form changes
    };

    // when someone picks a subgenre
    const handleSubgenreSelect = (sub: string) => {
        setSelectedSubgenre(sub);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex flex-col items-center justify-start p-6">
            {/* lottie animation at the top with fade-in effect */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="mb-8">
                <Lottie animationData={animationData} className="w-40 h-40" loop />
            </motion.div>

            {/* main page title */}
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                       className="text-3xl md:text-5xl font-extrabold mb-10 text-center text-purple-700">
                what form of entertainment would you like?
            </motion.h1>

            {/* buttons for each form type (jokes, shows, etc.) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
                {Object.keys(entertainmentOptions).map((form) => (
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} key={form}
                                   onClick={() => handleFormSelect(form as keyof typeof entertainmentOptions)}
                                   className={`px-5 py-3 rounded-2xl font-semibold text-white shadow-lg transition duration-300 ${
                                       selectedForm === form
                                           ? "bg-purple-700 shadow-purple-400/60"
                                           : "bg-purple-500 hover:bg-purple-600 hover:shadow-purple-300/60"
                                   }`}>
                        {form}
                    </motion.button>
                ))}
            </motion.div>

            {/* show subgenre buttons after a form is selected */}
            {selectedForm && (
                <>
                    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                               className="text-2xl font-bold mb-6 text-pink-700">
                        pick a subgenre:
                    </motion.h2>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                                className={`grid grid-cols-2 ${
                                    entertainmentOptions[selectedForm].length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
                                } gap-5 mb-12`}>
                        {entertainmentOptions[selectedForm].map((sub) => (
                            <motion.button key={sub} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                           onClick={() => handleSubgenreSelect(sub)}
                                           className={`px-6 py-3 rounded-2xl font-medium shadow-md text-white transition-all duration-300 ${
                                               selectedSubgenre === sub
                                                   ? "bg-pink-600 shadow-pink-400/50"
                                                   : "bg-pink-400 hover:bg-pink-500 hover:shadow-pink-300/50"
                                           }`}>
                                {sub}
                            </motion.button>
                        ))}
                    </motion.div>
                </>
            )}

            {/* show the actual recommendations once both form and subgenre are picked */}
            {selectedForm && selectedSubgenre && (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                            className="w-full max-w-3xl p-6 bg-white rounded-2xl shadow-2xl border border-purple-300 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition-all duration-500">
                    {selectedForm === "Show" && <Shows subgenre={selectedSubgenre} />}
                    {selectedForm === "Music" && <Music subgenre={selectedSubgenre} />}
                    {selectedForm === "Jokes" && <Jokes subgenre={selectedSubgenre} />}
                    {selectedForm === "Books" && <Books subgenre={selectedSubgenre} />}
                    {selectedForm === "Trivia" && <Trivia category={selectedSubgenre} />}
                </motion.div>
            )}
        </main>
    );
}
