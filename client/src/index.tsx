/* @refresh reload */
import { render } from 'solid-js/web'
import 'solid-devtools'

import './index.css'
import App from './App'
import { Route, Router } from '@solidjs/router'
import { Team } from './components/Team'
import { Homepage } from './components/Homepage'

const root = document.getElementById('root')
render(() => (
  <Router root={App}>
    <Route path="/" component={Homepage} />
    <Route path="/team" component={Team} />
  </Router>
), root!)
