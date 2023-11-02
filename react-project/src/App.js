import './App.css';
import React, { useState, useCallback, useEffect }  from 'react';
import useWebSocket, { ReadyState }  from 'react-use-websocket';


function MenuItem(props) {
  function handleClick() {
    console.log("test")
  }
  return (
    <div className="MenuItem" onClick={() => handleClick}>
      <h2>{props.name}</h2>
      <p>{props.description}</p>
    </div>
  )
}


function Menu() {
  return (
    <div className="Menu">
      <MenuItem name="Minecraft Server" description="Its a minecraft server" />
    </div>
  )
}

function App() {
  const [socketUrl, setSocketUrl] = useState('wss://localhost:443');
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {});

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('wss://localhost:443'),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className="App">
      <h1>PC Control Panel</h1>
      <Menu />
      <br />
      <div>
        <button onClick={handleClickChangeSocketUrl}>
          Click Me to change Socket Url
        </button>
        <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>
        <span>The WebSocket is currently {connectionStatus}</span>
        {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
