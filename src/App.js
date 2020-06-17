
import React, {Component} from 'react';
import Home from './containers/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Error from './components/Error';
import newConversationForm from './components/newConversationForm';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import './index.css'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers/rootReducer'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as CableActions from './redux/actions/cableActions';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
  );

class App extends Component {

  componentDidMount() {
    this.props.initCable()
  }

  render() {
  return (
      <Provider store={store}>
        <Router>
          <div>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path ='/new' component={newConversationForm} />
              <Route exact path='/home' component={Home}/>
              <Route exact path='/signup' component={Signup} />
              <Route exact path='/error' component={Error} />
              <Route path='*' component={Home} />
            </Switch>
          </div>
        </Router>
      </Provider>
    )};
}
const mapStateToProps = state => {
  return {
    cable: state.cable
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(CableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
