import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/add"!</div>
}
