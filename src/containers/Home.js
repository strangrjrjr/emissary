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
          // keep track of active users (?)
          activeUsers: [],
          // store logged in user for styling differences (?)
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

            const ac = actioncable.createConsumer('wss://emissary-chat.herokuapp.com/cable')
            ac.subscriptions.create({channel: "ConversationsChannel"}, {
              connected: () => {console.log("connected ConversationsChannel")},
              disconnected: () => {console.log("disconnected ConversationsChannel")},
              received: data => {this.handleReceivedConversation(data)}
          })
          // create subscription for appearances
          // store in state; pass to greeting component && participants

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
            ac.subscriptions.create({
              channel: "AppearancesChannel"},{
                connected: () => {console.log("connected AppearancesChannel")},
                disconnected: () => {console.log("disconnected AppearancesChannel")},
                received: data => {this.handleAppearances(data)}
              }
            )
        }})
        }

      handleActiveConversation = activeConversation => {
        this.setState({activeConversation: activeConversation})
      }

      handleAppearances = user => {
        // need logic for login and logout
        this.setState(prevState => {[...prevState.activeUsers, user]})
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
          console.log(prevState.conversations)
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
        // console.log(conversation)
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