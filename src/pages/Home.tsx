

export function Home() {


    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 flex-col items-center justify-center">
                <h1 className="text-amber-800 text-6xl font-bold">BookShlist</h1>
                <section>
                    <h2 className="text-xl text-gray-600 mt-2">Create and custom your favorite Wishlist</h2>
                </section>
                <section className="flex gap-6 mt-6">
                    <p className="text-lg bg-orange-300 rounded-xl shadow-md p-4">Search books</p>
                    <p className="text-lg bg-orange-300 rounded-xl shadow-md p-4">Create wishlists</p>
                    <p className="text-lg bg-orange-300 rounded-xl shadow-md p-4">Customize your list</p>
                </section>
            </div>
            <footer className="mt-auto text-center text-gray-500 py-4 bg-orange-200">
                <p>Instagram</p>
                <p>© 2026 BookShlist</p>
            </footer>
        </div>
    )
}



