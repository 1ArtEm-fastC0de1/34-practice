import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import notFound from "#/routes/notFound.tsx";

import "../styles/global.css";

export const Route = createRootRoute({
  notFoundComponent: notFound,
  component: RootComponent,
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

function RootComponent() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[var(--color-background-dark)]">
      <Outlet />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  );
}
