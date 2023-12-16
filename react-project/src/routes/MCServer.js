import React from 'react';
import { useOutletContext } from "react-router-dom";

function MCServer(props) {
  const [ws_raspberrypi] = useOutletContext();

  function handleClick() {
    let sendObj = {
      command: "isHomePCServerRunning"
    }
    ws_raspberrypi.current.send(JSON.stringify(sendObj))
  }

  return (
    <div className="MC_Server">
        <h1>MC Server</h1>
        <button onClick={() => handleClick()}>test</button>
    </div>
  );
}

export default MCServer;
