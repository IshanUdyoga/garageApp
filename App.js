import * as React from 'react';
import { Text, View, StyleSheet,AsyncStorage } from 'react-native';
import Main from './main'
import { GoogleSignin } from 'react-native-google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '389815418058-q093js91dnlledu3bafu513prv1l9tjr.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
 });

 //AsyncStorage.removeItem('history')
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this._tabs = null;
    this.state = {
      color:'#ddd',
      cat_data:[],
      policy_data:[],
      cat_id:0,
      msgKey:'',
      is_last_tab_Active:false,
      navi_scrn:0
    };
  }

  setColor =(color)=>{
    this.setState({color:color})
  }

  setPolicyData =(policy_data)=>{
    this.setState({policy_data})
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

  setActiveTab=(val)=>{
    this.setState({is_last_tab_Active:val})
  }

  setNavi_scrn=(val)=>{
    this.setState({navi_scrn:val})
  }

  render() {
    return (
     <Main 
     screenProps={{
       ...this.state,
       setColor:this.setColor,
       setCatData:this.setCatData,
       setPolicyData:this.setPolicyData,
       setCatId:this.setCatId,
       setMsgKey:this.setMsgKey,
       setActiveTab:this.setActiveTab,
       setNavi_scrn:this.setNavi_scrn
    }} 
      />
    );
  }
}

// How to call a function
// this.props.screenProps.setColor()
