import Header from "#/components/Header";
import Sidebar from "#/components/Sidebar/Sidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trash")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header></Header>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1"></main>
      </div>
    </div>
  );
}
