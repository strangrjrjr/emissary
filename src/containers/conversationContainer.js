import React from 'react';
import Conversation from '../components/Conversation.js'

const populateConversations = (conversations, handleClick, handleDelete) => {
    return conversations.map( conversation => {
        return <Conversation key={conversation.id} handleClick={handleClick} conversation={conversation} handleDelete={handleDelete} />
    })
}

const ConversationContainer = (props) => {
    const conversations = props.conversations
    const handleClick = props.handleClick
    const handleDelete = props.handleDelete
    
    return (
        <div>
            {conversations ? 
                <div>
                    <h4 className="conversation_header">All Conversations</h4>
                    <ul>
                        {populateConversations(conversations, handleClick, handleDelete)}
                    </ul>
                </div>
            :
                null
            }
            
        </div>
    )

}


export default ConversationContainer;