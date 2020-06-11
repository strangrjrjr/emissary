// import components, this is where actioncable lives??
const actioncable = require("actioncable")

const initialState = {
    cable: actioncable.createConsumer('ws://localhost:3000/cable'),
    conversations: [],
    activeConversation: null,
    error: false
}

export const rootReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'INIT_CONVERSATION_CHANNEL':
            return (state.cable.subscriptions.create({channel: "ConversationsChannel"}, {
                connected: () => {console.log("connected ConversationsChannel")},
                disconnected: () => {console.log("disconnected ConversationsChannel")},
                // FIX THIS
                received: data => {this.handleReceivedConversation(data)}
            }))
        case 'INIT_MESSAGE_CHANNEL':
            return(state.cable.subscriptions.create({
                channel: "MessagesChannel",
                id: action.payload.conversation.id
            },{
                connected: () => {console.log("connected", action.payload.conversation.id)},
                disconnected: () => {console.log("disconnected", action.payload.conversation.id)},
                // FIX THIS
                received: data => {this.handleReceivedMessage(data)}
            }))
        case 'HANDLE_DELETE':
            console.log("HANDLEDELETE CALLED")
            const conversation = action.payload.conversation
            state.conversationChannels[conversation.id].unsubscribe()
            const c = {conversation: {id: conversation.id, title: conversation.title, topic: conversation.topic}}
            // FIX THIS
            this.setState({conversations: state.conversations.filter(function(convo){return convo !== conversation})})
            fetch('http://localhost:3000/conversations', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify(c)
            }).then(res => res.json())
            .then(json => console.log(json))

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
            const conversation = action.payload.conversation
                console.log(conversation)
            return(Object.assign({}, state, {conversations: [...conversations], conversation}))

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