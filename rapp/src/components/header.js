import React from 'react';
import '../App.css';
import { Home,  Menu} from '@material-ui/icons';

class Header extends React.Component{

 render(){   
  return (
      <div className="App-header">

       <div className="h1">
       <Home className="icons" fontSize="large"/>
       </div>

       <div className="h2">
           Home
       </div>

       <div className="h3">
       <Menu className="icons" fontSize="large"/>
       </div>

      </div>
  );
 }
}

export default Header;
