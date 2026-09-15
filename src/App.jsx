import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Wishlist } from "./pages/Wishlist";
import { About } from "./pages/About";

export function App() {
  return (
    <div className="bg-amber-100 min-h-screen">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
