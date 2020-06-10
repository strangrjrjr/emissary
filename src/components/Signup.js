import React, {useState, Fragment} from 'react';
import {useHistory, Link} from 'react-router-dom'

const Signup = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [error, setError] = useState(false)

    const history = useHistory()

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handlePasswordConfirmationChange = (e) => {
        setPasswordConfirmation(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('https://emissary-chat.herokuapp.com/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                user: {
                    username: username,
                    email: email,
                    password: password,
                    password_confirmation: passwordConfirmation
                }
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.error) {
                setError(true)
            } else {
            localStorage.setItem("token", json.jwt)
            setIsLoggedIn(true)
            }
        })
    }

    return (
        <Fragment>
            {error ? history.push('/error'):null}
            {isLoggedIn ? 
            history.push('/home')
            :
            <div className="login_container">
                <div className="login">
                <h2 className="cardHeader">Emissary</h2>
                <h4 className="cardHeader">Sign up</h4>
                <form onSubmit={e => handleSubmit(e)}>
                    <input
                        value={username}
                        onChange={e => handleUsernameChange(e)} 
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={e => handleEmailChange(e)}
                        placeholder="Email"
                        />
                    <input
                        type="password"
                        value={password}
                        onChange={e => handlePasswordChange(e)} 
                        placeholder="Password"
                    />
                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={e => handlePasswordConfirmationChange(e)} 
                        placeholder="Password"
                    />
                    <button type="submit" className="button">Sign Up!</button>
                </form>
                <Link to="/login"><button className="button">Log In</button></Link>
            </div>
            </div>}
        </Fragment>
    )
}

export default Signup