import { Resource, Show, useContext } from "solid-js";
import { Dashboard } from "./Dashboard";
import { Landing } from "./Landing";
import { UserContext } from "../App";

export function Homepage() {
  const user: Resource<any> = useContext(UserContext)

  return (
    <Show when={user() != undefined} fallback={< Landing />}>
      <Dashboard />
      {user().Email}
    </Show >
  )
}
