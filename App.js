import * as React from 'react';
import { Text, View, StyleSheet,AsyncStorage } from 'react-native';
import Main from './main'
import { GoogleSignin } from 'react-native-google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '389815418058-q093js91dnlledu3bafu513prv1l9tjr.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
 });

 //AsyncStorage.clear()
export default class App extends React.Component {

  constructor(props) {
    super(props);
 
    this.state = {
      color:'#ddd',
      cat_data:[],
      cat_id:0,
      msgKey:''
    };
  }

  setColor =(color)=>{
    this.setState({color:color})
  }

  setCatData =(cat_data)=>{
    this.setState({cat_data:cat_data})
  }
 
  setCatId =(cat_id)=>{
    this.setState({cat_id:cat_id})
  }

  setMsgKey =(msgKey)=>{
    this.setState({msgKey:msgKey})
  }

  render() {
    return (
     <Main 
     screenProps={{
       ...this.state,
       setColor:this.setColor,
       setCatData:this.setCatData,
       setCatId:this.setCatId,
       setMsgKey:this.setMsgKey,
    }} 
    
      />
    );
  }
}


