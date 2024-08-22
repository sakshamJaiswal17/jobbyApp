import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './components/Home/index'
import Jobs from './components/Jobs/index'
import Login from './components/Login/index'
import NotFound from './components/NotFound/index'
import ProtectedRoute from './components/ProtectedRoute'
import JobsItemDetail from './components/JobsItemDetail'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobsItemDetail} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)
export default App
