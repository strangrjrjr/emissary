import React, {useRef, useEffect} from 'react';
import Message from '../components/Message'
import MessageForm from '../components/messageForm'
import ParticipantContainer from './participantsContainer'


const populateMessages = (messages, users) => {
    console.log("POPULATEMESSAGES BEING CALLED")
    if (!!messages) {
        return messages.map(message => {
            return <Message key={message.id} message={message} user={users.find(user => user.id === message.user_id)}/>
        })
    } else {
        return null
    }
}

const MessageContainer = (props) => {
    const {title, topic, users, messages} = props.activeConversation
    const divRef = useRef(null);
    useEffect(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight
    });

    return (
        <div>
            <h3 className="banner">{title} : <span className="smaller">{topic}</span></h3>
            <div className="messageContainer grid">
                <div className="msgView" ref={divRef} >
                    {populateMessages(messages, users)}
                </div>
                <div className="participants">
                    <ParticipantContainer users={users} />
                </div>
            </div>
            <div className="msgInput">
                <MessageForm onAddMessage={props.onAddMessage} />
            </div>
        </div>

        
    )
}

export default MessageContainer;