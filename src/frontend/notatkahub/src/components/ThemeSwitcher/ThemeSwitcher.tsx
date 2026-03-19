import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => {
    const myTheme = localStorage.getItem("theme");
    return myTheme === "dark" ? "dark" : "light";
  });
  useEffect(() => {
    if (theme == "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <button
      className="flex items-center gap-1 font-semibold text-orange-400"
      onClick={handleTheme}
    >
      {theme === "light" ? (
        <>
          <GoSun /> Light theme
        </>
      ) : (
        <>
          <FaRegMoon /> Dark Theme
        </>
      )}
    </button>
  );
};

export default ThemeSwitcher;
