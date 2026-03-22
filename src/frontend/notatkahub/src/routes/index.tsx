import "../styles/fonts.css";
import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import Note from "#/components/Note/Note";
import Modal from "#/components/Modal/Modal";
import MoreInfoNote from "#/components/MoreInfoNote/MoreInfoNote";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import type { NoteModelInfo } from "#/types/note";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [noteModal, setNoteModal] = useState<NoteModelInfo>({
    noteId: "",
    title: "",
    content: "",
  });
  const [isViewedMorePaga, setIsViewedMorePage] = useState(false);
  const [isModalSidebarOpened, setOpenedModalSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openViewMorePage = ({ noteId, title, content }: NoteModelInfo) => {
    setIsViewedMorePage(true);
    setNoteModal({ title, content, noteId });
  };

  const closeModal = () => {
    setIsViewedMorePage(false);
  };

  const handleOpenModalSidebar = () => {
    console.log(isModalSidebarOpened);
    setOpenedModalSidebar(!isModalSidebarOpened);
  };
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header openModalSidebar={handleOpenModalSidebar} />
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
                  className="h-10 w-full rounded-lg bg-white pl-10 outline-none placeholder:text-neutral-500 dark:border-2 dark:border-neutral-400 dark:bg-transparent dark:placeholder:text-neutral-400"
                  type="text"
                  name="query"
                  placeholder="Search"
                />
                <IoSearchOutline className="absolute top-1/2 left-2.5 left-3 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>
          )}
          <ul className="flex flex-row flex-wrap items-center justify-center gap-x-16.75 gap-y-5">
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
            <Note
              title="User feedback"
              content="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
              isPinned={false}
              handleView={openViewMorePage}
            />
          </ul>
        </main>
      </div>
      {isViewedMorePaga && (
        <Modal handleClose={closeModal}>
          <MoreInfoNote
            noteId={noteModal.noteId}
            title={noteModal.title}
            handleClose={closeModal}
            content={noteModal.content}
          />
        </Modal>
      )}
    </div>
  );
}
