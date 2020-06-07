import React, { Component } from 'react'
import ConversationContainer from './conversationContainer'
import { Link } from 'react-router-dom'
// import M from "materialize-css";

class NavBar extends Component {

  componentDidMount() {
    
  }
//   TODO CREATE NEW CONVERSATION FORM, RENDER IT, PICK BETTER ROUTE NAME
  render() {
    const { conversations, handleCreateConversation, handleActiveConversation } = this.props
    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <Link to="home" className="brand-logo right">Emissary</Link>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
            </ul>
          </div>
        </nav>

        <ul>
        <li onClick={(() => {localStorage.setItem("token", "")})}><Link to="login">Log Out</Link></li>
          <li><Link to='/new' handleCreateConversation={handleCreateConversation}>Add Conversation</Link></li>
          <ConversationContainer conversations={conversations} handleClick={handleActiveConversation}/>
        </ul>
      </div>
    )
  }
}

export default NavBar;