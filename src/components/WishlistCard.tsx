import { BookCard } from "./BookCard"
import { Book } from "../types"

interface WishlistCardProps {
    books: Book[]
    onDeleteBook: (book: Book) => void;
}

export function WishlistCard({ books, onDeleteBook }: WishlistCardProps) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-5">
        {books.map((book) => (
            <BookCard key={book.key} book={book} onDelete={() => onDeleteBook(book)} />
        ))}
        </div>
    )
}