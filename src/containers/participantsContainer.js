import React from 'react';
import Participant from '../components/Participant'

const ParticipantsContainer = props => {

    const { users } = props

    const populateParticipants = () => {
        // console.log(users)
        return users.map(user => {
            return <Participant key={user.username} user={user} />
        })
    }

    // add others from list of active participants

    return(
        <div>
            <h4 className="participants_header">Conversation Participants</h4>
            <ul>
                {populateParticipants()}
            </ul>
        </div>
    )
}

export default ParticipantsContainer;