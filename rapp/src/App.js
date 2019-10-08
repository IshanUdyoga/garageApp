import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header'
import { Image} from '@material-ui/icons';
import Button from '@material-ui/core/Button';

class App extends React.Component{

  state = {
    
    data:[]

  }


  componentDidMount(){
   this.fetch()
  }

  fetch(){
    fetch(`https://api.myjson.com/bins/lingz`, {
    method: 'GET'
       })
       .then((response) => response.json())
       .then((responseJson) => {

          var arr =[];
          responseJson.data.forEach(element => {
            arr.push({...element})
          });

          this.setState({data:arr})
       })
       .catch((error) => {
        alert('Something went wrong please check your internet connection !')
       });
  }

  data(){
   const val = this.state.data.map(x=>{
    return(<div className="item"> 
          {x.name}
            </div>)
          })

    return val
  }

 render(){   
  return (
    <div className="App">
      <Header />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div className="body"> 
          <div className="col1">
              {this.data()}
          </div>

          <div className="col2">
            <Button variant="outlined" color="primary" >
              Upload
            </Button>
          </div>

        
        </div>
    </div>
  );
 }
}

export default App;
