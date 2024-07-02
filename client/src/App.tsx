import { Context, ParentComponent, Suspense, createContext, createResource } from 'solid-js'
import './App.css'
import { Navbar } from './components/Navbar'

export const UserContext: Context<any> = createContext()

/**
 * App is the wrapper component for all the routes
 * It creates context and passes it to all the child components
 */
const App: ParentComponent<{}> = (props) => {
  const [user] = createResource(getUser)

  /* 
   * Gets the user info from the backend.
  */
  async function getUser() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/getUser`, {
      credentials: 'include'
    })
    const responseJson = await response.json()
    if (responseJson.error == "1") {
      return null
    }

    responseJson.user = JSON.parse(responseJson.user)
    return responseJson.user
  }

  return (
    <Suspense fallback={<div> Loading </div >}>
      <UserContext.Provider value={user} >
        <Navbar>
          {props.children}
        </Navbar>
      </UserContext.Provider>
    </Suspense >
  )
}

export default App