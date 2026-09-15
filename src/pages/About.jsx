

export function About() {


    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 flex-col items-center justify-center">
                <h1 className="text-amber-800 text-6xl font-bold ">About BookShlist</h1>
                <div className="max-w-2xl text-center mt-6 space-y-4">
                    <p>Search for any book using our extensive book database and add it to your personal wishlist.</p>
                    <p>Create multiple wishlists to organize your books by genre, mood, or any category you like.</p>
                    <p>Customize the look of your wishlists and keep track of what you want to read next.</p>
                </div>
            </div>
            <footer className="mt-auto text-center text-gray-500 py-4 bg-orange-200">
                <p>Instagram</p>
                <p>© 2026 BookShlist</p>
            </footer>
        </div>  
    )
}