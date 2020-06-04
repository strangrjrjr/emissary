import React, { Component, Fragment } from 'react';
// import ConversationContainer from '../containers/conversationContainer'
import MessageContainer from './messageContainer';
// import Cable from '../components/cable';
// import AuthWrapper from '../HOCs/AuthWrapper'
// import { ActionCableConsumer } from 'react-actioncable-provider';
// import { API_ROOT, HEADERS } from '../constraints/index'
import NavBar from './navBar'
import Greeting from '../components/Greeting'


const actioncable = require("actioncable")

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
          conversations: [],
          activeConversation: null,
          error: false
        }
      }
      
    
      componentDidMount = () => {
        fetch(`http://localhost:3000/conversations`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
         })
        .then(res => res.json())
        .then(json => {
        console.log(json)

        if (json.error) {
          this.setState({error: true})
        } else {

            this.setState({conversations: json})
            this.cable = actioncable.createConsumer('ws://localhost:3000/cable')
            this.conversationChannels = []

            json.forEach(conversation => {

            this.conversationChannels[`${conversation.id}`] = this.cable.subscriptions.create({
                channel: "MessagesChannel",
                id: conversation.id
            },{
                connected: () => {
                console.log("connected")
                },
                disconnected: () => {},
                received: data => {this.handleReceivedMessage(data)}
            })
            }
            )
            console.log(this.conversationChannels)
        }})
        }
    
        // I need a separate click handler for creating a conversation
      handleClick = activeConversation => {
        this.setState({activeConversation: activeConversation})


      }

      handleDelete = conversation => {
        fetch('http://localhost:3000/conversations', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
          body: JSON.stringify(conversation)
        }).then(res => res.json())
        .then(json => console.log(json))
      }

    
      handleReceivedMessage = message => {

        const {conversation_id} = message

        console.log("Here I am", message)
        this.setState(prevState => {
          const conversations = [...prevState.conversations]
          const convo = conversations.find(convo => convo.id === conversation_id)
          let messageFound = false
          convo.messages.forEach(msg => {
            if (message.id === msg.id) {
              messageFound = true
            }
          })
          if (!messageFound){
            convo.messages = [...convo.messages, message]
            this.setState({conversations})
          }
        })
      }
    
      onAddMessage = (message) => {
        this.conversationChannels[this.state.activeConversation.id].send({
          text: message,
          conversation_id: this.state.activeConversation.id,
          user_id: localStorage.getItem("token")
        })
      }
      render() {
          const {conversations, activeConversation, error} = this.state
        return(
            <Fragment>
                <NavBar 
                  conversations={conversations} 
                  handleClick={this.handleClick}
                  onLogout={this.logout}
                />
              {error ? this.props.history.push('/login') : null}
                    {activeConversation ?
                    <MessageContainer activeConversation={activeConversation} onAddMessage={this.onAddMessage} />
                : <Greeting />}
                
            </Fragment>
        )
      }
    
}

export default Home;