import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import DeletedNote from "#/components/DeletedNote/DeletedNote";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/trash")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isModalSidebarOpened, setOpenedModalSidebar] = useState(false);
  const handleOpenModalSidebar = () => {
    console.log(isModalSidebarOpened);
    setOpenedModalSidebar(!isModalSidebarOpened);
  };
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header openModalSidebar={handleOpenModalSidebar} />
      <div className="flex flex-1">
        <Sidebar isModalSidebarOpened={isModalSidebarOpened} />
        <main className="flex-1 py-5 max-xl:px-2 xl:px-5">
          <ul className="flex flex-row flex-wrap items-center max-xl:flex-col">
            <DeletedNote
              noteTitle="User feedback"
              noteDescription="User feedback Several testers mentioned confusion in the settings panel. Navigation labels might need clearer"
              noteId="jdf78snbjv"
            />
          </ul>
        </main>
      </div>
    </div>
  );
}
