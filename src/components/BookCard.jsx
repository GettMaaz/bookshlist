

export function BookCard({ book, onDelete}) {
    return (
    <div className="p-4 border-2 border-black rounded-2xl shadow-md relative flex w-72 flex-none gap-4">
        <img className="w-24 h-34 object-cover" src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}></img>
        <div className="flex flex-col"> 
            <h3 className="font-bold ">{book.title}</h3> <p className="text-sm text-gray-500">{book.author_name?book.author_name[0]:"Unknown author"}</p> <button className="font-bold absolute top-1 right-2" onClick={() => onDelete(book)}>×</button>
        </div> 
    </div>
    )
}