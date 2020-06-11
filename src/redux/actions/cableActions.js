	

export function subscribeConversation(conversationId) {
    return {
      channel: 'conversations',
      room: `conversation_${conversationId}`,
      received: NEW_MESSAGE,
    }
  }
  
  export function unsubscribeConversation(conversationId) {
    return {
      channel: 'conversations',
      room: `conversation_${conversationId}`,
      leave: true,
    }
  }
  
  // Action creator with received function:
  export function subscribeConversation(conversationId) {
    return dispatch => dispatch({
      channel: 'conversations',
      room: `conversation_${conversationId}`,
      received: data => dispatch({
        type: NEW_MESSAGE,
        payload: data.conversation,
      }),
    });
  }
  