import { UserContext } from "../App";
import { A } from "@solidjs/router";
import { ParentComponent, Resource, Show, useContext } from "solid-js";

export const Navbar: ParentComponent<{}> = (props) => {
  const user: Resource<any> = useContext(UserContext)

  /* ${isMobileMenuOpen ? styles.open : ''}*/
  return (
    <>
      <nav class={`w-full h-24 md:h-16 flex md:flex-row flex-col justify-between fixed p-4 top-0 left-0 bg-gradient-to-r from-[#000000] to-[#222222] text-[#ffffff]`}>
        <div>
          <A class='text-[#ffffff] text-2xl hover:text-[#c8c8c3]' href="/" >
            Slapdash
          </A>
        </div>

        <div class={`flex align-middle justify-center`}>
          <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] text-center flex pl-4" href="/">
            Dashboard
          </A>

          <Show when={user() == undefined}>
            <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href="http://localhost:3000/auth/google">
              Login
            </A>

            <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href="/register">
              Sign Up
            </A>
          </Show>

          <Show when={user() != undefined} >
            <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href='http://localhost:3000/auth/logout/google'>
              Logout
            </A>
          </Show>

          <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href="/team">
            Team
          </A>
        </div>
      </nav>
      {props.children}
    </>
  );

}
