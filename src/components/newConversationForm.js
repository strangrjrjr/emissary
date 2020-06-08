import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class newConversationForm extends Component {
    constructor(props){
        super(props)
        this.state = {
        title: "",
        topic: "",
        // conversationIsPrivate: false
        }
    }   

    // ADD PARTICIPANTS AS WELL
    // Perhaps use a PUT or PATCH? Leverage UserConversation in conversations_controller

    // SEND VIA CABLE, USE CHANNEL TO CREATE, NOT POST TO CONTROLLER

    handleCreateConversation = () => {
        console.log(this.state)
        const conversation = this.state
        console.log(JSON.stringify({conversation:conversation}))
       fetch('http://localhost:3000/conversations', {
           method: 'POST',
           headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-type": "application/json"
         },
           body: JSON.stringify(conversation)
         }).then(res => res.json())
         .then(json => console.log(json))
       //   grab json and set active conversation
       // push history to messageContainer view
         this.props.history.push('/home')
       }

       onAddConversation = (conversation) => {
        console.log("ONADDCONVERSATION BEING CALLED")
        console.log(conversation)
      this.conversationChannel.send({
        title: conversation.title,
        topic: conversation.topic,
        user_id: localStorage.getItem("token")
      })
    }

    handleTitle = e => {
        this.setState({title: e.target.value})
    }

    handleTopic = e => {
        this.setState({topic: e.target.value})
    }

    // handleIsPrivate = e => {
    //     this.setState(prevState => ({conversationIsPrivate: !prevState.conversationIsPrivate}))
    // }

    handleSubmit = e => {
        e.preventDefault()
        this.handleCreateConversation(this.state)
    }

    render() {
        return (
            <div>
                <h3>Create a conversation</h3>
                <Link to='/home'>Back</Link>
                <form onSubmit={this.handleSubmit}>
                    <label>Title</label>
                    <input value={this.state.title} onChange={this.handleTitle}></input><br></br>
                    <label>Topic</label>
                    <input value={this.state.topic} onChange={this.handleTopic}></input><br></br>
                    {/* <label>Private?</label>
                    <input type="radio" value={this.state.conversationIsPrivate} onChange={this.handleIsPrivate}></input><br></br> */}
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}
export default newConversationForm;