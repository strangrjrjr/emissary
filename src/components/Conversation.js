import React from 'react';


const Conversation = (props) => {
    const { handleClick, conversation, handleDelete } = props

    return (
        <div>
            <li className="conversation_li" onClick={() => handleClick(conversation)}>{conversation.title}</li>
            <button className="delete" onClick={() => handleDelete(conversation)}>X</button>
        </div>
    )

}

export default Conversation;