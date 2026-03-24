import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import Modal from "#/components/Modal/Modal";
import DeletedNote from "#/components/DeletedNote/DeletedNote";
import TrashMoreInfoNote from "#/components/TrashMoreInfoNote/TrashMoreInfoNote";
import {
  getNotesFromTrash,
  deleteNoteFromTrash,
  reviveNote,
  searchNoteFromTrash,
  getNotes,
} from "#/lib/api/notesApi";
import { refresh } from "#/lib/api/authApi";
import type { trashNotes } from "#/types/note";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Cookies from "js-cookie";
import { MoonLoader } from "react-spinners";

export const Route = createFileRoute("/trash")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<trashNotes[]>([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [noteModal, setNoteModal] = useState<string>();
  const [isViewedMorePaga, setIsViewedMorePage] = useState(false);
  const [isModalSidebarOpened, setOpenedModalSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const limit = 12;

  const { data, isLoading } = useQuery({
    queryFn: () => getNotesFromTrash({ page, limit }),
    queryKey: ["trash-notes"],
    staleTime: 0,
  });

  useEffect(() => {
    if (data?.notes) {
      setNotes(data.notes);
    }
  }, [data]);

  useEffect(() => {
    if (!text) {
      if (data?.notes) setNotes(data.notes);
      return;
    }

    const fetchQueryNotes = async () => {
      const { note } = await searchNoteFromTrash(text);
      setNotes(note);
    };
    fetchQueryNotes();
  }, [text, data]);

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

  const totalPages = data?.totalPages;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeModal = () => {
    setIsViewedMorePage(false);
  };

  const handleOpenModalSidebar = () => {
    console.log(isModalSidebarOpened);
    setOpenedModalSidebar(!isModalSidebarOpened);
  };

  const handleDeleteNote = async (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    try {
      await deleteNoteFromTrash(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecoverNote = async (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id != id));
    try {
      await reviveNote(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value),
    1000,
  );

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
      <Header
        openModalSidebar={handleOpenModalSidebar}
        onSearch={handleSearch}
      />
      <div className="relative flex flex-1">
        <Sidebar isModalSidebarOpened={isModalSidebarOpened} />
        <main className="flex flex-1 flex-col py-5 max-xl:items-center max-xl:px-2 xl:px-5">
          {windowWidth >= 1280 && (
            <h1 className="mb-3 text-4xl font-medium text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
              All notes
            </h1>
          )}
          {windowWidth < 1280 && (
            <div className="mb-5 flex max-w-100 min-w-75 flex-col items-center justify-center gap-2.5">
              <div className="flex w-full justify-between">
                <h1 className="text-4xl font-medium text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
                  Notes
                </h1>
                <Link
                  to="/createNote"
                  className="h-fit cursor-pointer rounded-lg bg-orange-400 px-6 py-2 text-lg font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                >
                  Create Note
                </Link>
              </div>
              <div className="relative w-full">
                <input
                  className="h-10 w-full rounded-lg bg-white pl-10 text-black outline-none placeholder:text-neutral-500 dark:border-2 dark:border-neutral-400 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-neutral-400"
                  type="text"
                  name="query"
                  placeholder="Search"
                  onChange={handleSearch}
                />
                <IoSearchOutline className="absolute top-1/2 left-2.5 left-3 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>
          )}
          <ul className="flex flex-row flex-wrap items-center justify-center gap-x-16.75 gap-y-5">
            {notes.map((note) => (
              <DeletedNote
                key={note.id}
                title={note.title}
                content={note.content}
                id={note.id}
                handleView={(id: string) => {
                  (setIsViewedMorePage(true), setNoteModal(id));
                }}
                handleDeleteNote={handleDeleteNote}
                handleRecoverNote={handleRecoverNote}
              />
            ))}
          </ul>
        </main>
      </div>
      {isViewedMorePaga && noteModal && (
        <Modal handleClose={closeModal}>
          <TrashMoreInfoNote id={noteModal} handleClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
