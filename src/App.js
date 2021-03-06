
import React, {Component} from 'react';
import Home from './containers/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Error from './components/Error';
import NewConversationForm from './components/newConversationForm';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import './index.css'



class App extends Component {
  render() {
  return (
        <Router>
          <div>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path ='/new' component={NewConversationForm} />
              <Route exact path='/home' component={Home}/>
              <Route exact path='/signup' component={Signup} />
              <Route exact path='/error' component={Error} />
              <Route path='*' component={Home} />
            </Switch>
          </div>
        </Router>
    )};
}
export default App;
