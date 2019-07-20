import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Alert,
  Button,
  ScrollView,
  Linking,
  FlatList
} from 'react-native';

import Header from '../header'
import Drawer from '../drawer'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withNavigation, DrawerActions } from 'react-navigation'
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-ionicons'
import sort from 'fast-sort';

let deviceHeight = Dimensions.get('window').height

export default class MyHistory extends Component {

  constructor (props) {
    super(props);
    this.drawer = React.createRef();
    this.state = {
        data:[],
        isOpen:false,
        refreshing:true,
        isLoading:false,
        login_btn_active:true,
        isOpen:false,
        ProimagePath:'http://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png',
        isProLoad:false,
        loginTXT:'Login',
        loginType:'',
        grp2_cntry_or_other:'',
        history:[],
        prod_arr:[],

        Selected_Item:[],
        age:0,
        gender_value:1,
        smk_value:1,
        paym_tm:'10',
        sum_insured:0,
        annual_premium:0,
    };
  }

//======== Left side navigator
  toggleDrawer=()=>{
    if(this.state.isOpen){
      this.drawer.current.closeDrawer(); 
    }else{
      this.drawer.current.openDrawer();
    }
  }


  componentDidMount(){
    this.getHistoryData()
  }

  getHistoryData(){
    AsyncStorage.getItem("history").then((value) => {
        if(value !== null){
          this.setState({history:JSON.parse(value)})
        }else{
          this.setState({history:[],})
        }
  
      })
      .then(res => {
       this.fetch_prod_Data(this.state.history)

            AsyncStorage.getItem("isLoggedIn").then((value) => {
              if(value === 'true'){
                this.setState({loginTXT:'Sign-out'})
              }else{
                this.setState({loginTXT:'Login'})
              }
                
            })
            .then(res => {
                
            });
      });


  }

  fetch_prod_Data = async (prodArr) => {
      //alert(JSON.stringify(prodArr))
    this.setState({refreshing:true})
      fetch(`http://mln.talliance.com/mylife/get_sub_prod_reply.php`, {
        method: 'GET'
          })
          .then((response) => response.json())
          .then(async(responseJson) => {
          //alert(responseJson)
          if(responseJson !== "No"){
            var allArr=[]
           allArr= await responseJson.filter(function(itemx){
              var isProd = false;
              isProd = prodArr.find(o => o.prod_uid === itemx.p_uid);
              return isProd})

            var arr = []
              var bar = new Promise((resolve, reject) => {
                allArr.forEach((value, index, array) => {

                  var Prod = prodArr.find(o => o.prod_uid === value.p_uid);
                                  arr.push({
                                    ...value,
                                    sort_val:Prod.sort_val
                                  })
                                  
                    if (index === array.length -1) resolve();
                });
            });
            
            bar.then(() => {
                  this.setState({prod_arr:arr,refreshing:false})
            });

            
          }else{
            this.setState({prod_arr:[],refreshing:false})
          }
          

  
          })
          .catch((error) => {
            alert('Something went wrong please check your internet connection !')
              this.setState({refreshing:false})
          });
      
}


containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].prod_uid === obj) {
            return true;
        }
    }

    return false;
}




      emptymsgFun(){
        if(this.state.refreshing){
          return(<View style={styles.emptyListPAD}>
                  <Text style={styles.emptyTXT}>Please wait..</Text>
                  <Icon name="ios-refresh" style={styles.EmtyIco} />
                  </View>
                  )
        }else{
      
            return(<View style={styles.emptyListPAD}>
                  <Text style={styles.emptyTXT}>No History..</Text>
                  <Icon name="ios-alert" style={styles.EmtyIco} />
                  </View>)
        }
      }


      th_sp(val){
        //separate number with comma
        try{
         return(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        }catch(e){
          return('')
        }
      }


      clearHistory(){
        Alert.alert(
            'Clear all history ?',
            '',
            [
              {text: 'Ok', onPress: () => this.clear()},
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
      }


      open_product_view= async(item)=>{
        var userInput=this.state.history.find(o => o.prod_uid === item.p_uid);
      
        await this.props.screenProps.setCatId(item.categories_cat_id);

      
        this.props.navigation.navigate('Product_view', {
          prod_id:item.p_uid,
          cat_id:item.categories_cat_id,
          Selected_Item:item,
          age:userInput.age,
          gender_value:userInput.gender,
          smk_value:userInput.smk_st,
          paym_tm:userInput.paym_tm,
          sum_insured:userInput.sum_in,
          annual_premium:userInput.ann_pre,});
      
      }

      clear(){
          this.setState({prod_arr:[]})
          AsyncStorage.removeItem('history')
      }

  render() {
    return (
      <View style={styles.container}>
        <Header _this={this} header_title={"Home"} screen={'home_screen'} toggleDrawer={this.toggleDrawer} />

        <View style={styles.my_policy}>
            <View style={styles.title_row_1}></View>
            <View style={styles.title_row_2}><Text style={styles.my_policy_txt}>History</Text></View>
            <TouchableOpacity style={styles.title_row_1} onPress={()=> this.clearHistory()}>
                <Text style={styles.clear_txt}>Clear</Text>
            </TouchableOpacity>
            
        </View>

        <View style={styles.policy_sec}>
          <FlatList
            data={sort(this.state.prod_arr).desc(u => parseInt(u.sort_val))}
            ListEmptyComponent={this.emptymsgFun()}
            keyExtractor={(item, index) => item.policy_id}
            renderItem={({ item }) => 

              <View style={styles.items} >
                <View style={styles.item_inner}>
                  <View style={styles.policy_header}>
                    <Image style={styles.imgCon} source={{ uri: item.p_img_url}} /> 
                    <Text style={styles.titleTXT}>{item.p_name}</Text>
                  </View>
                  <TouchableOpacity style={styles.policy_number} onPress={()=> this.open_product_view(item)}>
                  <Text style={styles.item_title}>View More</Text>
                  </TouchableOpacity>
                  
                </View>
              </View>
            // <View><Text>{item.age}</Text><Text>{item.age}</Text></View>
            
          }
          />

        </View>
   
        



        {/* ======================  Left Navigator ======================= */}
        <Drawer _this={this} isOpen={this.state.isOpen} ProimagePath={this.state.ProimagePath} 
          isProLoad={this.state.isProLoad} userName={this.state.userName} ref={this.drawer}  screen={'buyer'} loginTXT={this.state.loginTXT}
          isLoggedIn={this.state.login_btn_active} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body:{
    flex:1
  },

//=========== Ploicy Header
  my_policy:{
    backgroundColor: '#d8d8d8',
    alignItems:'center',
    justifyContent: 'center',
    width:'100%',
    height:hp('8%'),
    flexDirection:'row'
  },
  title_row_1:{
    flex:0.2,
    alignItems:'center',
    justifyContent: 'center',
  },

  title_row_2:{
    flex:0.6,
    alignItems:'center',
    justifyContent: 'center',
},

  my_policy_txt:{
    fontSize:hp('3.5%'),
    fontFamily: 'seg_light',
    padding: hp('0.3%'),
  },

  clear_txt:{
    fontSize:hp('3%'),
    fontFamily: 'seg_light',
    padding: hp('0.3%'),
  },

//=========== Ploicy Item section
  policy_sec:{
    flex: 1,
    width: '100%',
  },
  items:{
    //marginTop: hp('2%'),
    padding: hp('2%'),
  },
  policy_header:{
    height:hp('8%'),
    width: '100%',
    backgroundColor: '#F04545',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems:'center',
  },
  policy_number:{
    height:hp('8%'),
    width: '100%',
    backgroundColor: '#F1F0F0',
    borderBottomColor: '#617D8A',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    padding: hp('1%'),
  },
  policy_date:{
    height:hp('8%'),
    width: '100%',
    backgroundColor: '#F1F0F0',
    flexDirection: 'row',
    alignItems:'center',
    padding: hp('1%'),
  },
  policy_holder:{
    height:hp('10%'),
    width: '100%',
    backgroundColor: '#E7E7E7',
    flexDirection: 'row',
    alignItems:'center',
    paddingLeft: hp('1%'),
  },
  imgCon:{
    width:hp('6%'),
    height:hp('6%'),
    marginHorizontal: wp('2%'),
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  titleTXT:{
    fontSize:hp('3%'),
    fontFamily: 'seg_light',
    alignItems:'center',
    color: '#fff',
  },
  item_text:{
    fontSize:hp('2.2%'),
    fontFamily: 'seg_light',
    alignItems:'center',
    fontWeight: '400',
    //justifyContent: 'flex-end',
    marginRight:0,
  },
  item_title_pre:{
    fontSize:hp('2.7%'),
    fontFamily: 'seg_light',
    color: '#6997E8',
    alignItems:'center',
    fontWeight: '500',
  },

  item_title:{
    fontSize:hp('2.7%'),
    fontFamily: 'seg_light',
    color: '#6997E8',
    alignItems:'center',
    fontWeight: '400',
  },
  total_prm:{
    flex:1,
    alignItems:'center',
    backgroundColor: '#10E68A',
    borderTopLeftRadius: 22,
    height:hp('10%'),
    width: '40%',
    color: '#fff',
    textAlign: 'center',
    padding:hp('1%'),
  },
  pro_total:{
    fontSize:hp('2.7%'),
    fontFamily: 'seg_light',
    color: '#fff',
    alignItems:'center',
    fontWeight: '500',
  },
  item_text_pro:{
    fontSize:hp('2.5%'),
    fontFamily: 'seg_light',
    alignItems:'center',
    fontWeight: '400',
    marginRight:0,
    marginTop:0,
    color: '#fff',
  },

  emptyListPAD:{
    height:deviceHeight/1.7,
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
  },

  emptyTXT:{
    fontWeight:'bold',
    fontSize:hp('2.5%'),
    color:'#898989'
  },

  EmtyIco:{
    marginTop: hp('1%'),
    fontSize:hp('5%'),
    color:'#898989'
  },

});