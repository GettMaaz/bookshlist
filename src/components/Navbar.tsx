import { NavLink } from "react-router-dom";


export function Navbar() {


    return (
        <nav className="bg-orange-200 flex justify-between py-2 px-10">
            <div>
                <h1 className="text-amber-800 text-lg px-1 font-bold">BookShlist</h1>
            </div>
            <div className="">
                <NavLink to='/' className= {({ isActive }) => isActive ? "text-orange-600 px-1 text-lg font-bold" : "px-1 text-lg"}>Home</NavLink>
                <NavLink to='/wishlist' className= {({ isActive }) => isActive ? "text-orange-600 px-1 text-lg font-bold" : "px-1 text-lg"}>Wishlist</NavLink>
                <NavLink to='/about' className= {({ isActive }) => isActive ? "text-orange-600 px-1 text-lg font-bold" : "px-1 text-lg"}>About</NavLink>
            </div>
        </nav>
    )
}



