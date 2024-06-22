import { A } from "@solidjs/router";
import { Show } from "solid-js";

export function Navbar(props: { user: any }) {

  // TOOD: Need to complete function
  function handleLogout() {

  }

  /* ${isMobileMenuOpen ? styles.open : ''*/
  return (
    <nav class={`w-full h-24 md:h-16 flex md:flex-row flex-col justify-between fixed p-4 top-0 left-0 z-50 bg-gradient-to-r from-[#000000] to-[#222222] text-[#ffffff]`}>

      <div>
        <A class='text-[#ffffff] text-2xl hover:text-[#c8c8c3]' href="/" >
          Slapdash
        </A>
      </div>

      <div class={`flex align-middle justify-center`}>
        <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] text-center flex pl-4" href="/">
          Dashboard
        </A>

        <Show when={props.user == null}>
          <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href="/login">
            Login
          </A>

          <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href="/register">
            Sign Up
          </A>
        </Show>

        <Show when={props.user} >
          <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href='/' onClick={handleLogout}>
            Logout
          </A>
        </Show>

        <A class="text-[#ffffff] text-xl hover:text-[#c8c8c3] pl-4" href="/team">
          Team
        </A>

      </div>
    </nav>
  );

}
