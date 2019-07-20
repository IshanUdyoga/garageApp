import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  StatusBar,
  Image,
  BackHandler,
  Alert
} from 'react-native';
//import Icon from 'react-native-ionicons'
import { withNavigation, DrawerActions } from 'react-navigation'
import {Tab, Tabs, TabHeading,Icon } from 'native-base';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Header from '../main/header'
import Tab_1 from '../main/tab_screens/tab_1'
import Tab_2 from '../main/tab_screens/tab_2'
import Tab_3 from '../main/tab_screens/tab_3'

import Drawer from '../main/drawer'
import ChatButton from '../main/other_screens/chatButton'
import PopUpDetails from '../main/other_screens/popUpDetails'
import { withNavigationFocus } from 'react-navigation';
import * as firebase from 'react-native-firebase';

 class FooterTabs extends Component {

  static navigationOptions = { header: null };

    constructor(props) {
  
        super(props);
        
        this.drawer = React.createRef();
        this.modalDetails = React.createRef();
                this.state={
                    image_slider:[],
                    cat_Data:[],
                    deals_Data:[],
                    sub_cat_Data:[],
                    hot_news_Data:[],
                    prod_Data: [],
                    word_Data: [],
                    req_data:[],

                    refreshing:false,
                    isLoading:false,
                    login_btn_active:true,
                    isOpen:false,
                    ProimagePath:'http://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png',
                    isProLoad:false,
                    userName:'',
                    loginTXT:'Login',
                    loginType:'',
                    grp2_cntry_or_other:'',

                    msgKey:'',

                    cat_id:'',
                    pay_terms:''
                };
    
                
    
      }


      componentDidMount(){
this.fetchData()
this.fetch_real_time_data()
this.back = BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
      }


      componentWillReceiveProps(nextProps) {
        if(this.props.isFocused && nextProps.isFocused){
          //console.log('not running anything')
          
        }
        
        if(this.props.isFocused && !nextProps.isFocused){
         // console.log('ufocus')
         this.back.remove()
         this.unsubscribe2.off()
        
        }
        
        if(!this.props.isFocused && nextProps.isFocused){
        //  console.log('focus')'
        this.fetch_real_time_data()
       this.fetchData()
        this.back = BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        }
            
              
        
          }


          onBackButtonPressed() {
            Alert.alert(
              'Are you sure you want to exit ?',
              '',
              [
                {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
                {text: 'YES', onPress: () => BackHandler.exitApp()},
              ]
            );
            return true
          }




fetchData (){
  this.setState({refreshing:true,isLoading:true})
  this.unsubscribe= firebase.database().ref('app_data');
  this.unsubscribe.once('value', snapshot => {
   
  let categories = snapshot.child("categories");
  let deals = snapshot.child("deals");
  let home_wordings = snapshot.child("home_wordings");
  let hot_news = snapshot.child("hot_news");
  let image_slider = snapshot.child("image_slider");

  const cat_Data = [];
  const deals_Data = [];
  const home_wordings_Data = [];
  const hot_news_Data = [];
  const image_slider_Data = [];
    
  categories.forEach((doc) => {
      cat_Data.push({
        key:doc.key,
        ...doc.toJSON(),
      })
    })

    deals.forEach((doc) => {
      deals_Data.push({
        key:doc.key,
        ...doc.toJSON(),
      })
    })

    home_wordings.forEach((doc) => {
      home_wordings_Data.push({
        key:doc.key,
        ...doc.toJSON(),
      })
    })

    hot_news.forEach((doc) => {
      hot_news_Data.push({
        key:doc.key,
        ...doc.toJSON(),
      })
    })

    image_slider.forEach((doc) => {
      image_slider_Data.push({
        key:doc.key,
        ...doc.toJSON(),
      })
    })
    

   //this.props.screenProps.setCatData(cat_Data)

   this.setState({
    image_slider:image_slider_Data,
    cat_Data:cat_Data,
    deals_Data:deals_Data,
    hot_news_Data:hot_news_Data,
    word_Data:home_wordings_Data,
    refreshing:false,
    isLoading:false,
    login_btn_active:false,
    // loginTXT:'Sign-out',
  })
     // this.setState({count:arr,refreshing:false})

  });
}


fetch_real_time_data(){
  var req_data =[]
  this.unsubscribe2= firebase.database().ref('all_requests');
  this.unsubscribe2.on('value', snapshot => {
    
    snapshot.forEach((doc) => {
      req_data.push({
        key:doc.key,
        ...doc.toJSON(),
      })
    })

    // setTimeout(() => {this.setState({req_data:req_data})}, 1000)

    this.setState({req_data:req_data})
    req_data = []
  });


  
}

    navigateToLogin=()=>{
      this.props.navigation.navigate('Login')
    }
    

    openDetails =(cat_id,pay_terms,grp2_cntry_or_other,cat_name,briefing_title,briefing_descrip_1,briefing_descrip_2,briefing_descrip_3,briefing_descrip_4)=>{
      this.setState({cat_id,grp2_cntry_or_other,pay_terms})
      this.modalDetails.current.mainFunc(cat_id,cat_name,briefing_title,briefing_descrip_1,briefing_descrip_2,briefing_descrip_3,briefing_descrip_4);
    }

    Navi_brfi_to_filt=()=>{
      const {grp2_cntry_or_other} = this.state
      const id = this.state.cat_id
      const pay_term = this.state.pay_terms
      this.props.screenProps.setCatId(id)
      this.props.navigation.navigate('Sort_filter',{id,pay_term,grp2_cntry_or_other})
    }




    toggleDrawer=()=>{
      if(this.state.isOpen){
         this.drawer.current.closeDrawer();
        
      }else{
         this.drawer.current.openDrawer();
        
  
      }
  }


  render() {
    return (
      <View style={styles.container} >
       <StatusBar
     backgroundColor="rgba(0, 0, 0, 0.70)"
     barStyle="light-content"
     translucent={false}
   />

      <Header _this={this} header_title={"Home"} screen={'home_screen'} toggleDrawer={this.toggleDrawer} />
              

        <Tabs locked={true} tabBarPosition="bottom" tabContainerStyle={{height: hp('6.5%')}} tabBarUnderlineStyle = {{height:hp('0.4%')}}>
          <Tab  heading={ <TabHeading style={{backgroundColor: '#2cba5b',}}>
          <Image source={{ uri: `asset:/images/img_icons/ico_home.png`}} style={styles.icoColor} /></TabHeading>}>
            
                    <Tab_1 
                    _this={this} 
                    image_slider={this.state.image_slider}
                    cat_Data={this.state.cat_Data} 
                    deals_Data={this.state.deals_Data}
                    hot_news_Data={this.state.hot_news_Data}
                    prod_Data={this.state.prod_Data} 
                    word_Data={this.state.word_Data}
                    isLoading={this.state.isLoading} 
                    login_btn_active = {this.state.login_btn_active} 
                    navigateToLogin={this.navigateToLogin}
                    openDetails={this.openDetails}
                    />
          </Tab>
          <Tab heading={ <TabHeading style={{backgroundColor: '#2cba5b',}}>
          <Image source={{ uri: `asset:/images/img_icons/ico_compass.png`}} style={styles.icoColor} /></TabHeading>}>
            <Tab_2 req_data={this.state.req_data}/>
          </Tab>
          <Tab heading={ <TabHeading style={{backgroundColor: '#2cba5b',}}>
          <Image source={{ uri: `asset:/images/img_icons/ico_person.png`}} style={styles.icoColor} /></TabHeading>}>
            <Tab_3 _this={this}/>
          </Tab>
        </Tabs>
         
     
         {/* <ChatButton uid={this.props.screenProps.msgKey} /> */}

        <Drawer _this={this} isOpen={this.state.isOpen} ProimagePath={this.state.ProimagePath} 
          isProLoad={this.state.isProLoad} userName={this.state.userName} ref={this.drawer}  screen={'buyer'} loginTXT={this.state.loginTXT}
          isLoggedIn={this.state.login_btn_active}
          cat_Data={this.state.cat_Data} loginType={this.state.loginType}/>
        
         <PopUpDetails ref={this.modalDetails} Navi_brfi_to_filt={this.Navi_brfi_to_filt}/> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  body:{
    flex:1
  },
  icoColor:{
      height:hp('6%'),
      width:hp('6%')
  },

  chat_con:{
    position:'absolute',
    bottom:hp('7.5%'),
    right:hp('1%'),
  },

  chat_con_view:{
    height:hp('7%'),
    width:hp('7%'),
    borderRadius:hp('15%') ,
    backgroundColor: '#f96092',
    justifyContent: 'center',
    alignItems: 'center',

    elevation:2,
    //shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },

  icoChat:{
    height:hp('5%'),
    width:hp('5%'),
  }

});

export default withNavigationFocus(FooterTabs);