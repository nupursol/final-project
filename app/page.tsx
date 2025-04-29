"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import Shows from "@/components/Shows";
import Music from "@/components/Music";
import Jokes from "@/components/Jokes";
import Books from "@/components/Books";
import Trivia from "@/components/Trivia";

// Dynamic import Lottie (disable SSR)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "@/public/lottie/entertainment.json";

const entertainmentOptions = {
    Jokes: ["General", "Programming", "Knock Knock", "Dad Joke"],
    Show: ["Drama", "Romance", "Action", "Comedy", "Crime", "Science-Fiction"],
    Books: ["Science Fiction", "Young Adult", "Poetry", "Action"],
    Music: ["Pop", "Hip-Hop/Rap", "Rock", "R&B/Soul", "Alternative", "Jazz"],
    Trivia: ["General Knowledge", "Science: Computers", "History", "Sports", "Entertainment: Music"],
};

export default function HomePage() {
    const [selectedForm, setSelectedForm] = useState<keyof typeof entertainmentOptions | null>(null);
    const [selectedSubgenre, setSelectedSubgenre] = useState<string>("");
    const handleFormSelect = (form: keyof typeof entertainmentOptions) => {
        setSelectedForm(form);
        setSelectedSubgenre("");
    };
    const handleSubgenreSelect = (sub: string) => {
        setSelectedSubgenre(sub);
    };
    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex flex-col items-center justify-start p-6">
            {/* 🎬 Fade-in Lottie Animation */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
                className="mb-8"
            >
                <Lottie animationData={animationData} className="w-40 h-40" loop />
            </motion.div>
            {/* Page Title */}
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="text-3xl md:text-5xl font-extrabold mb-10 text-center text-purple-700"
            >
                What form of entertainment would you like?
            </motion.h1>
            {/* Form Options */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10"
            >
                {Object.keys(entertainmentOptions).map((form) => (
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} key={form}
                        onClick={() => handleFormSelect(form as keyof typeof entertainmentOptions)}
                        className={`px-5 py-3 rounded-2xl font-semibold text-white shadow-lg transition duration-300 ${
                            selectedForm === form
                                ? "bg-purple-700 shadow-purple-400/60"
                                : "bg-purple-500 hover:bg-purple-600 hover:shadow-purple-300/60"
                        }`}
                    >
                        {form}
                    </motion.button>
                ))}
            </motion.div>
            {/* Subgenre Options */}
            {selectedForm && (
                <>
                    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                        className="text-2xl font-bold mb-6 text-pink-700"
                    >
                        Pick a subgenre:
                    </motion.h2>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                        className={`grid grid-cols-2 ${
                            entertainmentOptions[selectedForm].length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
                        } gap-5 mb-12`}
                    >
                        {entertainmentOptions[selectedForm].map((sub) => (
                            <motion.button key={sub} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleSubgenreSelect(sub)}
                                className={`px-6 py-3 rounded-2xl font-medium shadow-md text-white transition-all duration-300 ${
                                    selectedSubgenre === sub
                                        ? "bg-pink-600 shadow-pink-400/50"
                                        : "bg-pink-400 hover:bg-pink-500 hover:shadow-pink-300/50"
                                }`}
                            >
                                {sub}
                            </motion.button>
                        ))}
                    </motion.div>
                </>
            )}
            {/* Recommendations Display */}
            {selectedForm && selectedSubgenre && (
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-3xl p-6 bg-white rounded-2xl shadow-2xl border border-purple-300 hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.5)] transition-all duration-500"
                >
                    {selectedForm === "Show" && <Shows subgenre={selectedSubgenre} />}
                    {selectedForm === "Music" && <Music subgenre={selectedSubgenre} />}
                    {selectedForm === "Jokes" && <Jokes subgenre={selectedSubgenre} />}
                    {selectedForm === "Books" && <Books subgenre={selectedSubgenre} />}
                    {selectedForm === "Trivia" && <Trivia category= {selectedSubgenre}/>}
                </motion.div>
            )}
        </main>
    );
}