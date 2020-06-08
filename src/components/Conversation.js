import React from 'react';


const Conversation = (props) => {
    // console.log(props)
    const { handleClick, conversation, handleDelete } = props

    return (
        <li className="conversation_li" onClick={() => handleClick(conversation)}>{conversation.title} <span onClick={() => handleDelete(conversation)}>X</span></li>
    )

}

export default Conversation;