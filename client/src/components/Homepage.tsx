import { Show } from "solid-js";
import { Dashboard } from "./Dashboard";
import { Landing } from "./Landing";

export function Homepage(props: { user: any }) {
  console.log("Homepage")
  return (
    <Show when={props.user != null} fallback={<Landing />}>
      <Dashboard />
    </Show>
  )
}
