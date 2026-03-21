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
      <div className={css.modal}>{children}</div>
    </div>,
    document.body,
  );
}
