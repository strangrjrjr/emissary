import React from 'react';

const Message = (props) => {

    const formatMessageDate = (date) => {


        let dateArray = date.toString().split(" ")
        let timeArray = dateArray[4].split(":")
        let ampm
        if (parseInt(timeArray[0]) === 12) {
            ampm = "pm"
        } else if (parseInt(timeArray[0]) > 12) {
            timeArray[0] = parseInt(timeArray[0]) - 12
            ampm = "pm"
        } else {
            ampm = "am"
        }
        let time = "".concat(timeArray[0], ":", timeArray[1])
        return `${dateArray[0]}, ${dateArray[1]} ${dateArray[2]}, ${time}${ampm}`
    }

    const {message, user} = props
    return(
        <div className="message" key={message.id}>
            <p className="messageHeader"><span className="messageName">{user.username}</span>  <span className="messageDate">{formatMessageDate(new Date(message.created_at))}</span></p>
            <p className="messageText">{message.text}</p>
        </div>
    )
}

export default Message;