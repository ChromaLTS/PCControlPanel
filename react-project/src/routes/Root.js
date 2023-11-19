import React, {useRef, useEffect} from 'react';
import {Outlet} from "react-router-dom";
import './Root.css';
import Menu from '../components/Menu';




function Root() {
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
    <div className="Root">
      <Menu />
      <div className='gridContainer'>
        <div className='content'>
          <h1>PC Control Panel</h1>
          <br />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Root;
