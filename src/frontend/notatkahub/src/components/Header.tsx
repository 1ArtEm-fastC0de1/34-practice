import Logo from "./Logo/Logo";
import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <header className="dark:border-b-border-bars-dark border-b-border-bars flex items-center justify-between border-b bg-[var(--color-background-bar)] px-[15px] py-[10px] dark:bg-[var(--color-background-bar-dark)]">
      {windowWidth < 1280 ? (
        <>
          <svg height={20} width={30}>
            <use href="/burger.svg" />
          </svg>
          <Logo />
          <svg width={45} height={45}>
            <use href="/account.svg" />
          </svg>
        </>
      ) : (
        <>
          <div className="flex items-center gap-20">
            <Logo />
            <div className="relative">
              <input
                className="h-10 min-w-82 rounded-lg bg-white pl-10 outline-none placeholder:text-neutral-500 dark:border-2 dark:border-neutral-400 dark:bg-transparent dark:placeholder:text-neutral-400"
                type="text"
                name="query"
                placeholder="Search"
              />
              <IoSearchOutline className="absolute top-1/2 left-2.5 left-3 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/createNote"
              className="h-fit cursor-pointer rounded-lg bg-orange-400 px-6 py-2 text-lg font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
            >
              Create Note
            </Link>
            <div className="flex flex-row items-center gap-2">
              <h2 className="text-xl font-extrabold text-zinc-400">Username</h2>
              <svg width={38} height={38}>
                <use href="/account.svg" />
              </svg>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
