import React, {useRef, useEffect} from 'react';
import {Outlet} from "react-router-dom";
import './Root.css';
import Menu from '../components/Menu';




function Root() {
  const ws_raspberrypi = useRef(null);

  useEffect(() => {
      console.log("connecting 2")
      ws_raspberrypi.current = new WebSocket(`ws://${window.location.hostname}:8443/`);
      ws_raspberrypi.current.onopen = (ws) => console.log("ws opened", ws);
      ws_raspberrypi.current.onclose = () => {
        console.log("ws closed")
        setTimeout(() => {
          ws_raspberrypi.current = new WebSocket(`ws://${window.location.hostname}:8443/`);
        }, 5000);
      }
      
      ws_raspberrypi.current.onmessage = function (event) {
        console.log(event)
      }

      const wsCurrent = ws_raspberrypi.current;

      return () => {
          wsCurrent.close();
      };
  }, []);

  return (
    <div className="Root">
      <Menu />
      <div className='gridContainer'>
        <div className='content'>
          <h1>PC Control Panel</h1>
          <br />
          <Outlet context={[ws_raspberrypi]}/>
        </div>
      </div>
    </div>
  );
}

export default Root;
