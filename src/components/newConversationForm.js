import React, {Component} from 'react';
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
        const conversation = {conversation: {title:this.state.title, topic: this.state.topic, users: this.state.selectedUsers}}
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

    handleSelect = (e) => {
        e.persist()
        const user = this.state.users.find(user => user.username === e.target.value)
        console.log(user)
        this.setState(prevState => ({selectedUsers: [...prevState.selectedUsers, user]}))
    }

    listUsers = () => {
        return this.state.users.map(user => {
            return (
            <p key={user.id}>
                <label>
                    <input className='with-gap' name="participant-select" type="checkbox" value={user.username} onClick={this.handleSelect}  />
                    <span>{user.username}</span>
                </label>
            </p>)
        })
    }

    render() {
        return (
            <div>
                <h4>Create a conversation</h4>
                <h6>You will be included by default, no need to select yourself</h6>
                <Link to='/home'>Back</Link><br></br>
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