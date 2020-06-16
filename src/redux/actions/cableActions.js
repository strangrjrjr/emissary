

export const initCable = () => {
  return (dispatch) => {
    const cable = ActionCable.createConsumer('ws://localhost:3000/cable')
    dispatch({ type: 'INIT_CABLE', cable: cable})
  }
}	

export const initConversationsChannel = () => {
  return (dispatch) => {dispatch({type: 'INIT_CONVERSATION_CHANNEL'})}
}

export const initMessagesChannel = () => {
  return (dispatch) => {dispatch({type: 'INIT_MESSAGE_CHANNEL'})}
}

export const handleDelete = (conversation) => {
  // PUT FETCH HERE, NOT IN REDUCER
  state.conversationChannels[conversation.id].unsubscribe()
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
  