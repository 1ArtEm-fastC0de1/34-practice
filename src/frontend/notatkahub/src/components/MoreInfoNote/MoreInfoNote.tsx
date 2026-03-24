import { getNoteById } from "#/lib/api/notesApi";
import { useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { BsPencilFill } from "react-icons/bs";
import Markdown from "react-markdown";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";

type MoreInfoNoteProps = {
  id: string;
  handleClose: () => void;
};

const MoreInfoNote = ({ id, handleClose }: MoreInfoNoteProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { data, isLoading } = useQuery({
    queryFn: () => getNoteById(id),
    queryKey: ["note", id],
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleExportNote = () => {
    const content = `# ${data?.note?.title}\n\n${data?.note?.content}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data?.note?.title || "note"}.md`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex w-full items-center justify-center">
          <MoonLoader
            loading={isLoading}
            color="#FFA726"
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className={`relative flex min-h-full flex-col xl:justify-between`}>
          {windowWidth < 1280 ? (
            <>
              <div className="mb-5 flex justify-between">
                <Link
                  to="/editNote/$noteId"
                  params={{ noteId: id }}
                  className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-sm font-bold text-white"
                >
                  <BsPencilFill className="text-black" />
                  Edit note
                </Link>
                <button
                  onClick={handleExportNote}
                  className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-sm font-bold text-white"
                >
                  <FiUploadCloud className="text-black" />
                  Export note
                </button>
              </div>
              <div className="prose dark:prose-invert mb-10 min-w-full break-all text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
                <Markdown>{`# ${data?.note?.title}\n\n${data?.note?.content}`}</Markdown>
              </div>
              <IoCloseCircleOutline
                onClick={handleClose}
                className="absolute right-4 bottom-4 h-10 w-10 cursor-pointer"
              />
            </>
          ) : (
            <>
              <div className="prose dark:prose-invert mb-10 min-w-full break-all text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
                <Markdown>{`# ${data?.note?.title}\n\n${data?.note?.content}`}</Markdown>
              </div>
              <div className="flex w-full justify-between self-end">
                <div className="flex flex-row items-center gap-10">
                  <Link
                    to="/editNote/$noteId"
                    params={{ noteId: id }}
                    className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-lg text-sm font-bold text-white"
                  >
                    <BsPencilFill className="text-black" />
                    Edit note
                  </Link>
                  <button
                    onClick={handleExportNote}
                    className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-lg text-sm font-bold text-white"
                  >
                    <FiUploadCloud className="text-black" />
                    Export note
                  </button>
                </div>

                <IoCloseCircleOutline
                  onClick={handleClose}
                  className="h-10 w-10 cursor-pointer"
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MoreInfoNote;
