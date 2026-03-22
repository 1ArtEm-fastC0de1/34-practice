import { useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { BsPencilFill } from "react-icons/bs";
import Markdown from "react-markdown";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "@tanstack/react-router";

type Props = {
  noteId: string;
  title: string;
  handleClose: () => void;
  content: string;
};

const MoreInfoNote = ({ noteId, title, handleClose, content }: Props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={`reative ${windowWidth < 1280 ? "px-10 pt-10 pb-5" : "px-5 pt-5 pb-2"}`}
    >
      {windowWidth < 1280 ? (
        <>
          <div className="mb-5 flex justify-between">
            <button className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-lg text-sm font-bold text-white">
              <BsPencilFill className="text-black" />
              Edit note
            </button>
            <button className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-lg text-sm font-bold text-white">
              <FiUploadCloud className="text-black" />
              Export note
            </button>
          </div>
          <div className="prose max-xl:prose-invert text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
            <Markdown>{`${title}\n\n${content}`}</Markdown>
          </div>
          <IoCloseCircleOutline
            onClick={handleClose}
            className="absolute right-4 bottom-4 h-10 w-10 cursor-pointer"
          />
        </>
      ) : (
        <>
          <div className="prose max-xl:prose-invert text-black">
            <Markdown>{`${title}\n\n${content}`}</Markdown>
          </div>
          <div className="flex justify-between self-end">
            <div className="flex flex-row items-center gap-10">
              <Link
                to="/editNote/$noteId"
                params={{ noteId }}
                className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-lg text-sm font-bold text-white"
              >
                <BsPencilFill className="text-black" />
                Edit note
              </Link>
              <button className="flex h-fit cursor-pointer items-center justify-center gap-3 rounded-lg bg-orange-400 px-3 py-1 text-lg text-sm font-bold text-white">
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
  );
};

export default MoreInfoNote;
