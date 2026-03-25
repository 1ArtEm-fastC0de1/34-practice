import Logo from "./Logo/Logo";
import { useUserStore } from "#/lib/store/userStore";
import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useLocation } from "@tanstack/react-router";

type Props = {
  openModalSidebar?: () => void;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Header({ openModalSidebar, onSearch }: Props) {
  const user = useUserStore((state) => state.user);

  const location = useLocation();

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
          {location.pathname != "/createNote" && (
            <svg
              height={20}
              width={30}
              className="cursor-pointer"
              onClick={openModalSidebar}
            >
              <use href="/burger.svg" />
            </svg>
          )}
          <Logo />
          <Link to="/profile" className="flex items-center justify-center">
            <svg width={38} height={38}>
              <use href="/account.svg" />
            </svg>
          </Link>
        </>
      ) : (
        <>
          <div className="flex items-center gap-20">
            <Logo />
            {(location.pathname == "/" || location.pathname == "/trash") && (
              <div className="relative">
                <input
                  className="h-10 min-w-82 rounded-lg bg-white pl-10 text-black outline-none placeholder:text-neutral-500 dark:border-2 dark:border-neutral-400 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-neutral-400"
                  type="text"
                  name="query"
                  placeholder="Search"
                  onChange={onSearch}
                />
                <IoSearchOutline className="absolute top-1/2 left-2.5 left-3 -translate-y-1/2 text-neutral-500" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-8">
            {(location.pathname == "/" || location.pathname == "/trash") && (
              <Link
                to="/createNote"
                className="h-fit cursor-pointer rounded-lg bg-orange-400 px-6 py-2 text-lg font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
              >
                Create Note
              </Link>
            )}
            {location.pathname == "/profile" && (
              <Link
                to="/traveler"
                className="h-fit cursor-pointer rounded-lg bg-orange-400 px-6 py-2 text-lg font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
              >
                No click
              </Link>
            )}
            <Link
              to="/profile"
              className="flex flex-row items-center justify-center gap-2"
            >
              <h2 className="text-xl font-extrabold text-zinc-400">
                Username: {user.username}
              </h2>
              <svg width={38} height={38}>
                <use href="/account.svg" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
