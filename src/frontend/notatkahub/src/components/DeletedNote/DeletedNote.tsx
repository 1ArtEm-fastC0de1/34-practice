import type { NoteModelInfo } from "#/types/note";
import { useState, useEffect } from "react";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";

type Props = {
  title: string;
  content: string;
  noteId: string;
  isPinned: boolean;
  handleView: ({ title, content, noteId }: NoteModelInfo) => void;
};

const DeletedNote = ({ title, content, noteId, handleView }: Props) => {
  return (
    <li
      key={noteId}
      className="relative flex w-75 flex-col gap-3 rounded-lg bg-white p-2 text-[var(--color-primary)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
    >
      <h3 className="w-50 font-bold">{title}</h3>
      <p className="font-normal">
        {content.length > 100
          ? content.slice(0, content.lastIndexOf(" ", 100)) + "..."
          : content}
      </p>
      <div className="flex flex-row justify-between">
        <button
          onClick={() => handleView({ noteId, title, content })}
          className="cursor-pointer rounded-lg bg-orange-400 px-2 py-2 text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
        >
          View note
        </button>
        <button className="rounded-lg bg-orange-400 px-2 py-2 text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
          Recover note
        </button>
        <button className="cursor-pointer rounded-lg border border-orange-400 px-2 py-2 text-sm font-bold text-orange-400">
          Delete note
        </button>
      </div>
    </li>
  );
};

export default DeletedNote;
