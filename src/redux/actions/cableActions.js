const actioncable = require("actioncable")

export const initCable = () => {
  return (dispatch) => {
    const cable = actioncable.createConsumer('ws://localhost:3000/cable')
    dispatch({ type: 'INIT_CABLE', payload: cable})
  }
}	

export const initConversationsChannel = (cable) => {
  // do channel setup here and dispatch as payload to state
  // how to initialize cable and then call functions on it?
  cable.subscriptions.create({channel: "ConversationsChannel"}, {
    connected: () => {console.log("connected ConversationsChannel")},
    disconnected: () => {console.log("disconnected ConversationsChannel")},
    // FIX THIS
    received: data => {handleReceivedConversation(data)}
})
  return (dispatch) => {dispatch({type: 'INIT_CONVERSATION_CHANNEL', payload: cable})}
}

export const initMessagesChannel = (cable, conversation) => {
  cable.subscriptions.create({
    channel: "MessagesChannel",
    id: conversation.id
},{
    connected: () => {console.log("connected", conversation.id)},
    disconnected: () => {console.log("disconnected", conversation.id)},
    // FIX THIS
    received: data => {handleReceivedMessage(data)}
})
  return (dispatch) => {dispatch({type: 'INIT_MESSAGE_CHANNEL', payload: cable})}
}

export const handleDelete = (cable, conversation) => {
  // PUT FETCH HERE, NOT IN REDUCER
  cable.conversationChannels[conversation.id].unsubscribe()
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
  return (dispatch) => {dispatch({type: 'HANDLE_DELETE', payload: conversation})}
}

export const handleActiveConversation = () => {
  return (dispatch) => {dispatch({type: 'HANDLE_ACTIVE_CONVERSATION'})}
}

export const handleReceivedMessage = () => {
  return (dispatch) => {dispatch({type: 'HANDLE_RECEIVED_MESSAGE'})}
}

export const handleReceivedConversation = () => {
  return (dispatch) => {dispatch({type: 'HANDLE_RECEIVED_CONVERSATION'})}
}






























// export function subscribeConversation(conversationId) {
//     return {
//       channel: 'conversations',
//       room: `conversation_${conversationId}`,
//       received: NEW_MESSAGE,
//     }
//   }
  
//   export function unsubscribeConversation(conversationId) {
//     return {
//       channel: 'conversations',
//       room: `conversation_${conversationId}`,
//       leave: true,
//     }
//   }
  
//   // Action creator with received function:
//   export function subscribeConversation(conversationId) {
//     return dispatch => dispatch({
//       channel: 'conversations',
//       room: `conversation_${conversationId}`,
//       received: data => dispatch({
//         type: NEW_MESSAGE,
//         payload: data.conversation,
//       }),
//     });
//   }
  