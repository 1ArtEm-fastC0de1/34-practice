import { useState, useEffect } from "react";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";

type Props = {
  noteTitle: string;
  noteDescription: string;
  noteId: string;
  isPinned: boolean;
};

const Note = ({ isPinned, noteTitle, noteDescription, noteId }: Props) => {
  const [isPinnedNote, setIsPinnedNote] = useState(isPinned);
  const handlePinNote = () => {
    setIsPinnedNote(!isPinnedNote);
    console.log(
      `Note ${noteId} was ${!isPinnedNote ? "pinned!" : "unpinned!"}`,
    );
  };
  useEffect(() => {
    console.log(`Note ${noteId} was ${isPinnedNote ? "pinned!" : "unpinned!"}`);
  }, []);
  return (
    <li
      key={noteId}
      className="relative flex w-75 flex-col gap-3 rounded-lg bg-white p-2 text-[var(--color-primary)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
    >
      {isPinnedNote ? (
        <IoMdStar
          className="absolute top-1.75 right-1.75 h-6 w-6 cursor-pointer fill-orange-400"
          onClick={handlePinNote}
        />
      ) : (
        <IoMdStarOutline
          className="absolute top-1.75 right-1.75 h-6 w-6 cursor-pointer fill-orange-400"
          onClick={handlePinNote}
        />
      )}
      <h3 className="w-50 font-bold">{noteTitle}</h3>
      <p className="font-normal">
        {noteDescription.length > 100
          ? noteDescription.slice(0, noteDescription.lastIndexOf(" ", 100)) +
            "..."
          : noteDescription}
      </p>
      <div className="flex flex-row justify-between">
        <button className="rounded-lg bg-orange-400 px-2 py-2 text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
          View note
        </button>
        <button className="rounded-lg border border-orange-400 px-2 py-2 text-sm font-bold text-orange-400">
          Delete note
        </button>
      </div>
    </li>
  );
};

export default Note;
