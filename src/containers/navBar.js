import React, { Component } from 'react'
import ConversationContainer from './conversationContainer'
import { Link } from 'react-router-dom'
import "materialize-css";

class NavBar extends Component {

  componentDidMount() {
    const M = window.M
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {edge: 'right'});
  }

  render() {
    const { conversations, handleActiveConversation, handleDelete } = this.props
    
    return (
    <div>
        <nav>
          <div className="nav-wrapper">
            <Link to="home" data-target="slide-out" className="sidenav-trigger show-on-large">Menu</Link>
            <Link to="home" onClick={() => handleActiveConversation(null)} className="brand-logo center">Emissary</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
            </ul>
          </div>
        </nav>

        <ul id="slide-out" className="sidenav sidenav-close">
        <li onClick={(() => {localStorage.setItem("token", "")})}><Link to="login">Log Out</Link></li>
          {/* {this.handleNewConversation()} */}
          <li ><Link to='/new'>Add Conversation</Link></li>
          <li><div className="divider"></div></li>
          <ConversationContainer conversations={conversations} handleClick={handleActiveConversation} handleDelete={handleDelete}/>
        </ul>
      </div>
    )
  }
}

export default NavBar;