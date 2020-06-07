import React, {Component} from 'react';

class newConversationForm extends Component {

        
    render() {
        return (
            <div>
                <h3>Create a conversation</h3>
                <form onSubmit={this.props.handleNewConversation}>
                    <label>Title</label>
                    <input></input><br></br>
                    <label>Topic</label>
                    <input></input><br></br>
                    <label>Private?</label>
                    <input type="radio"></input><br></br>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}
export default newConversationForm;