type Props = {
  noteTitle: string;
  noteDescription: string;
  noteId: string;
};

const DeletedNote = ({ noteTitle, noteDescription, noteId }: Props) => {
  return (
    <li
      key={noteId}
      className="text-[var(--color-primary)]relative flex w-75 flex-col gap-3 rounded-lg bg-white p-2 dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
    >
      <h3 className="w-50 font-bold">{noteTitle}</h3>
      <p className="font-normal">
        {noteDescription.length > 100
          ? noteDescription.slice(0, noteDescription.lastIndexOf(" ", 100)) +
            "..."
          : noteDescription}
      </p>
      <div className="flex flex-row justify-between">
        <button className="rounded-lg bg-orange-400 px-2 py-2 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
          View note
        </button>

        <button className="rounded-lg bg-orange-400 px-2 py-2 text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
          Recover note
        </button>
        <button className="rounded-lg border border-orange-400 px-2 py-2 text-xs font-bold text-orange-400">
          Delete note
        </button>
      </div>
    </li>
  );
};

export default DeletedNote;
