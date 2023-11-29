import './App.css';
import React, { useState } from 'react';

const LandingBody = () => 
  <header className="landing-body">
    <div>Chameleon</div>
  </header>

const PlayerBody = ({ location, role, status}) => {
  return(
    <>
      {location === "" ? (
        <PlayerBodyStatus status={status}/>
      ) : (
        <PlayerBodyLocation location={location} role={role}/>
      )}
    </>
  )
}

const PlayerBodyLocation = ({ location, role}) =>
  <header className="main-body">
    <div>Location: {location}</div>
    <div>Role: {role}</div>
  </header>

const PlayerBodyStatus = ({ status }) =>
  <header className="main-body">
    <div>{status}</div>
  </header>

const HostBody = ( {players}) => <div>
  <header className="host-body">
    <div className='host-text-header'>PlayerList</div>
    {players.map((entry, index) => (
        <div key={index} className='host-text'>{entry}</div>
      ))}
  </header>
</div>;

const LandingFooter = ({ onJoinButtonClick, onHostButtonClick }) => {
  return(
    <div className='main-footer'>
      <button className='flat-button-landing' onClick={onJoinButtonClick}>Join</button>
      <div style={{ width: '50px' }} />
      <button className='flat-button-landing' onClick={onHostButtonClick}>Player List</button>
    </div>
  )
};

const PlayerFooter = ({ onJoinButtonClick }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    // Update the state with the new input value
    setInputValue(event.target.value);
  };

  // Event handler for button click
  const handleButtonClick = () => {
    socket.send("join " + inputValue);
  };

  return(
    <div className="main-footer">
    <input className="flat-textbox" type="text" name="name" placeholder="username" onChange={handleInputChange}/>
    <button className="flat-button" onClick={handleButtonClick}>Join</button>
  </div>
  )
};

const HostFooter = ( {status}) => 
  <div className='main-footer'>
    {status}
  </div>;



var status = "";
var players = [];
var location = "";
var role = "";
const socket = new WebSocket("ws://localhost:6969");

socket.addEventListener("message", (event) => {
  var message = event.data;
  message = JSON.parse(message);
  if (message.type === "data"){
    status = message.status;
    players = message.players;

  } else if (message.type === "location") {
    location = message.location;
    role = message.role;
  }

});

function App() {
  const [showLandingBody, setShowLandingBody] = useState(true);
  const [showLandingFooter, setShowLandingFooter] = useState(true);
  
  const [showHostFooter, setShowHostFooter] = useState(false);
  const [showPlayerFooter, setShowPlayerFooter] = useState(false);
  
  const [showHostBody, setShowHostBody] = useState(false);
  const [showPlayerBody, setShowPlayerBody] = useState(false);
  
  const handleJoinButton = () => {
    setShowLandingFooter(false);
    setShowPlayerFooter(true);
  }
  
  const handleHostButton = () => {
    setShowLandingFooter(false);
    setShowHostFooter(true);
    setShowLandingBody(false);
    setShowHostBody(true);
  }

  const handlePlayerButton = () => {
    setShowLandingBody(false);
    setShowPlayerBody(true);
  }


  

  return (
    <div>
      {showLandingBody && <LandingBody/>}
      {showPlayerBody && <PlayerBody location={location} role={role} status={status}/>}
      {showHostBody && <HostBody players={players}/>}

      {showLandingFooter && <LandingFooter onJoinButtonClick={handleJoinButton} onHostButtonClick={handleHostButton}/>}
      {showPlayerFooter && <PlayerFooter onJoinButtonClick={handlePlayerButton}/>}
      {showHostFooter && <HostFooter status={status}/>}
    </div>
    
  )
};

export default App;