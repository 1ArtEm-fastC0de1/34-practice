import removeMd from "remove-markdown";

type Props = {
  title: string;
  content: string;
  id: string;
  handleView: (id: string) => void;
  handleDeleteNote: (id: string) => void;
};

const DeletedNote = ({
  title,
  content,
  id,
  handleView,
  handleDeleteNote,
}: Props) => {
  return (
    <li
      key={id}
      className="relative flex h-60 w-75 flex-col gap-3 rounded-lg bg-white p-2 text-[var(--color-primary)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
    >
      <div className="flex flex-1 flex-col gap-5">
        <h3 className="w-50 font-bold">{title}</h3>
        <p className="line-clamp-4 font-normal">{removeMd(content)}</p>
      </div>
      <div className="flex flex-row justify-between">
        <button
          onClick={() => handleView(id)}
          className="cursor-pointer rounded-lg bg-orange-400 px-2 py-2 text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
        >
          View note
        </button>

        <button className="rounded-lg bg-orange-400 px-2 py-2 text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">
          Recover note
        </button>
        <button
          onClick={() => handleDeleteNote(id)}
          className="cursor-pointer rounded-lg border border-orange-400 px-2 py-2 text-sm font-bold text-orange-400"
        >
          Delete note
        </button>
      </div>
    </li>
  );
};

export default DeletedNote;
