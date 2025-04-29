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

function decodeHTML(html: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export default function Trivia({ category }: TriviaProps) {
    const [trivia, setTrivia] = useState<TriviaQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] =useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    function categoryToId(category: string): number {
        if (category === "General Knowledge") return 9;
        if (category === "Science: Computers") return 18;
        if (category === "History") return 23;
        if (category === "Sports") return 21;
        if (category === "Entertainment: Music") return 12;
        return 9; // default to General Knowledge
    }

    const categoryId = categoryToId(category);
    
    async function fetchData() {
        try {
            const res = await fetch(`https://opentdb.com/api.php?amount=1&category=${categoryId}`);
            const data = await res.json();

            // Define the structure of API results
            if (data.response_code === 0) {
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
                    category: decodeHTML(q.category),
                    question: decodeHTML(q.question),
                    correct_answer: decodeHTML(q.correct_answer),
                    incorrect_answers: q.incorrect_answers.map(ans => decodeHTML(ans)),
                    all_answers: shuffleArray([decodeHTML(q.correct_answer), ...q.incorrect_answers.map(ans => decodeHTML(ans))]),
                }));

                setTrivia(triviaData);
                setSelectedAnswer(null);
                setShowAnswer(false);  
            } else {
                setTrivia([]);
            }
        } catch (error) {
            console.error("Error fetching questions", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    function handleAnswerClick(selected: string) {
        setSelectedAnswer(selected);
        setShowAnswer(true);
    }

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
                                <button 
                                key={i} 
                                onClick={() => handleAnswerClick(answer)}
                                className="my-1 p-2 border rounded w-3/4 text-gray-800 font-semibold hover:bg-gray-100 transition"
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>

                        {showAnswer && (
                            <div className="mt-2 text-sm font-medium text-center">
                            {selectedAnswer === q.correct_answer ? (
                                <p className="text-green-600">Correct!</p>
                            ) : (
                                <p className="text-red-600">
                                    Incorrect. The correct answer was: <strong>{q.correct_answer}</strong>
                                </p>
                            )}
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-2">
                            Category: {q.category} | Difficulty: {q.difficulty}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}