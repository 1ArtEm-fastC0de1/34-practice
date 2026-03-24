import { useEffect } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  handleClose: () => void;
}

export default function Modal({ children, handleClose }: ModalProps) {
  const clickBackdropModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target == e.currentTarget) {
      handleClose();
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleClose]);
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={clickBackdropModal}
    >
      <div className="relative h-[80%] w-[90%] overflow-scroll rounded-lg border border-[var(--color-border-bars)] bg-[var(--color-background-bars)] p-6 font-medium text-[var(--color-primary)] shadow-[0_5px_15px_rgba(0,0,0,0.3)] dark:border-[var(--color-border-bars-datk)] dark:bg-[var(--color-background-bar-dark)] dark:text-[var(--color-primary-dark)]">
        {children}
      </div>
    </div>,
    document.body,
  );
}
