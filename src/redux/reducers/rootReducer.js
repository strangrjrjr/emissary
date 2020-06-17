// import components, this is where actioncable lives??

const initialState = {
    cable: null,
    conversations: [],
    activeConversation: null,
    error: false
}

export const rootReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'INIT_CABLE':
            return (Object.assign({}, state, {cable: action.payload}))
        case 'INIT_CONVERSATION_CHANNEL':
            return (Object.assign({}, state, {cable: action.payload}))
        case 'INIT_MESSAGE_CHANNEL':
            return (Object.assign({}, state, {cable: action.payload}))
        case 'HANDLE_DELETE':
            console.log("HANDLEDELETE CALLED")
            const conversation = action.payload.conversation
            state.conversations.filter(function(convo){return convo !== conversation})
            return (Object.assign({}, state, {activeConversation: null}))
        case 'HANDLE_ACTIVE_CONVERSATION':
            return (Object.assign({}, state, {activeConversation: action.payload.conversation}))
        case 'HANDLE_RECEIVED_MESSAGE':
            const {conversation_id} = action.payload.message
            console.log("HANDLERECEIVEDMESSAGE CALLED")
            return(Object.assign({}, state => {
            const conversations = [...state.conversations]
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
            }
            }))
        case 'HANDLE_RECEIVED_CONVERSATION':
            const receivedConversation = action.payload.conversation
                console.log(receivedConversation)
            return(Object.assign({}, state, {conversations: [...state.conversations], receivedConversation}))

        case 'ON_ADD_MESSAGE':
            // DOES THIS EVEN WORK WITH REDUX?
            const message = action.payload.message
            state.conversationChannels[state.activeConversation.id].send({
                text: message,
                conversation_id: state.activeConversation.id,
                user_id: localStorage.getItem("token")
            })
            return state
        default:
            return state
    }
}
export default rootReducer;