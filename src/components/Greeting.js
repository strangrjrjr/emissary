import React from 'react';
// import ParticipantContainer from '../containers/participantsContainer';

const Greeting = (users) => {

    return(
        <div className="login_container">   
            <div className="no_conversations">
                <p>Welcome to Emissary, click on the menu to get started.</p>
                <p>Here's a list of active users:</p>
                {users.length ? console.log(users) : null}
            </div>
        </div>
    )
}

export default Greeting;