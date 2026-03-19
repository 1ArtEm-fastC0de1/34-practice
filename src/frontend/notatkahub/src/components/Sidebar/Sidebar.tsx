import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import { Link } from "@tanstack/react-router";
import { CiStickyNote } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="flex min-h-full w-50 flex-col gap-4 bg-[var(--color-background-bar)] px-2.75 py-2.5 dark:bg-[var(--color-background-bar-dark)]">
      <div className="px-2.5">
        <ThemeSwitcher />
      </div>
      <nav className="flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-2.5 py-2 text-lg font-semibold text-neutral-400 [&.active]:rounded-md [&.active]:bg-neutral-300 [&.active]:text-black"
        >
          <CiStickyNote className="h-6 w-6" /> All notes
        </Link>
        <Link
          to="/trash"
          className="flex items-center gap-3 px-2.5 py-2 text-lg font-semibold text-neutral-400 [&.active]:rounded-md [&.active]:bg-neutral-300 [&.active]:text-black"
        >
          <FaTrashAlt className="h-5 w-5" />
          Trash
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
