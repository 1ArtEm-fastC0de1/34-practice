import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/createNote")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/createNote"!</div>;
}
