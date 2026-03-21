import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isModalSidebarOpened, setOpenedModalSidebar] = useState(false);

  const handleOpenModalSidebar = () => {
    console.log(isModalSidebarOpened);
    setOpenedModalSidebar(!isModalSidebarOpened);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Header openModalSidebar={handleOpenModalSidebar} />
      {windowWidth < 1280 && (
        <Sidebar isModalSidebarOpened={isModalSidebarOpened} />
      )}
      {windowWidth >= 1280 ? (
        <div className="flex min-h-screen w-full flex-row gap-5">
          <div className="flex min-h-screen w-1/2 flex-col justify-center pl-10 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            <p className="mb-5 text-3xl font-semibold">
              NOTATKA HUB is a student project created during practical training
              in the TPRZ course by students of Group 34 of the Poltava
              Polytechnic Professional College, a separated structural unit of
              the National Technical University “Kharkiv Polytechnic Institute”.
              The project demonstrates the practical application of students' IT
              and web development skills. The college supports student
              initiatives and provides opportunities for professional
              development through real educational projects.
            </p>
            <h4 className="mb-3">
              site designed by Maskym S. & Vitaly M.{" (designers)"} and Alex R.
              {" (Front-end Dev.)"}
            </h4>
            <div className="flex flex-row gap-5 font-bold">
              <a
                className="flex cursor-pointer items-center justify-center rounded-lg bg-orange-400 px-10 py-5 font-medium text-white"
                href="https://sites.google.com/polytechnic.co.cc/main"
                target="_blank"
              >
                To site PPFC
              </a>

              <a
                className="flex cursor-pointer items-center justify-center rounded-lg bg-black px-10 py-5 font-medium text-white"
                href="https://github.com/1ArtEm-fastC0de1/34-practice"
                target="_blank"
              >
                Go GitHub
              </a>
            </div>
          </div>
          <div className="min-h-screen w-1/2">
            <img
              className="w-full object-contain"
              src="/add.png"
              alt="kolleg addvertisement"
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col">
          <div className="mb-5">
            <img
              className="w-full object-contain"
              src="/add.png"
              alt="kolleg addvertisement"
            />
          </div>
          <div className="flex w-full flex-col justify-center px-5 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            <p className="mb-3 text-lg font-semibold">
              NOTATKA HUB is a student project created during practical training
              in the TPRZ course by students of Group 34 of the Poltava
              Polytechnic Professional College, a separated structural unit of
              the National Technical University “Kharkiv Polytechnic Institute”.
              The project demonstrates the practical application of students' IT
              and web development skills. The college supports student
              initiatives and provides opportunities for professional
              development through real educational projects.
            </p>
            <h4 className="mb-2">
              site designed by Maskym S. & Vitaly M.{" (designers)"} and Alex R.
              {" (Front-end Dev.)"}
            </h4>
            <div className="flex flex-row justify-between font-bold">
              <a
                className="flex cursor-pointer items-center justify-center rounded-lg bg-orange-400 px-5 py-4.25 font-medium text-white"
                href="https://sites.google.com/polytechnic.co.cc/main"
                target="_blank"
              >
                To site PPFC
              </a>

              <a
                className="flex cursor-pointer items-center justify-center rounded-lg bg-black px-5 py-4.25 font-medium text-white"
                href="https://github.com/1ArtEm-fastC0de1/34-practice"
                target="_blank"
              >
                Go GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
