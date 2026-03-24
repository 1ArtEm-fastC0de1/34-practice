import "../styles/fonts.css";
import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import Note from "#/components/Note/Note";
import Modal from "#/components/Modal/Modal";
import MoreInfoNote from "#/components/MoreInfoNote/MoreInfoNote";
import type { OneNote } from "#/types/note";
import {
  getNotes,
  searchNote,
  pinNote,
  addNoteToTrash,
} from "#/lib/api/notesApi";
import type { PinNoteRequest } from "#/lib/api/notesApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { MoonLoader } from "react-spinners";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "#/components/Pagination/Pagination";
import { refresh } from "#/lib/api/authApi";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<OneNote[]>([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [noteModal, setNoteModal] = useState<string>();
  const [isViewedMorePaga, setIsViewedMorePage] = useState(false);
  const [isModalSidebarOpened, setOpenedModalSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const limit = 12;

  useEffect(() => {
    const checkToken = async () => {
      const token = await refresh();
      Cookies.set("accessToken", token.accessToken);
      //  const accessToken = Cookies.get("accessToken");

      // if (!accessToken) {
      //   try {
      //     const responce = await refresh();
      //     Cookies.set("accessToken", responce.accessToken);
      //   } catch {
      //     navigate({ to: "/signup" });
      //   }
      // }
    };
    checkToken();
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notes", page],
    queryFn: () => getNotes({ page, limit }),
    refetchOnMount: true,
    staleTime: 0,
  });

  const totalPages = data?.totalPages;
  const sortedNotes = [...notes].sort(
    (a, b) => Number(b.isPinned) - Number(a.isPinned),
  );

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
      const { note } = await searchNote(text);
      setNotes(note);
    };
    fetchQueryNotes();
  }, [text, data]);

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
    setNotes((prev) => prev.filter((note) => note.id != id));
    try {
      await addNoteToTrash(id);
    } catch (error) {
      refetch();
    }
  };

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value),
    1000,
  );

  const handlePinNote = async ({ id, pin }: PinNoteRequest) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, isPinned: pin } : note)),
    );

    try {
      await pinNote({ id, pin });
      queryClient.invalidateQueries({ queryKey: ["notes", "all"] });
      queryClient.invalidateQueries({ queryKey: ["notes", page] });
    } catch {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, isPinned: !pin } : note,
        ),
      );
    }
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  return (
    <>
      {isLoading && (
        <div className="absolute z-100 flex min-h-full w-full items-center justify-center bg-neutral-800/90">
          <MoonLoader
            loading={isLoading}
            color="#FFA726"
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className="relative flex min-h-screen flex-col">
        <Header
          openModalSidebar={handleOpenModalSidebar}
          onSearch={handleSearch}
        />
        <div className="relative flex flex-1">
          <Sidebar isModalSidebarOpened={isModalSidebarOpened} />
          <main className="flex min-h-0 flex-1 flex-col py-5 max-xl:items-center max-xl:px-2 xl:px-5">
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
            {notes.length != 0 ? (
              <div className="mb-10">
                <ul className="flex flex-row flex-wrap items-center justify-center gap-x-16.75 gap-y-5">
                  {sortedNotes.map((note) => (
                    <Note
                      key={note.id}
                      title={note.title}
                      content={note.content}
                      id={note.id}
                      pin={note.isPinned}
                      handleView={(id: string) => {
                        (setIsViewedMorePage(true), setNoteModal(id));
                      }}
                      handlePinNote={handlePinNote}
                      handleDeleteNote={handleDeleteNote}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <h2 className="w-77 text-center text-3xl font-semibold text-neutral-400">
                  Here will be displayed notes
                </h2>
              </div>
            )}
            {data && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                handleChangePage={handleChangePage}
              />
            )}
          </main>
        </div>
        {isViewedMorePaga && noteModal && (
          <Modal handleClose={closeModal}>
            <MoreInfoNote id={noteModal} handleClose={closeModal} />
          </Modal>
        )}
      </div>
    </>
  );
}
