// import components, this is where actioncable lives??
const actioncable = require("actioncable")

//  initial state

// export const reducer = (state=initialState, action) => {
    // switch (action.type){
        // case 'DO_THING':
            // return modified state
        // case 'ANOTHER_THING':
            // return modified state
        // default:
            // return state
    // }
// } 

const initialState = {
    cable: actioncable.createConsumer('ws://localhost:3000/cable'),
    conversations: [],
    activeConversation: null,
    error: false
}

export const reducer = (state=initialState, action) => {
    switch (action.type) {
        case 'INIT_CONVERSATION_CHANNEL':

    }
}