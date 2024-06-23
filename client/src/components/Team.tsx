import { A } from "@solidjs/router";

export function Team() {
  return <>
    <section class="bg-[#222222] text-gray-300 flex flex-col md:flex-row gap-8 max-w-5xl pt-8 px-4 md:px-0 min-h-full align-middle justify-center">
      <A class="flex" href={"https://www.linkedin.com/in/saloni1601/"}>
        <div class="flex flex-col items-center text-center justify-center p-3 rounded-3xl hover:bg-zinc-700">
          <img src="https://media.licdn.com/dms/image/D5603AQGjEyk2-036pQ/profile-displayphoto-shrink_800_800/0/1709301749669?e=1724284800&v=beta&t=P6mriYj3Cs4eZPryn-dUg0EWD0PgBzPpKX4F82Hz2xs" alt="Saloni's Pic" width={120} height={120} class="rounded-full mb-4" />
          <h3 class="text-xl font-bold mb-2">Saloni Singh</h3>
          <p class="text-gray-200 mb-4">Analyst - Goldman Sachs</p>
          <p class="text-gray-300">
            Hey I'm Saloni, working as a Software Engineer at Goldman Sachs.
          </p>
        </div>
      </A>

      <A class="flex" href={"https://www.linkedin.com/in/manav-kushwaha"}>
        <div class="flex flex-col items-center text-center justify-center p-3 rounded-3xl hover:bg-zinc-700">
          <img src="https://media.licdn.com/dms/image/D5603AQFsRRhvCxl7Gw/profile-displayphoto-shrink_800_800/0/1703688465729?e=1724284800&v=beta&t=il8Nx9R_3rFvelj9QHD0OFiVEAO2CGlWsQ7-jcXAEak" alt="Manav's Pic" width={120} height={120} class="rounded-full mb-4" />
          <h3 class="text-xl font-bold mb-2">Manav Kushwaha</h3>
          <p class="text-gray-200 mb-4">Software Engineer - Amuse Labs</p>
          <p class="text-gray-300">
            Hey I'm Manav, working as a software engineer at Amuse Labs.
          </p>
        </div>
      </A>
    </section >
  </>
}
