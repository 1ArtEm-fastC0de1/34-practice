import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import { useUserStore } from "#/lib/store/userStore";
import { updateUser, logout, refresh } from "#/lib/api/authApi";
import { getNotes } from "#/lib/api/notesApi";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const clearUserStore = useUserStore((state) => state.clearUserStore);
  const setUserStore = useUserStore((state) => state.setUserStore);

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

  const handleSubmit = async (formData: FormData) => {
    const username = (formData.get("username") as string) || "";
    const email = (formData.get("email") as string) || "";
    try {
      await updateUser(email, username);
      if (username) setUserStore({ ...user, username });
      if (email) setUserStore({ ...user, email });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    clearUserStore();
    Cookies.remove("accessToken");
    navigate({ to: "/login" });
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Header openModalSidebar={handleOpenModalSidebar} />
      <div className="relative">
        {windowWidth < 1280 && (
          <Sidebar isModalSidebarOpened={isModalSidebarOpened} />
        )}
        <div className="flex flex-row justify-center gap-16 pt-5 text-[var(--color-primary)] max-xl:top-150 max-xl:left-1/2 max-xl:flex-col max-xl:items-center max-xl:gap-5 dark:text-[var(--color-primary-dark)]">
          <div className="flex flex-col justify-center max-xl:items-center max-xl:text-center xl:w-90">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <img
              className="mt-10 mb-5"
              src="/account.svg"
              width={150}
              height={150}
              alt="Account img"
            />
            <div className="mb-6.75 flex flex-col gap-3 font-bold text-neutral-500 dark:text-neutral-300">
              <h3>User Info</h3>
              <h4>Username: {user.username}</h4>
              <h4>Email: {user.email}</h4>
            </div>
            {windowWidth >= 1280 && (
              <div className="flex w-full flex-col gap-2">
                <button
                  onClick={handleLogout}
                  className="w-[60%] cursor-pointer rounded-lg bg-orange-400 px-2 py-2 text-center font-medium text-white max-xl:w-full"
                >
                  Logout
                </button>{" "}
                <Link
                  to="/add"
                  className="w-[60%] cursor-pointer rounded-lg border border-orange-400 px-2 py-2 text-center font-bold text-orange-400 max-xl:w-full"
                >
                  About NOTATKAHUB
                </Link>
              </div>
            )}
          </div>
          <div className="flex w-105 flex-col px-3.75 max-xl:w-full max-xl:items-center max-xl:text-center">
            <h2 className="mb-10 text-2xl font-bold max-xl:mb-5">
              Edit Profile
            </h2>
            <form
              action={handleSubmit}
              className="flex w-full max-w-100 min-w-77.5 flex-col gap-8.75 px-2 max-xl:gap-3"
            >
              <label
                htmlFor="username"
                className="flex flex-col gap-2 font-medium text-neutral-500 max-xl:items-center dark:text-neutral-300"
              >
                Username
                <input
                  placeholder="Username"
                  className="w-full rounded-lg bg-white px-4 py-3.75 font-light text-neutral-500 outline-none"
                  id="username"
                  type="text"
                  name="username"
                  minLength={5}
                  maxLength={10}
                />
              </label>

              <label
                htmlFor="username"
                className="flex flex-col gap-2 font-medium text-neutral-500 max-xl:items-center dark:text-neutral-300"
              >
                Email
                <input
                  maxLength={100}
                  placeholder="Email"
                  id="email"
                  type="email"
                  name="email"
                  className="w-full rounded-lg bg-white px-4 py-3.75 font-light text-neutral-500 outline-none"
                />
              </label>
              <button className="max-w-80 min-w-1/3 cursor-pointer self-end rounded-lg bg-orange-400 px-2 py-2 font-medium text-white max-xl:w-full max-xl:self-center">
                Save Changes
              </button>
            </form>
          </div>
          {windowWidth < 1280 && (
            <div className="flex w-full flex-row justify-between px-3.75">
              <button
                onClick={handleLogout}
                className="w-1/3 max-w-50 cursor-pointer rounded-lg bg-orange-400 px-2 py-2 font-medium text-white"
              >
                Logout
              </button>
              <Link
                to="/add"
                className="cursor-pointer rounded-lg border border-orange-400 px-2 py-2 font-bold text-orange-400"
              >
                About NOTATKAHUB
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
