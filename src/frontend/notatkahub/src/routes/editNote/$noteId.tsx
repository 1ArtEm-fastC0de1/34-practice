import Header from "#/components/Header";
import { getNoteById, updateNote } from "#/lib/api/notesApi";
import {
  createFileRoute,
  Link,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { refresh } from "#/lib/api/authApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Markdown from "react-markdown";
import Cookies from "js-cookie";
import { MoonLoader } from "react-spinners";

export const Route = createFileRoute("/editNote/$noteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { noteId } = useParams({ from: "/editNote/$noteId" });
  const { data, isLoading } = useQuery({
    queryFn: () => getNoteById(noteId),
    queryKey: ["noteEdit", noteId],
    staleTime: 0,
  });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [createMode, setCreateMode] = useState<"edit" | "view">("edit");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        try {
          const responce = await refresh();
          Cookies.set("accessToken", responce.accessToken);
        } catch {
          navigate({ to: "/signup" });
        }
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (data?.note) {
      setNoteTitle(data.note.title);
      setNoteContent(data.note.content);
    }
  }, [data]);

  const toggleChangeMode = () => {
    createMode == "edit" ? setCreateMode("view") : setCreateMode("edit");
  };

  const handleImportMD = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");

      const titleLine = lines.find((line) => line.startsWith("# "));
      const title = titleLine ? titleLine.replace("# ", "").trim() : "";

      const content = lines
        .filter((line) => line !== titleLine)
        .join("\n")
        .trim();

      setNoteTitle(title);
      setNoteContent(content);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      await updateNote({ id: noteId, title, content });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate({ to: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <div className="absolute z-100 flex min-h-full w-full items-center justify-center bg-neutral-800/90">
      <MoonLoader
        loading={isLoading}
        color="#FFA726"
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  ) : (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="w-full">
        <div className="mx-auto my-0 flex max-w-250 min-w-80 flex-col items-center justify-center gap-2.5 px-5 py-7">
          {windowWidth < 1280 ? (
            <>
              <div className="flex w-full justify-between">
                <button
                  className="w-33 cursor-pointer rounded-lg border border-neutral-200 bg-white py-1.5 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
                  onClick={toggleChangeMode}
                >
                  <span
                    className={
                      createMode == "edit" ? "font-extrabold" : "font-normal"
                    }
                  >
                    Edit
                  </span>{" "}
                  /{" "}
                  <span
                    className={
                      createMode == "view" ? "font-extrabold" : "font-normal"
                    }
                  >
                    View
                  </span>{" "}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-33 cursor-pointer items-center justify-center gap-3 rounded-lg bg-white py-1.5 dark:border dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
                >
                  <FiUploadCloud width={16} height={16} />
                  <span>Import MD</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".md"
                  className="hidden"
                  onChange={handleImportMD}
                />
              </div>
              {createMode == "edit" ? (
                <form
                  id="update-note-mobile"
                  action={handleSubmit}
                  className="flex w-full flex-col gap-2.5"
                >
                  <input
                    className="h-10 w-full rounded-lg bg-white px-4 py-2.5 font-normal outline-none placeholder:text-neutral-500 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)] dark:placeholder:text-zinc-200"
                    name="title"
                    type="text"
                    placeholder="Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="h-100 w-full resize-none rounded-lg bg-white px-4 py-2.5 font-normal outline-none placeholder:text-neutral-500 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)] dark:placeholder:text-zinc-200"
                      name="content"
                      placeholder="Description"
                      id="content"
                      value={noteContent}
                      onChange={(e) => {
                        setNoteContent(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </form>
              ) : (
                <div className="max-xl:prose dark:prose-invert h-200 min-w-full resize-none overflow-scroll rounded-lg bg-white px-4 py-2.5 font-normal break-all outline-none placeholder:text-neutral-500 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]">
                  <Markdown>{`# ${noteTitle}\n\n${noteContent}`}</Markdown>
                </div>
              )}
              <div className="flex w-full justify-between">
                <Link
                  to="/"
                  className="flex h-10 w-25 cursor-pointer items-center justify-center rounded-lg bg-orange-400 font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  form="update-note-mobile"
                  className="flex h-10 w-25 cursor-pointer items-center justify-center rounded-lg bg-orange-400 font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                >
                  Update note
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full justify-between">
                <button
                  className="w-33 cursor-pointer rounded-lg border border-neutral-200 bg-white py-1.5 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
                  onClick={toggleChangeMode}
                >
                  <span
                    className={
                      createMode == "edit" ? "font-extrabold" : "font-normal"
                    }
                  >
                    Edit
                  </span>{" "}
                  /{" "}
                  <span
                    className={
                      createMode == "view" ? "font-extrabold" : "font-normal"
                    }
                  >
                    View
                  </span>{" "}
                </button>
                <div className="flex gap-4.5">
                  <Link
                    to="/"
                    className="flex h-10 w-40 cursor-pointer items-center justify-center rounded-lg bg-orange-400 font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                  >
                    Cancel creating
                  </Link>
                  <button
                    type="submit"
                    form="update-note-desktop"
                    className="flex h-10 w-40 cursor-pointer items-center justify-center rounded-lg bg-orange-400 font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                  >
                    Update note
                  </button>
                </div>
              </div>
              {createMode == "edit" ? (
                <form
                  id="update-note-desktop"
                  action={handleSubmit}
                  className="flex w-full flex-col gap-2.5"
                >
                  <input
                    className="h-10 w-full rounded-lg bg-white px-4 py-2.5 font-normal outline-none placeholder:text-neutral-500 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)] dark:placeholder:text-zinc-200"
                    name="title"
                    type="text"
                    placeholder="Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="h-100 w-full resize-none rounded-lg bg-white px-4 py-2.5 font-normal outline-none placeholder:text-neutral-500 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)] dark:placeholder:text-zinc-200"
                      name="content"
                      placeholder="Description"
                      id="content"
                      value={noteContent}
                      onChange={(e) => {
                        setNoteContent(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </form>
              ) : (
                <div className="prose dark:prose-invert xl:prose-xl h-100 min-w-full resize-none overflow-scroll rounded-lg bg-white px-4 py-2.5 font-normal break-all outline-none placeholder:text-neutral-500 dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]">
                  <Markdown>{`# ${noteTitle}\n\n${noteContent}`}</Markdown>
                </div>
              )}
              <div className="flex w-full flex-row items-center justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-33 cursor-pointer items-center justify-center gap-3 rounded-lg bg-white py-1.5 dark:border dark:border-[var(--color-border-bars-dark)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]"
                >
                  <FiUploadCloud width={16} height={16} />
                  <span>Import MD</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".md"
                  className="hidden"
                  onChange={handleImportMD}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
