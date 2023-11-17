import './App.css';
import React, {useRef, useEffect} from 'react';


function MenuItem(props) {
  function handleClick() {
    console.log("test")
  }

  return (
    <div className="MenuItem" onClick={() => handleClick()}>
      <p className="Title">{props.name}</p>
    </div>
  )
}


function Menu() {
  return (
    <div className="Menu">
      <MenuItem name="Minecraft Server" description="Its a minecraft server"/>
      <MenuItem name="Home PC" description="Its a minecraft server"/>
    </div>
  )
}

function App() {
  const ws = useRef(null);

  useEffect(() => {
      console.log("connecting")
      ws.current = new WebSocket(`ws://${window.location.hostname}:8443/`);
      ws.current.onopen = () => console.log("ws opened");
      ws.current.onclose = () => console.log("ws closed");

      const wsCurrent = ws.current;

      return () => {
          wsCurrent.close();
      };
  }, []);

  return (
    <div className="App">
      <Menu />
      <div className='gridContainer'>
        <div className='content'>
          <h1>PC Control Panel</h1>
          <br />
          <button onClick={() => ws.current.send("test")}>test</button>
        </div>
      </div>
    </div>
  );
}

export default App;
