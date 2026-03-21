import Logo from "#/components/Logo/Logo";
import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/notFound")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const router = useRouter();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="align-center flex w-full flex-col items-center pt-50">
      <div className="text-center">
        <h2 className="text-8xl font-extrabold text-orange-400 max-xl:text-6xl">
          404
        </h2>
        <h3 className="text-6xl text-orange-400 max-xl:text-4xl">
          //Oops...this page ran away.
        </h3>
      </div>
      {windowWidth > 1280 ? (
        <div className="py-10">
          <hr className="w-130 text-orange-300" />
          <div className="flex flex-row gap-20">
            <pre className="w-fit pt-2 text-4xl leading-15">
              <code>
                <div>
                  <span className="text-orange-400">if</span>(
                  <span className="text-cyan-600 dark:text-cyan-400">
                    page{" "}
                  </span>
                  <span className="text-orange-400">==</span>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {" "}
                    found
                  </span>
                  ) {"{"}
                </div>
                <div className="pl-4">
                  <span className="text-blue-500">return</span>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {" "}
                    success
                  </span>
                  ;
                </div>
                <div>
                  {"}"} <span className="text-orange-400">else</span> {"{"}
                </div>
                <div className="pl-4">
                  <span className="text-blue-500">return</span>
                  <span className="text-red-500"> 404</span>;
                </div>
                <div>{"}"}</div>
              </code>
            </pre>
            <img src="/note_run.png" height={300} width={300} alt="Note run" />
          </div>
          <div className="flex items-center gap-5">
            <hr className="w-130 text-orange-300" />
            <Logo />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-5">
          <hr className="w-[80%] text-orange-300" />
          <h3 className="px-15 py-3 text-center text-xl font-medium text-neutral-400">
            We couldn't find the page you were looking for. Go back or home page
          </h3>
          <hr className="w-[80%] text-orange-300" />
        </div>
      )}

      <div className="flex flex-row justify-end gap-5">
        <button
          className="w-37.5 rounded-lg border border-orange-400 p-1.25 py-2 text-center text-xl font-bold text-orange-400"
          onClick={() => router.history.back()}
        >
          Go back
        </button>
        <Link
          className="w-37.5 rounded-lg bg-orange-400 p-1.25 py-2 text-center text-xl font-bold text-white"
          to="/"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
