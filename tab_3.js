import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Linking
} from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Tab_3 extends Component {

  constructor (props) {

    super(props);

    this.state = {
      refreshing:false
    };
  }

  componentDidMount(){
  
   
  } 



  view_tab(){
    if (this.props.userName === 'Guest') {
      return(
        <View style={styles.alert_box}>
          <View style={styles.alert_box_2}>
            <Text style={styles.alert_msg}>Please Login to View your Account.</Text>
            <TouchableOpacity style={styles.alert_btn_pad} onPress={()=> this.navigateToLogin()}>
              <View style={styles.alert_btn}>
                <Text style={styles.alert_btn_txt}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  navigateToLogin(){
    this.props._this.props.navigation.navigate('Login')
    this.props.direct_navi(0)
  }


  navigatee=async(screen)=>{
    await this.props._this.props.screenProps.setActiveTab(true)
    await this.props._this.props.screenProps.setNavi_scrn(2)
    this.props._this.props.navigation.navigate(screen)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.profileimage}><Image source={{ uri: `asset:/images/img_icons/profile.png`}} style={styles.profilepicimage}/>
            <View style={styles.pro_icon_name}>
              <Text style={styles.icon_pro_name_font}>{this.props.userName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.profilemessage}>
          <View style={styles.pro_noti}>
            <Image source={{ uri: `asset:/images/img_icons/icon_poli_gray.png`}} style={styles.pro_icon_St} />
            <View style={styles.pro_ico_noti}><Text style={styles.pro_ico_txt}>{this.props._this.props.screenProps.policy_data.length}</Text></View>
          </View>
          <View style={styles.pro_mes}>
            <Image source={{ uri: `asset:/images/img_icons/icon_ref_gray.png`}} style={styles.pro_icon_St} />
            <View style={styles.pro_ico_mes}><Text style={styles.pro_ico_txt}>12</Text></View>
          </View>
        </View>

        <View style={styles.profileiconsection}>
          <View style={styles.proprofileiconitem}>
            <TouchableOpacity 
              onPress={()=> this.navigatee('MyProfile')}
              style={styles.proprofileiconiteminner}><Image source={{ uri: `asset:/images/img_icons/icon_pro_gray.png`}} style={styles.title_icon_St} />
              <View style={styles.icon_name}><Text style={styles.icon_name_font}>My Profile</Text></View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={()=>this.navigatee('Mypolicy')}
            style={styles.proprofileiconitem}>
            <View style={styles.proprofileiconiteminner}><Image source={{ uri: `asset:/images/img_icons/icon_poli_gray.png`}} style={styles.title_icon_St} />
              <View style={styles.icon_name}><Text style={styles.icon_name_font}>My Policy</Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.proprofileiconitem}>
            <View style={styles.proprofileiconiteminner}><Image source={{ uri: `asset:/images/img_icons/icon_ref_gray.png`}} style={styles.title_icon_St} />
              <View style={styles.icon_name}><Text style={styles.icon_name_font}>My Refferal</Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>this.navigatee('MyHistory')} 
            style={styles.proprofileiconitem}>
            <View style={styles.proprofileiconiteminner}><Image source={{ uri: `asset:/images/img_icons/icon_history_gray.png`}} style={styles.title_icon_St} />
            <View style={styles.icon_name}><Text style={styles.icon_name_font}>History</Text></View>
            </View>
          </TouchableOpacity>
        </View>
        {this.view_tab()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  body:{
    flex:1
  },
  top:{
    flex:0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilepicimage: {
    width:hp('20%'),
    height:hp('20%'),
    borderColor: '#fff',
    borderWidth: 4,
    borderRadius: 100,
  },
  profilemessage: {
    flex: 0.1,
    backgroundColor: '#d8d8d8',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pro_noti:{
    flex: 1,
    padding: hp('2%'),
    alignItems:'flex-end',
  },
  pro_ico_noti:{
    width: hp('4%'),
    height: hp('4%'),
    backgroundColor: '#e82a6b',
    borderRadius: 100,
    position: 'absolute',
    bottom: hp('4%'),
    right: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pro_mes:{
    flex: 1,
    padding: hp('2%'),
  },
  pro_ico_mes:{
    width: hp('4%'),
    height: hp('4%'),
    backgroundColor: '#e82a6b',
    borderRadius: 100,
    position: 'absolute',
    bottom: hp('4%'),
    left: hp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pro_ico_txt:{
    fontSize:hp('2%'),
    fontFamily: 'seg_light',
    color:'#fff',
    fontWeight: '700',
  },
  pro_icon_St:{
    width: wp('10%'),
    height:hp('10%'),
  },
  profileiconsection: {
    flex: 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: hp('2%'),
  },
  proprofileiconitem: {
    width: wp('46%'),
    height: hp('18%'),
    padding: hp('1%'),
  },
  proprofileiconiteminner: {
    flex: 1,
    backgroundColor: '#d8d8d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title_icon_St:{
    paddingTop: hp('0.7%'),
    width:'35%',
    height:'35%',
  },
  icon_name: {
    paddingTop: hp('0.7%'),
  },
  icon_name_font: {
    fontSize:hp('3%'),
    fontFamily: 'seg_light',
  },
  pro_icon_name: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon_pro_name_font: {
    fontSize:hp('3%'),
    paddingBottom: hp('2%'),
  },

  alert_box: {
    backgroundColor: '#d9d9d9',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
    flex: 1,
  },
  alert_box_2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alert_btn_pad: {
    height:hp('11%'),
    width:'100%',
    marginTop:-hp('28%'),
    paddingHorizontal:wp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  alert_msg: {
    fontSize: hp('2.5%'),
    fontFamily: 'seg_light',
    fontWeight: "bold",
    marginTop: hp('30%'),
  },
  alert_btn: {
    height:'10%',
    width:'100%',
    borderRadius:hp('1.5%'),
    backgroundColor:'#ec1f1f',
    justifyContent: 'center',
    alignItems:'center'
  },
  alert_btn_txt: {
    fontSize:hp('3.5%'),
    fontFamily: 'seg_light',
    color:'#fff',
    marginTop:-hp('1%')
  },


});