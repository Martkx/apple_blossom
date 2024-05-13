import React from 'react';
import { sidebarData } from './sidebarData.js';
import '../App.css'

function Sidebar() {
  return (
    <div className="Sidebar">
      <ul className="sidebarList">
      {sidebarData.map((val, key) => 
        ( <li key={key} className="row" id={window.location.pathname === val.link ? "active" : ""} onClick={() => {window.location.pathname = val.link}}>
        
        <div id="icon">{val.icon}</div>
        <div id="title">{val.title}</div>
        </li>
        
      ))}
    </ul>
    </div>
  );
}

export default Sidebar;