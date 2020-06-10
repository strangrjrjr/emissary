This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Emissary 

## An IM-style chat app 

This repo is the frontend companion to my Ruby on Rails server, found [here](https://github.com/strangrjrjr/emissary_api).

### Features

- Login/logout/signup with auth via JWT
- Ability to create new conversations and add participants from user list
- Send and receive messages in real time via Websockets/ActionCable from Rails API
- Delete conversations and included messages
- HTTPS and WSS by default

### Technologies Used

- Create-react-app
- JWT authorization
- ActionCable/WebSockets
- React Hooks

### TODO (strech goals)

- [ ] Token expiration
- [ ] Offload conversation creation to channel, rather than a POST
- [ ] Offload conversation deletion to channel, rather than a POST
- [ ] Redux store to streamline props
- [ ] Online status indicator
- [ ] Contact list instead of list of all users
- [ ] Captcha or other bot-detection at signup
- [ ] OTA encryption of messages and user data

_This project is heavily based on an earlier group project called [FlatChat](https://github.com/strangrjrjr/flatchat_frontend). Many thanks to John Souza and Jazz Bozner for their contributions!_