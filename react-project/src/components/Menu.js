import React from 'react';
import {Link} from "react-router-dom";


function MenuItem(props) {
    function handleClick() {
      console.log("test")
    }
  
    return (
      <Link to={props.href}>
        <div className="MenuItem" onClick={() => handleClick()}>
          <p className="Title">{props.name}</p>
        </div>
      </Link>
    )
  }
  
  
function Menu() {
  return (
    <div className="Menu">
      <MenuItem href="/Minecraft_Server" name="Minecraft Server" description="Its a minecraft server"/>
      <MenuItem href="/Home_Pc" name="Home PC" description="Its a minecraft server"/>
    </div>
  )
}

export default Menu;