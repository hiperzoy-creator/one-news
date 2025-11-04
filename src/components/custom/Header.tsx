import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FileText, Newspaper, User } from "lucide-react";

const Header = () => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: "Berita", path: "/", Icon: Newspaper },
        { name: "Komunitas", path: "/komunitas", Icon: User },
        { name: "Dokumen", path: "/dokumen", Icon: FileText },
    ];

    return (
        <header className="bg-zinc-50 sticky top-0 z-999">
            <div className="max-w-7xl flex justify-between items-center mx-auto md:block px-4 sm:px-6 lg:px-8 place-items-center">

                <Link to="/" className="font-momo text-3xl font-semibold flex items-center md:pt-3">
                    <p>One<span className="text-red-500">News</span> Portal</p>
                </Link>

                <div className="flex justify-around items-center h-14">
                    <nav className="hidden md:flex space-x-8 items-center">
                        {navLinks.map(({ name, path, Icon }) => (
                            <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-2 text-gray-700 hover:text-red-500 transition relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:rounded-full ${
                                isActive(path)
                                ? "text-red-500 after:bg-red-500 font-medium"
                                : "after:bg-transparent"
                            }`}
                            >
                            <Icon className="w-4 h-4" />
                            {name}
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-black hover:text-white focus:outline-none pt-1"
                    >
                        {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        )}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-gray-700">
                    <nav className="flex flex-col space-y-2 p-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={`block py-2 px-3 rounded-md hover:bg-gray-700 hover:text-white ${
                                isActive(link.path) ? "bg-gray-200" : ""
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header