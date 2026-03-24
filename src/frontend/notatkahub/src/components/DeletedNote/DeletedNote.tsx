import removeMd from "remove-markdown";

type Props = {
  title: string;
  content: string;
  id: string;
  handleView: (id: string) => void;
  handleDeleteNote: (id: string) => void;
  handleRecoverNote: (id: string) => void;
};

const DeletedNote = ({
  title,
  content,
  id,
  handleView,
  handleDeleteNote,
  handleRecoverNote,
}: Props) => {
  return (
    <li
      key={id}
      className="relative flex h-60 w-75 flex-col gap-3 rounded-lg bg-white p-2 text-[var(--color-primary)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
    >
      <div className="flex flex-1 flex-col gap-5">
        <h3 className="line-clamp-1 w-50 font-bold break-all">{title}</h3>
        <p className="line-clamp-4 font-normal break-all">
          {removeMd(content)}
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <button
          onClick={() => handleView(id)}
          className="cursor-pointer rounded-lg bg-orange-400 px-2 py-2 text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
        >
          View note
        </button>

        <button
          onClick={() => handleRecoverNote(id)}
          className="rounded-lg bg-orange-400 px-2 py-2 text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]"
        >
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
