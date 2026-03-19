import { Link } from "@tanstack/react-router";

const Logo = () => {
  return (
    <Link
      to="/"
      className="direction-row flex gap-[4px] font-[Open_Sans] text-xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
    >
      NOTATKA
      <span className="h-fit rounded-lg bg-orange-400 px-[7px] text-[var(--color-primary)]">
        HUB
      </span>
    </Link>
  );
};

export default Logo;
