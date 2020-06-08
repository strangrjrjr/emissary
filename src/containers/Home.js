import React, { Component, Fragment } from 'react';
import MessageContainer from './messageContainer';
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
        if (json.error) {
          this.setState({error: true})
        } else {
            this.setState({conversations: json,
            })

            this.cable = actioncable.createConsumer('ws://localhost:3000/cable')
            this.cable.subscriptions.create({channel: "ConversationsChannel"})
            this.conversationChannels = []
            json.forEach(conversation => {
            this.conversationChannels[`${conversation.id}`] = this.cable.subscriptions.create({
                channel: "MessagesChannel",
                id: conversation.id
            },{
                connected: () => {console.log("connected", conversation.id)},
                disconnected: () => {},
                received: data => {this.handleReceivedMessage(data)}
            })
            } 
            )
        }})
        }

      handleActiveConversation = activeConversation => {
        this.setState({activeConversation: activeConversation})
      }

      handleCreateConversation = (title, topic, isPrivate) => {
         const conversation = {title: title, topic: topic, private: isPrivate}
        fetch('http://localhost:3000/conversations', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          },
            body: JSON.stringify(conversation)
          }).then(res => res.json())
          .then(json => console.log(json))
        //   grab json and set active conversation
        // push history to messageContainer view
          this.props.history.push('/home')
        }

      handleDelete = conversation => {
          console.log(JSON.stringify({conversation: {id: conversation.id, title: conversation.title, topic: conversation.topic}}))
          const c = {conversation: {id: conversation.id, title: conversation.title, topic: conversation.topic}}
        fetch('http://localhost:3000/conversations', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-type": "application/json"
        },
          body: JSON.stringify(c)
        }).then(res => res.json())
        .then(json => console.log(json))
        this.props.history.push('/home')
      }

    
      handleReceivedMessage = message => {
        const {conversation_id} = message
        console.log("HANDLERECEIVEDMESSAGE CALLED")
        this.setState(prevState => {
          const conversations = [...prevState.conversations]
          const convo = conversations.find(convo => convo.id === conversation_id)
            if(!!convo.messages) {
                if (convo.messages.includes(message)){
                    return conversations
                } else {
                    convo.messages = [...convo.messages, message]
                    return conversations
                }
        } else {
            convo.messages = [message]
            return conversations
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
    //   TODO PROPERLY HANDLE NEW CONVERSATION FORM
      render() {
          const {conversations, activeConversation, error} = this.state
        return(
            <Fragment>
                <NavBar 
                  conversations={conversations} 
                  handleActiveConversation={this.handleActiveConversation}
                  handleCreateConversation={this.handleCreateConversation}
                  handleDelete={this.handleDelete}
                  onLogout={this.logout}
                />
              {error ? this.props.history.push('/login') : null}
                    {activeConversation ?
                    <MessageContainer activeConversation={activeConversation} onAddMessage={this.onAddMessage}  />
                : <Greeting />}
                
            </Fragment>
        )
      }
    
}

export default Home;