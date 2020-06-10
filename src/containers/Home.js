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
        fetch(`https://emissary-chat.herokuapp.com/conversations`, {
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

            this.cable = actioncable.createConsumer('wss://emissary-chat.herokuapp.com/cable')
            this.cable.subscriptions.create({channel: "ConversationsChannel"})
            this.conversationChannels = []
            json.forEach(conversation => {
            this.conversationChannels[`${conversation.id}`] = this.cable.subscriptions.create({
                channel: "MessagesChannel",
                id: conversation.id
            },{
                connected: () => {console.log("connected", conversation.id)},
                disconnected: () => {console.log("disconnected", conversation.id)},
                received: data => {this.handleReceivedMessage(data)}
            })
            } 
            )
        }})
        }

      handleActiveConversation = activeConversation => {
        this.setState({activeConversation: activeConversation})
      }

      handleDelete = conversation => {
          console.log("HANDLEDELETE CALLED")
            this.setState({activeConversation: null})
            console.log(this.state)
          this.conversationChannels[conversation.id].unsubscribe()
          const c = {conversation: {id: conversation.id, title: conversation.title, topic: conversation.topic}}
          this.setState({conversations: this.state.conversations.filter(function(convo){return convo !== conversation})})
        fetch('https://emissary-chat.herokuapp.com/conversations', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-type": "application/json"
        },
          body: JSON.stringify(c)
        }).then(res => res.json())
        .then(json => console.log(json))
        .then(this.forceUpdate())
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

      render() {
          const {conversations, activeConversation, error} = this.state
        return(
            <Fragment>
                <NavBar 
                  conversations={conversations} 
                  handleActiveConversation={this.handleActiveConversation}
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