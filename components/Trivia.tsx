"use client"
import { useEffect, useState } from "react";

interface TriviaQuestion {
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    all_answers: string[];
}

interface TriviaProps {
    category: string;
}

function shuffleArray<T>(array: T[]): T[] {
    return array
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
}

export default function Trivia({ category }: TriviaProps) {
    const [trivia, setTrivia] = useState<TriviaQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    function categoryToId(category: string): number {
        if (category === "General Knowledge") return 9;
        if (category === "Science: Computers") return 18;
        if (category === "History") return 23;
        if (category === "Sports") return 21;
        if (category === "Entertainment: Music") return 12;
        return 9; // default to General Knowledge
    }

    const categoryId = categoryToId(category);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`);
                const data = await res.json();

                // Define the structure of API results
                const triviaData: TriviaQuestion[] = (data.results ?? []).map((q: {
                    type: string;
                    difficulty: string;
                    category: string;
                    question: string;
                    correct_answer: string;
                    incorrect_answers: string[];
                }) => ({
                    ...q,
                    type: q.type as 'multiple' | 'boolean', // Ensure correct type
                    difficulty: q.difficulty as 'easy' | 'medium' | 'hard', // Ensure correct difficulty
                    all_answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
                }));

                setTrivia(triviaData);
                console.log(triviaData);
            } catch (error) {
                console.error("Error fetching questions", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [categoryId]);

    if (loading) {
        return <p className="text-center">Loading questions...</p>;
    }

    return (
        <div className="grid gap-4 mt-4">
            {trivia.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                    No trivia questions found for &quot;{category}&quot;.
                </p>
            ) : (
                trivia.map((q, idx) => (
                    <div key={idx} className="p-4 bg-blue rounded-lg flex flex-col items-center gap-2.5">
                        <h2 className="text-lg font-semibold text-center text-black">{q.question}</h2>
                        <div className="flex flex-col mt-2 w-full items-center">
                            {q.all_answers.map((answer, i) => (
                                <button key={i} className="my-1 p-2 border rounded w-3/4 text-gray-800 font-semibold hover:bg-gray-100 transition">
                                    {answer}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Category: {q.category} | Difficulty: {q.difficulty}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}