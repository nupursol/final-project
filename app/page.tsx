"use client";
import Shows from "@/components/Shows";
import Music from "@/components/Music";
import { useState } from "react";
import Jokes from "@/components/Jokes";
import Books from "@/components/Books";
import Trivia from "@/components/Trivia";

const entertainmentOptions = {
  Jokes: ["Dad Joke", "Knock Knock", "General", "Programming"],
  Show:  ["Drama", "Romance", "Action", "Comedy", "Crime", "Science-Fiction"],
  Books: ["Science Fiction", "Young Adult", "Poetry", "Action"],
  Music: ["Pop", "Hip-Hop/Rap", "Rock", "R&B/Soul", "Alternative", "Jazz"],
  Trivia: ["General Knowledge", "Science: Computers", "History", "Sports", "Entertainment: Music"]
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
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
          What form of entertainment would you like?
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.keys(entertainmentOptions).map((form) => (
              <button
                  key={form}
                  onClick={() => handleFormSelect(form as keyof typeof entertainmentOptions)}
                  className={`px-4 py-2 rounded-xl shadow-md text-white font-semibold transition duration-300 ${
                      selectedForm === form ? "bg-blue-600" : "bg-blue-400 hover:bg-blue-500"
                  }`}
              >
                {form}
              </button>
          ))}
        </div>

        {selectedForm && (
            <>
              <h2 className="text-xl font-semibold mb-4">Pick a subgenre:</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {entertainmentOptions[selectedForm].map((sub) => (
                    <button
                        key={sub}
                        onClick={() => handleSubgenreSelect(sub)}
                        className={`px-4 py-2 rounded-xl shadow-md text-white font-medium transition duration-300 ${
                            selectedSubgenre === sub ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
                        }`}
                    >
                      {sub}
                    </button>
                ))}
              </div>
            </>
        )}

        {selectedForm && selectedSubgenre && (
            <div className="w-full max-w-2xl">
              {/* Placeholder for API results */}
              <div className="p-4 border rounded-xl bg-white shadow">
                <p className="text-gray-700 text-center italic">
                  Recommendations for <span className="font-bold">{selectedForm}</span> - <span className="font-bold">{selectedSubgenre}</span> will appear here.
                </p>
                  {selectedForm === "Show" && (
                      <Shows subgenre={selectedSubgenre} />
                  )}
                  {selectedForm === "Music" && (
                      <Music subgenre={selectedSubgenre} />
                  )}
                  {selectedForm === "Jokes" && (
                    <Jokes subgenre = {selectedSubgenre} />
                  )}
                  {selectedForm === "Books" && (
                      <Books subgenre = {selectedSubgenre} />
                  )}
                  {selectedForm === "Trivia" && (
                    <Trivia category= {selectedSubgenre}/>
                  )}
              </div>
            </div>
        )}
      </main>
  );
}
