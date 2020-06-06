import React, {useRef, useEffect} from 'react';
import Message from '../components/Message'
import MessageForm from '../components/messageForm'
import ParticipantContainer from './participantsContainer'

// POPULATE MESSAGES NEEDS TO HAPPEN OUTSIDE OF COMPONENT
// OR CHANGED SOMEHOW; IT'S BEING CALLED ON CONVERSATION SELECT
// AND MESSAGE UPDATE. REFACTOR
const populateMessages = (messages, users) => {
    console.log("POPULATEMESSAGES BEING CALLED")
    if (!!messages) {
        return messages.map(message => {
            return <Message key={message.id} message={message} user={users.find(user => user.id === message.user_id)}/>
        })
    }
}

const MessageContainer = (props) => {
    // CLEAN UP PROPS; NOW CAN DESTRUCTURE FROM ACTIVECONVERSATION
    const {title, description} = props.activeConversation
    // const {users} = props.users
    // const {messages} = props.messages
    const divRef = useRef(null);

    useEffect(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight
    });

    return (
        <div>
            <h3 className="banner">{title} : <span className="smaller">{description}</span></h3>
            <div className="messageContainer grid">
                <div className="msgView" ref={divRef} >
                    {populateMessages(props.messages, props.users)}
                </div>
                <div className="participants">
                    <ParticipantContainer users={props.users} />
                </div>
            </div>
            <div className="msgInput">
                <MessageForm onAddMessage={props.onAddMessage} />
            </div>
        </div>

        
    )
}

export default MessageContainer;