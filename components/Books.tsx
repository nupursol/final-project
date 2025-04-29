// This component by Liala Jama
"use client"
import {useEffect, useState} from "react";

// interface for book to get title, author, year, and ids for the cover picture
interface Book {
    key: string;
    cover_edition_key: string;
    cover_id: number;
    title: string;
    authors: [{
        name: string;
    }];
    first_publish_year: number;
}

// interface for the subgenre of the book list
interface BooksProps {
    subgenre: string;
}

export default function Books({subgenre}: BooksProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // sets subject equal to the subgenre so that it can be put in the url
    let subject: string;
    if (subgenre === "Science Fiction") {
        subject = "science_fiction";
    } else if (subgenre === "Young Adult") {
        subject = "young_adult";
    } else if (subgenre === "Poetry") {
        subject = "poetry";
    } else if (subgenre === "Action") {
        subject = "action";
    } else {
        subject = "action";
    }

    // fetches data for the subject whenever subject changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`https://openlibrary.org/subjects/${subject}.json`);
                const data = await res.json();
                /* the specific api calls its books works */
                const bookData: Book[] = data.works;
                setBooks(bookData);
                console.log(bookData);
            } catch (error) {
                console.error("Error fetching books", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }
    , [subject]);

    // shows user that fetching data is in progress
    if (loading) return <p>Loading...</p>;

    return (
        // if there were no books found, tells user exactly that
        <div>
            {books.length === 0 ? (
                <p>
                    No books found for choice.
                </p>
            ) : (
                // lists the book's cover, name, author, and year published
                books.map((book) => (
                    <div key={book.key} className="flex items-center p-4">
                        <div className="w-1/5 mr-1 border-r-2 border-r-pink-400 pr-4">
                            {book.cover_edition_key ? (
                            <img src={`https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`} alt={book.title}/>
                                ) : (
                                    //if the book had no cover_edition_key, it likely has a cover_id
                                <img src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`} alt={book.title}/>
                                )
                            }
                        </div>
                        <div className="pl-3 ml-1">
                            <h2 className="text-2xl font-bold">{book.title}</h2>
                            <p className="text-sm text-black">By {book.authors[0].name}, published {book.first_publish_year}</p>
                        </div>
                    </div>
                ))
            )
            }
        </div>
    );
}