import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';

class newConversationForm extends Component {
    constructor(props){
        super(props)
        this.state = {
        title: "",
        topic: "",
        users: [],
        selectedUsers: []
        // conversationIsPrivate: false
        }
    }   

    // ADD PARTICIPANTS AS WELL
    
    componentDidMount() {
        fetch(`http://localhost:3000/users`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
         })
        .then(res => res.json())
        .then(json => this.setState({users: json.users}))
    }

    // SEND VIA CABLE, USE CHANNEL TO CREATE, NOT POST TO CONTROLLER

    handleCreateConversation = () => {
        const conversation = this.state
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
            // this.onAddConversation(conversation)
       // push history to messageContainer view
         this.props.history.push('/home')
       }

       onAddConversation = (conversation) => {
        console.log("ONADDCONVERSATION BEING CALLED")
        console.log(conversation)
        this.conversationChannel.send({
        title: conversation.title,
        topic: conversation.topic,
        users: this.state.selectedUsers,
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

    handleSelect = e => {
        this.setState(prevState => ({selectedUsers: [...prevState.selectedUsers, e.target.value]}))
    }

    listUsers = () => {
        return this.state.users.map(user => {
            return (<Fragment key={user.id}><label><input type="radio" value={user.username}  />{user.username}</label><br></br></Fragment>)
        })
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
                    {this.listUsers()}
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}
export default newConversationForm;