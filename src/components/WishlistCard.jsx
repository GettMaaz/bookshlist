import { BookCard } from "./BookCard"

export function WishlistCard({ books, onDeleteBook }) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-5">
        {books.map((book) => (
            <BookCard key={book.key} book={book} onDelete={() => onDeleteBook(book)} />
        ))}
        </div>
    )
}