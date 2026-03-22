import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/traveler")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isModalSidebarOpened, setOpenedModalSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleOpenModalSidebar = () => {
    console.log(isModalSidebarOpened);
    setOpenedModalSidebar(!isModalSidebarOpened);
  };
  return (
    <div className="min-h-screen">
      <Header openModalSidebar={handleOpenModalSidebar} />
      <div className="relative flex min-h-screen flex-col items-center justify-center text-center whitespace-pre-line">
        {isModalSidebarOpened && (
          <Sidebar isModalSidebarOpened={isModalSidebarOpened} />
        )}
        {windowWidth > 900 ? (
          <pre className="text-center font-[Sf_pro_Text] text-2xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            {`Ти відкрив цю сторінку випадково.
Один клік. Нічого особливого.
Але дивно, як саме з таких дрібниць іноді починається щось більше.
Нова думка. Нове рішення. Інший шлях.
Можливо,
цей момент нічого не змінить.
А можливо -
ти просто ще не знаєш,
що вже змінив.`}
          </pre>
        ) : (
          <p className="text-center font-[Sf_pro_Text] text-2xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            {`Ти відкрив цю сторінку випадково.
Один клік. Нічого особливого.
Але дивно, як саме з таких дрібниць іноді починається щось більше.
Нова думка. Нове рішення. Інший шлях.
Можливо,
цей момент нічого не змінить.
А можливо -
ти просто ще не знаєш,
що вже змінив.`}
          </p>
        )}

        <Link
          className="mt-6 min-w-30 cursor-pointer rounded-lg bg-orange-400 px-2 py-2 font-medium text-white"
          to="/"
        >
          Home
        </Link>
        <div className="flex items-center gap-5 self-start">
          <h3 className="font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            *Maksym. S
          </h3>
          <a
            href="https://youtu.be/dQw4w9WgXcQ?si=hVQGxazPHI-wbuRm"
            target="_blank"
          >
            <img src="/traveler.png" width={100} height={50} alt="traveler" />
          </a>
        </div>
      </div>
    </div>
  );
}
