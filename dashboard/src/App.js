import './App.css';
import Header from './Components/Header.js';
import Dashboard from './Components/dashboard.js';
import Sidebar from './Components/sidebar.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'


function App() {
  return (
    <Router>
    <div className="App">
      <Header/>
<div className='container'>
     <Sidebar/> <div className='main-content'>
      <Routes>
         <Route path="/" element={<Dashboard/>}></Route></Routes>
         
      </div>
        </div> 
        </div>   
      </Router>    
      
     
   
  );
}

export default App;
