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
            activeUsers: [],
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
            const ac = actioncable.createConsumer('ws://localhost:3000/cable')
            ac.subscriptions.create({channel: "ConversationsChannel"}, {
                connected: () => {console.log("connected ConversationsChannel")},
                disconnected: () => {console.log("disconnected ConversationsChannel")},
                received: data => {this.handleReceivedConversation(data)}
            })
            this.conversationChannels = []
            json.forEach(conversation => {
            this.conversationChannels[`${conversation.id}`] = ac.subscriptions.create({
                channel: "MessagesChannel",
                id: conversation.id
            },{
                connected: () => {console.log("connected", conversation.id)},
                disconnected: () => {console.log("disconnected", conversation.id)},
                received: data => {this.handleReceivedMessage(data)}
            })
            } 
            )
            ac.subscriptions.create({channel: "AppearancesChannel"}, {
              connected: () => {console.log("connected AppearancesChannel")},
              disconnected: () => {console.log("disconnected AppearancesChannel")},
              received: data => {this.handleAppearances(data)}
            })
        }})
        }

      handleActiveConversation = activeConversation => {
        this.setState({activeConversation: activeConversation})
      }

      handleAppearances = user => {
        console.log("APPEARANCE")
          this.setState(prevState => ({activeUsers: [...prevState.activeUsers, user]}))
          console.log(this.state.activeUsers)
      }

      handleDelete = conversation => {
        console.log("HANDLEDELETE CALLED")
        this.setState({activeConversation: null})
        this.conversationChannels[conversation.id].unsubscribe()
        const c = {conversation: {id: conversation.id, title: conversation.title, topic: conversation.topic}}
        this.setState({conversations: this.state.conversations.filter(function(convo){return convo !== conversation})})
        fetch('http://localhost:3000/conversations', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-type": "application/json"
        },
          body: JSON.stringify(c)
        }).then(res => res.json())
        .then(json => console.log(json))
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
      handleReceivedConversation = conversation => {
        console.log(conversation)
        this.setState(prevState => ({
            conversations: [...prevState.conversation], conversation
        }))
      }
    
      onAddMessage = (message) => {
        this.conversationChannels[this.state.activeConversation.id].send({
          text: message,
          conversation_id: this.state.activeConversation.id,
          user_id: localStorage.getItem("token")
        })
      }

      render() {
          const {conversations, activeConversation, error, activeUsers} = this.state
        return(
            <Fragment>
                <NavBar 
                  conversations={conversations} 
                  handleActiveConversation={this.handleActiveConversation}
                  handleDelete={this.handleDelete}
                  onLogout={this.logout}
                  history={this.props.history}
                />
              {error ? this.props.history.push('/login') : null}
                    {activeConversation ?
                    <MessageContainer activeConversation={activeConversation} onAddMessage={this.onAddMessage}  />
                : <Greeting users={activeUsers}/>}
            </Fragment>
        )
      }
    
}

export default Home;