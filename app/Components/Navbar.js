"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession, signIn } from 'next-auth/react'

const Navbar = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const username = session?.user?.name;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setIsSearchOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        const query = searchQuery.trim();

        if (!query) {
            setSearchResults([]);
            setIsSearchOpen(false);
            return;
        }

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Unable to search creators');
            }

            setSearchResults(Array.isArray(data?.creators) ? data.creators : []);
            setIsSearchOpen(true);
        } catch (error) {
            console.error('Creator search error:', error);
            setSearchResults([]);
            setIsSearchOpen(false);
        }
    };

    const navigateToCreator = (creatorUsername) => {
        setSearchQuery("");
        setSearchResults([]);
        setIsSearchOpen(false);
        router.push(`/${creatorUsername}`);
    };

    return (
        <nav className="bg-gray-800 p-3 text-white sm:p-4">
            <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <Link href="/" className="flex items-center gap-1 text-3xl md:text-2xl font-bold sm:text-2xl">
                    <img src="/tea.gif" width={44} alt="" />
                    <span>Get me A Chai</span>
                </Link>
                <div className="relative flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3" ref={dropdownRef}>
                    <div className="relative flex w-full flex-wrap items-center justify-end gap-2  sm:gap-3">
                        <form onSubmit={handleSearch} className="relative order-2 md:order-0 w-full md:w-auto">
                            <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-4 py-1.5 shadow-sm focus-within:border-cyan-400">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchQuery(value);
                                        if (!value.trim()) {
                                            setSearchResults([]);
                                            setIsSearchOpen(false);
                                        }
                                    }}
                                    placeholder="Search creator"
                                    className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none sm:w-57"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-cyan-500 cursor-pointer px-1.5 *: py-0.5 text-sm font-semibold  text-slate-950 transition hover:bg-cyan-400"
                                >
                                    🔍
                                </button>
                            </div>

                            {isSearchOpen && (
                                <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-600 bg-slate-900 shadow-xl">
                                    {searchResults.length > 0 ? (
                                        <ul className="max-h-72 divide-y divide-slate-700 overflow-y-auto">
                                            {searchResults.map((creator) => (
                                                <li key={creator.username}>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigateToCreator(creator.username)}
                                                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-800"
                                                    >
                                                        <img
                                                            src={creator.profilepic || "/avatar.gif"}
                                                            alt={creator.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{creator.name}</p>
                                                            <p className="text-xs text-slate-400">@{creator.username}</p>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-slate-400">
                                            No creators found for &quot;{searchQuery.trim()}&quot;.
                                        </div>

                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                    <div className=' h-full'>
                        {session ? (
                            <>
                                <button
                                    id="dropdownHoverButton"
                                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    className="order-1 w-full inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium leading-5 text-white shadow-xs hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 sm:px-4 sm:py-2.5"
                                    type="button"
                                    aria-expanded={isDropdownOpen}
                                    aria-controls="dropdownMenu"
                                >
                                    <span className='hidden md:block'>Welcome, </span>{username || "User"}
                                    <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" /></svg>
                                </button>


                                <div
                                    id="dropdownMenu"
                                    className={`${isDropdownOpen ? 'block' : 'hidden'} absolute right-0 top-full z-10 mt-2 w-44 rounded-lg border border-slate-600 bg-slate-800 shadow-lg`}
                                >
                                    <ul className="p-2 text-sm text-white font-medium" aria-labelledby="dropdownHoverButton">
                                        <li>
                                            <Link href="/" className="inline-flex items-center w-full justify-center p-2 hover:bg-slate-700 rounded" onClick={() => setIsDropdownOpen((prev) => !prev)}>Home Page</Link>
                                        </li>
                                        <li>
                                            <Link href="/dashboard" className="inline-flex items-center justify-center w-full p-2 hover:bg-slate-700 rounded" onClick={() => setIsDropdownOpen((prev) => !prev)}>Dashboard</Link>
                                        </li>
                                        <li>
                                            <Link href={username ? `/${username}` : "/dashboard"} className="inline-flex items-center w-full justify-center p-2 hover:bg-slate-700 rounded" onClick={() => setIsDropdownOpen((prev) => !prev)}>Your Page</Link>
                                        </li>
                                        <li className="border-t border-slate-600">
                                            <button onClick={() => signOut({ callbackUrl: '/' })} className="inline-flex  items-center w-full justify-center p-2 hover:bg-slate-700 rounded">Sign out</button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="order-1 mx-1 rounded-lg bg-linear-to-br from-purple-600 to-blue-500 px-4 py-2.5 text-center text-sm font-medium leading-5 text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-linear-to-bl dark:focus:ring-blue-800"
                                onClick={() => signIn()}
                            >
                                LOGIN
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
