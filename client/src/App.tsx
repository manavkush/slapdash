import { createResource } from 'solid-js'
import './App.css'
import { Homepage } from './components/Homepage'
import { Navbar } from './components/Navbar'
import { Route, Router } from '@solidjs/router'
import { Team } from './components/Team'

function App() {
  const [user] = createResource(getUser)

  // Checks the backend if the user is logged-in
  async function getUser() {
    const response = await fetch("http://localhost:3000/getUser", {
      credentials: 'include'
    })
    const responseJson = await response.json()
    if (responseJson.error == "1") {
      return null
    }

    responseJson.user = JSON.parse(responseJson.user)
    return responseJson
  }

  // <Navbar user={null} />
  console.log("App")
  return (
    <Router root={() => <Navbar user={user()} />}>
      <Route path="/" component={() => <Homepage user={user()} />} />
      <Route path="/team" component={Team} />
    </Router>
  )
  // <Suspense fallback={<div>Loading</div>}>
  // </Suspense>
}

export default App
