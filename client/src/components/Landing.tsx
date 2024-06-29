import { createSignal } from 'solid-js'

function handleLogin() {
  window.location.href = "http://localhost:3000/auth/google"
}

export function Landing() {
  const [count, setCount] = createSignal(0)
  return <>
    <h1>Vite + Solid</h1>
    <div class="card">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count()}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>

    <div class="card">
      <button onClick={handleLogin}>
        Login with Google
      </button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and Solid logos to learn more
    </p>
  </>
}
