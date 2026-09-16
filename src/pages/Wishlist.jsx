import { useState } from "react"
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa"
import { WishlistCard } from "../components/WishlistCard"

export function Wishlist() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [bookSelect, setBookSelect] = useState(null);
    const [listButton, setListButton] = useState(false);
    const [lists, setLists] = useState(JSON.parse(localStorage.getItem("lists"))||[]);
    const [listCreate, setListCreate] = useState(false);
    const [listName, setListName] = useState("");
    const [shlistChoose, setShlistChoose] = useState(null)
    const [shlistDelete, setShlistDelete] = useState(null)
    const [dialog, setDialog] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        console.log(lists)
        console.log(shlistChoose)
    }, [lists, shlistChoose])

    useEffect(() => {localStorage.setItem("lists", JSON.stringify(lists))}, [lists])

    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchBooks = async () => {
                try { 
            const response = await fetch(`https://openlibrary.org/search.json?q=${search}&limit=5`)

            const data = await response.json();
            setData(data.docs)
            console.log(data.docs)
                } catch (err) { setError("The books cloud not be loaded, please check your connection."); console.log(err) }
            }

            if(search.length > 3)
                { fetchBooks() } 
            else 
                { setData([]) }
        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [search])

    function handleClick(book) {
        setListButton(prev => !prev)
        setBookSelect(book)
    }

    function handleShowCreateList() {
        setListCreate(true)
        setListButton(false)
    }

    function handleCreateList(e) {
        e.preventDefault();
        let newObj = {id: Date.now(), text: listName, books: [bookSelect]};
        setLists([...lists, newObj])
        setListButton(false)
        setListCreate(false)
        setSearch("")
        setData([])
    }

    function handleListName(e) {
        setListName(e.target.value)
    }

    function handleAddToList(e) {
        e.preventDefault()
        setLists(lists.map((item) => item.id === shlistChoose.id?{...item, books: item.books.some((b) => b.key === bookSelect.key) ? item.books : [...item.books, bookSelect]}:item ))
        setListButton(false)
        setSearch("")
        setData([])
    }
    
    function handleShlistChoose(wishlist) {
        setShlistChoose(wishlist)
    }

    function handleRemoveDialog(list) {
        setShlistDelete(list)
        setDialog(true)
    }

    function handleDeleteList(id){
        setLists(lists.filter((list) => list.id !== id));
        setDialog(false);
        setShlistDelete(null);
        setShlistChoose(null);
    }

    function handleDeleteBook(book, id){
        setLists(lists.map((item) => item.id === id?{...item, books: item.books.filter((b) => book.key !== b.key)}:item))
    }

    function handleChange(e) {
        setSearch(e.target.value)
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[350px_1fr]">
            <div className="pt-5 px-2">
                <div className="relative w-full">
                    <input className="focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl pl-2 pr-8 w-full" type="text" value={search} onChange={handleChange} /> <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"/>
                </div>
                <ul className="divide-y divide-gray-300 bg-white rounded-xl shadow-md my-2">
                    {data.map((item) => (
                        <li className="flex gap-2 p-2" onClick={() => handleClick(item)} key={item.key}>
                            <img className="w-12 h-16 object-cover" src={`https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`}></img>
                            <div className="flex flex-col">
                                <p className="text-amber-800">{item.title}</p> 
                                <p>{item.author_name?item.author_name[0]:"Unknown author"}</p>
                            </div>
                        </li>))}
                </ul>
                {listButton ? 
                    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                            <p className="font-bold text-amber-800 text-center">{bookSelect.title}</p> 
                            <div className="flex">
                                <button className="mr-3" onClick={(e) => handleShowCreateList(e)} >Create list</button> 
                                <button className="border-l border-gray-400 pl-3 " onClick={(e) => handleAddToList(e)}>Add to list</button>
                            </div> 
                                <button className="absolute top-0 right-2" onClick={() => {setListButton(false)}} >×</button>
                        </div>
                    </div> 
                : null}
                {listCreate ? 
                    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                            <input className="focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl px-2" type="text" value={listName} onChange={handleListName} />
                            <div className="flex justify-center mt-2">
                                <button className="mr-3" onClick={(e) => handleCreateList(e)} >Create</button> 
                                <button className="border-l border-gray-400 pl-3" onClick={() => {setListButton(false); setListCreate(false)}}>Cancel</button>
                            </div>
                        </div>
                    </div>
                : null}
                {dialog ? 
                    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                            <p className="font-bold text-amber-800 text-center">Do you want to delete this wish list?</p>
                            <div className="flex justify-center mt-2">
                                <button className="mr-3" onClick={() => handleDeleteList(shlistDelete.id)}>Yes</button> 
                                <button className="border-l border-gray-400 pl-3" onClick={() => {setDialog(false); setShlistDelete(null)}}>No</button>
                            </div>
                        </div>
                    </div> 
                : null}
                <section>
                    {lists.map((item) => (<div className="flex justify-between items-center bg-orange-300 rounded-xl shadow-sm px-2 mb-2 cursor-pointer" onClick={() => handleShlistChoose(item)} key={item.id}><div>{item.text} ({item.books.length})</div> <button className="font-bold" onClick={(e) => {e.stopPropagation(); handleRemoveDialog(item)}}>×</button></div>))}
                </section>
                {error === ""?null:<p>{error}</p>}
            </div>
            <div>
                {shlistChoose ? <WishlistCard books={lists.find((e) => e.id === shlistChoose.id).books} onDeleteBook={(book) => handleDeleteBook(book, shlistChoose.id)} /> : null}
            </div>
        </div>
    )
}

