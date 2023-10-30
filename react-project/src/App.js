import './App.css';


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
      <h1>yo</h1>
      <MenuItem name="Minecraft Server" description="Its a minecraft server" />
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>PC Control Panel</h1>
      <Menu />
    </div>
  );
}

export default App;
