import React from 'react';
import {Link} from "react-router-dom";


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
      <Link to={"/"}>{"test"}</Link>
      <Link to={"/Minecraft_Server"}>{"test"}</Link>
    </div>
  )
}

export default Menu;