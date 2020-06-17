import React from 'react';

const Greeting = (conversations) => {
    
    return(
        <div className="login_container">   
            <div className="no_conversations">
                <p>Welcome to Emissary, click on the menu to get started.</p>
                {/* Add all active users... */}
                <p>Please refresh periodically to check for newly created or deleted conversations. This bug will be fixed in a future release.</p>
            </div>
        </div>
    )
}

export default Greeting;