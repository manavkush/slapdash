/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { createResource } from 'solid-js'

function Layout() {
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

}

const root = document.getElementById('root')
render(() => (
  <App />
), root!)
