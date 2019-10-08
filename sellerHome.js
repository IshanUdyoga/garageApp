
import React, {
    Component
  } from 'react'
  import {
    ReactNative,
    findNodeHandle,
    ActivityIndicator,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    FlatList,
    LayoutAnimation,
    UIManager,
    BackHandler,
    ImageBackground,
    TextInput,
    Animated,
    Easing,
    Keyboard,
    AsyncStorage,
    Linking,
    Alert
  } from 'react-native'

  import { BoxShadow} from 'react-native-shadow'
  import LottieView from 'lottie-react-native';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Drawer from './drawer';
  import ImgUpModal from './imgUpModal';
  import Icon from 'react-native-ionicons';
  import firebase from 'react-native-firebase';
  import { SimpleAnimation } from 'react-native-simple-animations';
  import { getStatusBarHeight } from 'react-native-status-bar-height';
  import ImagePicker from 'react-native-image-crop-picker';
  import { withNavigationFocus } from 'react-navigation';
  import BottomTab from './bottomTab';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import ImageModal from './imageViewer'
  import CmtModal from './cmntBox'
  import stringsoflanguages from './stringsoflanguages';
  import { Rating, AirbnbRating } from 'react-native-ratings';
  import Comment from '../../src/img/comment.png';
  import Phone from '../../src/img/phone.png';
  import GrandBlue from '../../src/img/grandBlue.png';
  import Line from '../../src/img/line.png';

  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  
  let deviceHeight = Dimensions.get('window').height
  let deviceWidth = Dimensions.get('window').width
  let statHeight = getStatusBarHeight()

  let deviceH = Dimensions.get('screen').height;
let bottomNavBarH = deviceH - deviceHeight;
  
  const shadowStyle = {
    width: deviceWidth,
    height: deviceHeight/10,
    color: "#000",
    border: deviceHeight/40,
    radius: 3,
    opacity: 0.30,
    x: 0,
    y: 0,
  //style: { marginBottom: hp('2%') },
  }
  

  
  
  const shadowStyle3 = {
    width: deviceWidth/1.5,
    height: hp('60%'),
    color: "#1fb7b6",
    border: deviceHeight/50,
    radius: deviceHeight/25,
    opacity: 0.30,
    x: 0,
    y: 0,
   style : {margin:wp('3%'),justifyContent: 'center',alignItems: 'center',} 
  }


  const shadowStyle3scrll ={
    width: deviceWidth/1.1,
    height: hp('80%'),
    color: "#1fb7b6",
    border: deviceHeight/50,
    radius: deviceHeight/25,
    opacity: 0.35,
    x: 0,
    y: 0,
  }
  

  
  const imagePick ={
    height:hp('15%'),
    width:wp('40%'),
    radius:hp('5%'),
    color: "#eee",
    border: hp('4%'),
    opacity: 0.5,
    x: 0,
    y: 0,
  }
  
  

  
  
  
  class SellerHome extends Component {
  
    static navigationOptions = {
       
        header: null,
        headerLeft: null
    };
  
  
  
  
    constructor(props) {
  
        super(props);
        this.openPickerCam = this.openPickerCam.bind(this);
        this.openPickerLib = this.openPickerLib.bind(this);
        this._scrollToInput = this._scrollToInput.bind(this);
        this.message = React.createRef();
        this.topUPimg = new Animated.Value(hp('7%'))
        this.topClose = new Animated.Value(- hp('8%'))
        this.topPending=new Animated.Value( -hp('15%'))
        this.scrollY= new Animated.Value(0),
        this.drawer = React.createRef();
                this.state={
                    scrollY: new Animated.Value(0),
                    foodName:'',
                    location:'',
                    price:'',

                    upmodal:false,
                    text:'a',
                    isOpen:false,
                    imagePath:'asset:/images/uploadImgBack.png',
                    imagePathTemp:'',
                    backOpa:1,
                    foodData:[],
                    newOrders:[],
                    isbtnpressed:false,
                    refreshing:false,
                    statHeight:statHeight,
                    ProimagePath:'asset:/images/Chef.png',
                    isProLoad:false,
                    userName:'Guest',
                    isLoading:false,
                    ImageModal:false,

                    descrtip:'',

                    titlePlaceholder:stringsoflanguages.sellerHome.placeHold_1,
                    locationPlaceholder:stringsoflanguages.sellerHome.placeHold_2,
                    discountsPlaceholder:stringsoflanguages.sellerHome.placeHold_3,
                    discriptionPlaceholder:stringsoflanguages.sellerHome.placeHold_4,
                   
                    userid:'',
                    isKey:false,
                    loginTXT:'',

                    imagePathViewer:'',
                    ImageModal:false,
                    cmtModal:false,

                    UserNameCmnt:'',
                    orid:'',
                    selid:'',
                    cusid:'',

                    
                };

    
                
    
      }
  
    componentDidMount = () => {
      
      AsyncStorage.getItem("userID").then((value) => {
        if(value !== null){
          this.fetchData(value)
          this.fetchNewOrderData(value)
        }else{
          alert('Error')
        }
  })

      this.isLogin()
      this.back = BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
      this.fetchContentData()

      AsyncStorage.getItem("userName").then((value) => {
        if(value !== null){
          this.setState({userName:value})
        }else{
          this.setState({userName:'Guest'})
        }
          })
        .then(res => {

        });
    }
  
  
    componentWillMount(){
 

    }
  
  
  
  onBackButtonPressed() {
    return true;
  }

 


  componentWillReceiveProps(nextProps) {
    if(this.props.isFocused && nextProps.isFocused){
      //console.log('not running anything')
      
    }
    
    if(this.props.isFocused && !nextProps.isFocused){

   
      this.unsubscribe.off()
      this.onchangeDb.off()
        this.back.remove()
        
    }
    
    if(!this.props.isFocused && nextProps.isFocused){
    //  console.log('focus')
    
    this.back = BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
                
                  AsyncStorage.getItem("userID").then((value) => {
                    if(value !== null){
                      this.fetchData(value)
                      this.fetchNewOrderData(value)
                    }else{
                      alert('Error')
                    }
              })

                  this.fetchContentData()
                  this.isLogin()
                  AsyncStorage.getItem("userName").then((value) => {
                            if(value !== null){
                              this.setState({userName:value})
                            }else{
                              this.setState({userName:'Guest'})
                            }
                      })
                .then(res => {
                    
                });

        }
        
          
    
      }

      isLogin(){
        AsyncStorage.getItem("isLoggedIn").then((value) => {
          if(value === 'true'){
            this.setState({loginTXT:stringsoflanguages.drawer.btn3_logout})
              
          }else{
            this.setState({loginTXT:stringsoflanguages.drawer.btn3_login})
          }
      })
      .then(res => {
          
      });
      
      
      }

  
    fetchContentData(){
      this.setState({isLoading:true})

      AsyncStorage.getItem("userID").then((value) => {
               if(value !== null){

                          
                                  fetch(`https://prescrib.smartlogic.lk/php-api/getContentData.php?user_id=${value}`, {
                                    method: 'GET'
                                })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                
                                 if(responseJson.pharmacy_name !== null){
                                   this.setState({titlePlaceholder:responseJson.pharmacy_name})
                                 }else{
                                  this.setState({titlePlaceholder:stringsoflanguages.sellerHome.placeHold_1})
                                 }

                                 if(responseJson.location !== null){
                                  this.setState({locationPlaceholder:responseJson.location})
                                }else{
                                 this.setState({locationPlaceholder:stringsoflanguages.sellerHome.placeHold_2})
                                }

                                if(responseJson.discounts !== null){
                                  this.setState({discountsPlaceholder:responseJson.discounts})
                                }else{
                                 this.setState({discountsPlaceholder:stringsoflanguages.sellerHome.placeHold_3})
                                }

                                if(responseJson.description !== null){
                                  this.setState({discriptionPlaceholder:responseJson.description})
                                }else{
                                 this.setState({discriptionPlaceholder:stringsoflanguages.sellerHome.placeHold_4})
                                }

                                if(responseJson.backgroundImage !== null){
                                  this.setState({imagePath:responseJson.backgroundImage})
                                }else{
                                 this.setState({imagePath:'asset:/images/uploadImgBack.png'})
                                }

                                if(responseJson.urlLogo !== null){
                                  this.setState({ProimagePath:responseJson.urlLogo})
                                }else{
                                 this.setState({ProimagePath:'asset:/images/Chef.png'})
                                }

                                this.setState({isLoading:false,userid:value})
                                    
                                })
                                .catch((error) => {
                                    alert(error)
                                });
                      
                      
         
              }
        })
      .then(res => {

      });
    }
  
  
  
    fetchNewOrderData =async(uid)=>{

      this.onchangeDb= firebase.database().ref('allUsers/seller/'+uid+'/orders');
    this.onchangeDb.on('child_added', snapshot => {
      
          this.fetchNewOrderDataOnce(uid)
      });
              
    }


    fetchNewOrderDataOnce(uid){
      firebase.database().ref('allUsers/seller/'+uid+'/orders').once('value', snapshot => {
        this.setState({refreshing:true})
        // let count = snapshot.child("list").val();
        const arr = [];
   
    snapshot.forEach( (doc) => {
         
      const CusId = doc.toJSON().customer_id
 firebase.database().ref('allUsers').once('value', snapshot => {
               arr.push({
                 key:doc.key,
                 seller_id:doc.toJSON().seller_id,
                 customer_id:doc.toJSON().customer_id,
                 ord_id:doc.toJSON().ord_id,
                 pres_img_url:doc.toJSON().pres_img_url,
                 phar_name:doc.toJSON().phar_name,
                location:doc.toJSON().location,
                 username:snapshot.child('customer/'+CusId+'/username').val(),
                 phone:snapshot.child('customer/'+CusId+'/phone').val(),
               })
           
          
              })
         })
   
        setTimeout(() => {this.setState({refreshing:false,newOrders:arr,})}, 1300)
      });
    }



    pushToOngoingOrders(item){
      Alert.alert(
        'Confirm Selection !',
        'After Accept your order delivery persons can pickup',
        [
          {text: 'Accept', onPress: () => 
                    firebase.database().ref('delivery/new_orders').push({

                      sell_id:item.seller_id,
                      cus_id:item.customer_id,
                      pres_img_url:item.pres_img_url,
                      ord_id:item.ord_id,
                      phar_name:item.phar_name,
                      location:item.location,
                      state:"1",
                      isAccept:"false",
                      isDelivAccpt:"0",

              
            }).then((data)=>{
                //success callback
                this.deleteItem(item.key,item.seller_id)
              
            }).catch((error)=>{
                //error callback
                alert('error ' , error)
            })
        },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );

      

      
    }


          deleteItem(key,uid){
            firebase.database().ref('allUsers/seller/'+uid+'/orders').child(key).remove().then(()=>{
              //success callback
              this.fetchNewOrderDataOnce(uid)
              alert('Order Successfully Updated !')
              
          }).catch((error)=>{
              //error callback
              alert(error)
          })


          }

  fetchData =async(uid)=>{

    this.unsubscribe= firebase.database().ref('delivery/new_orders');
  this.unsubscribe.orderByChild("sell_id").equalTo(uid).on('value',async snapshot => {
     this.setState({refreshing:true})
     // let count = snapshot.child("list").val();
     const arr = [];

 snapshot.forEach( (doc) => {
        const CusId = doc.toJSON().cus_id
        const DeliId = doc.toJSON().deli_id
   firebase.database().ref('allUsers').once('value', snapshot => {
           
            arr.push({
              key:doc.key,
              username:snapshot.child('customer/'+CusId+'/username').val(),
              usernameDeli:snapshot.child('delivery/'+DeliId+'/username').val(),
              phoneDeli:snapshot.child('delivery/'+DeliId+'/phone').val(),
              ratingDeli:snapshot.child('delivery/'+DeliId+'/ratings').val(),

              ord_id:doc.toJSON().ord_id,
              phone:snapshot.child('customer/'+CusId+'/phone').val(),
              seller_id:doc.toJSON().sell_id,
              customer_id:doc.toJSON().cus_id,
              pres_img_url:doc.toJSON().pres_img_url,
              state:doc.toJSON().state,
              isDelivAccpt:doc.toJSON().isDelivAccpt
            })
        
        })
  
      })

     setTimeout(() => {this.setState({refreshing:false,foodData:arr,})}, 1300)
        
    });
            
  }







  
  
  
 
    handleRefresh = ()=>{
      this.setState({ refreshing: false }, function() {
      //   this.fetchData()
        });
  };
  
  
  

  
  
  
  
    toggleDrawer(){
      if(this.state.isOpen){
         this.drawer.current.closeDrawer();
        
      }else{
         this.drawer.current.openDrawer();
         this.animation.play(30, 80);
  
      }
  }
  
  
  

  
  

  
  emptymsgFun(){
    if(this.state.refreshing){
      return(<View style={styles.emptyListPAD}>
              <Text style={styles.emptyTXT}>{stringsoflanguages.sellerHome.loading_1}</Text>
              <Icon name="ios-refresh" style={styles.EmtyIco} />
              </View>
              )
    }else{

        return(<View style={styles.emptyListPAD}>
              <View style={styles.emBOX} >
              <Text style={styles.emptyTXT}>{stringsoflanguages.sellerHome.loading_2}</Text>
              <Icon name="ios-alert" style={styles.EmtyIco} />
              </View>
              </View>)
    }
  }
  
  
  header(translateY,translateOpa){

    return(<Animated.View style={[styles.bubbles,{opacity:translateOpa,transform: [{translateY: translateY}]}]}>
      <ScrollView horizontal={true}>
                <TouchableOpacity style={[styles.bubblesPad]}>
                <Text style={styles.txtBubble}>{stringsoflanguages.sellerHome.head_tag_1}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.bubblesPad]}>
                <Text style={styles.txtBubble}>{stringsoflanguages.sellerHome.head_tag_2}</Text>
                  </TouchableOpacity>


                  <TouchableOpacity style={[styles.bubblesPad]}>
                <Text style={styles.txtBubble}>{stringsoflanguages.sellerHome.head_tag_3}</Text>
                  </TouchableOpacity>


                  <TouchableOpacity style={styles.bubblesPad}>
                <Text style={styles.txtBubble}>{stringsoflanguages.sellerHome.head_tag_4}</Text>
                  </TouchableOpacity>

        </ScrollView>

    </Animated.View>)
  }



  imageUpload(){

    this.setState({upmodal:true})
  }


  openPickerCam(){
    this.setState({imagePathTemp:this.state.imagePath})
      ImagePicker.openCamera({
        width: 400,
        height: 300,
        cropping: true,
      }).then(image => {
        this.setState({imagePath:image.path,upmodal:false})
        this.aniInImgUp()
      });
  }

  openPickerLib(){
    this.setState({imagePathTemp:this.state.imagePath})
        ImagePicker.openPicker({
          width: 400,
          height: 300,
          cropping: true
        }).then(image => {
          this.setState({imagePath:image.path,upmodal:false})
          this.aniInImgUp()
        });
  }



  aniInImgUp(){
    Animated.timing(this.topUPimg, {
      toValue: -hp('20%'),
      delay:100,
      duration:700,
    }).start();

    Animated.timing(this.topClose, {
      toValue: hp('1%'),
      delay:100,
      duration:700,
    }).start();

    this.setState({backOpa:0.8})
  }



  aniOutImgUp(){
    Animated.timing(this.topUPimg, {
      toValue: hp('7%'),
      easing: Easing.out(Easing.circle),
      delay:100,
      duration:700,
    }).start();

    Animated.timing(this.topClose, {
      toValue: -hp('8%'),
      delay:100,
      duration:700,
    }).start();

    this.setState({backOpa:1})
  }


  animateTodefult(){
    Animated.timing(this.topPending, {
      toValue: -hp('15%'),
      //easing: Easing.out(Easing.circle),
      delay:100,
      duration:700,
    }).start();

    Animated.timing(this.topUPimg, {
      toValue: hp('7%'),
      easing: Easing.out(Easing.circle),
      delay:100,
      duration:700,
    }).start();

    this.setState({backOpa:1})
  }


  uploadImageToweb(){
    const { userid,imagePath,foodName,location,price,descrtip }  = this.state ;
    const parts = imagePath.split('/')

    if(this.state.imagePath === 'asset:/images/uploadImgBack.png' || this.state.foodName === '' || this.state.location === '' || this.state.price === '' || this.state.descrtip === ''){
        alert(stringsoflanguages.login.login_warn_1)
    }else{
            this.setState({isbtnpressed:true})
            Animated.timing(this.topPending, {
              toValue: hp('8%'),
              easing: Easing.out(Easing.circle),
              delay:100,
              duration:700,
            }).start();
            Animated.timing(this.topClose, {
              toValue: -hp('8%'),
              delay:100,
              duration:700,
            }).start();


            const sessionId = new Date().getTime();

            const formData = new FormData();
      formData.append('image', {
        uri: imagePath,
        name: parts[parts.length - 1],
        type: 'image/jpeg'
      });
      formData.append('Content-Type', 'image/jpeg');
      formData.append('userid', userid);
      formData.append('title', foodName);
      formData.append('location', location);
      formData.append('discount', price);
      formData.append('description', descrtip);

      fetch('https://prescrib.smartlogic.lk/php-api/uploadimg.php',{
          method: 'POST',
          headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJson) => {
           console.log(responseJson); 
           alert(stringsoflanguages.sellerHome.alert_1);
                         
           this.setState({foodName:'',location:'',price:'',descrtip:'',isbtnpressed:false})   
           this.animateTodefult()
           this.fetchContentData()
          })
          .catch((error) => {
              

              alert(stringsoflanguages.sellerHome.alert_2);
                         
              this.setState({foodName:'',location:'',price:'',descrtip:'',isbtnpressed:false})   
              this.animateTodefult()

            });
      

    }
    


  }


  clearImage(){
      this.setState({imagePath:this.state.imagePathTemp})
      this.aniOutImgUp()

      ImagePicker.clean().then(() => {
      }).catch(e => {
      });
  }



  submitBTN(){
    if(this.state.isbtnpressed){
      return(<View style={styles.uploadBtnInact}>
      <Text style={styles.submitTXT}>{stringsoflanguages.sellerHome.up_btn}</Text>
</View>)
    }else{
      return(<TouchableOpacity style={styles.uploadBtn} onPress={()=>this.uploadImageToweb()}>
      <Text style={styles.submitTXT}>{stringsoflanguages.sellerHome.up_btn}</Text>
</TouchableOpacity>)
    }
  }

 


  bttomBTM(){
    if(this.state.isKey){
      return(<View />)
    }else{
      return(<BottomTab color={'#61d887'}/>)
    }
  }


  _scrollToInput = (reactNode)=> {
   // this.scroll.props.scrollToFocusedInput(reactNode)
   let val = reactNode
   if(val > 255){
      val=250
   }
   this.scroller.scrollTo({ x: 0, y: val, animated: true });
  }


  loadingView(){
    if(this.state.isLoading){
      return(<View style={styles.LoadingView}>
      <View style={styles.loadPad1}>
           <Text style={[styles.loadinTXT,{marginTop:hp('13%')}]}>{stringsoflanguages.sellerHome.loading_full}</Text>    
       </View>

       <View style={styles.loadPad2}>
       <Text style={styles.loadinTXT}>{stringsoflanguages.sellerHome.loading_full}</Text>
         </View>           
      </View>)
    }else{
      return(<View/>)
    }
  }


  openPhoneCall(number){
    Linking.openURL(`tel:${number}`)
  }

  openImage(path){
    this.setState({imagePathViewer:path,ImageModal:true})

  }

  openCmnts(userNam,selid,cusid,Orid){
    this.setState({UserNameCmnt:userNam,orid:Orid})
    this.message.current.mainFunc(selid,cusid,Orid);
  }


  statusView(key,state,username,isDelivAccpt,phoneDeli,ratingDeli){
    if(state === "0"){
    return(<View style={styles.statusPad}>
<TouchableOpacity style={styles.accept} onPress={()=> this.pushNewOrderState1(key)}>
<Text style={styles.acptTXT}>Accept</Text>
<Text style={styles.acptTXT}>Order</Text>
</TouchableOpacity>

    </View>)
    }else if(state === "1"){
      return(<View style={styles.statusPad}>
        <View style={[styles.accept,{backgroundColor: '#ddd',}]} >
        
        <ActivityIndicator size="small"  color='#4c4c4c' style={{marginBottom:hp('2%')}}/>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>Waiting for</Text>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>Driver</Text>
        </View>
        
            </View>)
    }else if(state === "2" && isDelivAccpt === "0"){
      return(<View style={styles.statusPad}>
        <View style={[styles.accept2,{backgroundColor: '#fff',}]} >
        
        <Text style={[styles.acptTXT,{fontWeight:'bold',
          fontSize:hp('2.2%'),color:'#4c4c4c',marginTop:hp('1.5%')}]}>Driver</Text>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>{username}</Text>
                                                                                   <Rating
                                                                                    type='custom'
                                                                                    ratingCount={5}
                                                                                    startingValue={ratingDeli}
                                                                                    imageSize={hp('2.6%')}
                                                                                    showRating={false}
                                                                                    ratingColor="#fff293"
                                                                                    //onFinishRating={this.ratingCompleted}
                                                                                  />

                          <View style={styles.btmBtnPads}>
                            <TouchableOpacity style={styles.btmBtn1} onPress={()=> this.pushNewOrderState3(key)}>
                                <Text style={styles.btnState2Txt}>ACCEPT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btmBtn2} onPress={()=>this.openPhoneCall(phoneDeli)}>
                            <Text style={styles.btnState2Txt}>CALL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btmBtn3} onPress={()=>this.CancelOrder(key)}>
                            <Text style={styles.btnState2Txt}>DECLINE</Text>
                            </TouchableOpacity>
                          </View>
                        

        </View>
        
            </View>)
    }else if(state === "3"){
      return(<View style={styles.statusPad}>
        <View style={[styles.accept,{backgroundColor: '#ddd',}]} >
        
        <ActivityIndicator size="small"  color='#4c4c4c' style={{marginBottom:hp('2%')}}/>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>Driving</Text>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>to</Text>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>Destination</Text>
        </View>
        
            </View>)
    }else if(state === "4"){
      return(<View style={styles.statusPad}>
        <View style={[styles.accept,{backgroundColor: '#31e271',}]} >
        
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%')}]}>Delivery</Text>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%')}]}>Completed</Text>
        </View>
        
            </View>)
    }else if(isDelivAccpt === "false"){
      return(<View style={styles.statusPad}>
        <View style={[styles.accept,{backgroundColor: '#ddd',}]} >
        
        <ActivityIndicator size="small"  color='#4c4c4c' style={{marginBottom:hp('2%')}}/>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>Waiting for</Text>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>Driver</Text>
        <Text style={[styles.acptTXT,{fontSize:hp('2.1%'),color:'#4c4c4c'}]}>Confirm</Text>
        </View>
        
            </View>)
    }
  }



  CancelOrder(key){

    Alert.alert(
      'Confirm Selection !',
      'After Cancel your order. another delivery person can pickup',
      [
        {text: 'OK', onPress: () => 
              firebase.database().ref('delivery/new_orders/'+key).update({
                state:"1",
              }).then((data)=>{
                  
                alert('Order Updated !')
                //Keyboard.dismiss()
                
            
              }).catch((error)=>{
                alert(error)
            
              })
      },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );


    
  }



  pushNewOrderState1(key){

    Alert.alert(
      'Confirm Selection !',
      'After Confirmation your order is ready to deliver',
      [
        {text: 'OK', onPress: () => 
              firebase.database().ref('delivery/new_orders/'+key).update({
                state:"1",
              }).then((data)=>{
                  
                alert('Order Updated !')
                //Keyboard.dismiss()
                
            
              }).catch((error)=>{
                alert(error)
            
              })
      },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );


    
  }



  pushNewOrderState3(key){

    Alert.alert(
      'Confirm Selection !',
      '',
      [
        {text: 'OK', onPress: () => 
              firebase.database().ref('delivery/new_orders/'+key).update({
                isAccept:"true",
                isDelivAccpt:"false"
              }).then((data)=>{
                  
                alert('Order Updated !')
                //Keyboard.dismiss()
                
            
              }).catch((error)=>{
                alert(error)
            
              })
      },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );


    
  }



  
    
    render() {
      let translateY = this.state.scrollY.interpolate({
        inputRange: [0, hp('9%')],
        outputRange: [0, -hp('10%')],
        extrapolate: 'clamp',
      });

      let translateOpa = this.state.scrollY.interpolate({
        inputRange: [0, hp('5%')],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      const  gradientHeight=parseInt(hp('30%'));
      const gradientBackground  = '#1ebab9';
        const data = Array.from({ length: gradientHeight });

      return (
       <View style={styles.container}>
  
       <StatusBar
     backgroundColor="#1ebab9"
     barStyle="light-content"
     translucent={false}
   />

  
                                 

                                    <ScrollView
                                    //keyboardShouldPersistTaps='always'
                                    enableAutomaticScroll={true}
                                    ref={(scroller) => {this.scroller = scroller}}
                                    contentContainerStyle={{flexGrow:1, alignItems : 'center',marginTop:hp('20%'),paddingBottom:(hp('38%'))}}
                                    scrollEventThrottle={16}
                                    onScroll={Animated.event(
                                      [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                                    )}
                                    
                                    >
            
                                     
                                                       
  
                                                            <View style={[styles.middletxt1,{marginTop:hp('2.2%')}]}>
                                                                    <View style={styles.middletxtPad1}>
                                                                    <Text style={styles.txtFood}>{stringsoflanguages.sellerHome.title_1}</Text>
                                                                        </View>

                                                                        <View style={styles.middletxtPad2}>
                                                                        <Icon name="home" style={styles.iconbtm} />
                                                                            </View>

                                                                </View>
  
                                                <View style={[styles.listPad,{height:hp('80%')}]}>
  
                                                         <BoxShadow setting={shadowStyle3scrll}>
                                                         <View style={[styles.listRow1,{width:deviceWidth/1.1}]}>
                                                                <View style={styles.upPad}>

                                                                   <ImageBackground style={[styles.upPad1,{opacity:this.state.backOpa}]} source={{uri : this.state.imagePath}}>
                                                                        <Animated.View style={[styles.imagePAD,{top:this.topUPimg}]}>
                                                                        <BoxShadow setting={imagePick}>
                                                                        <TouchableOpacity style={styles.pickphotoPad} onPress={() => this.imageUpload() }>
                                                                          
                                                                        <LottieView
                                                                          autoPlay={true}
                                                                          loop = {false}
                                                                          style={{height:hp('30%'),opacity:0.85}}
                                                                                  source={require('../../src/anim/camera.json')}
                                                                              />

                                                                            </TouchableOpacity>
                                                                            </BoxShadow>

                                                                            <Text style={styles.uptxt}>
                                                                            {this.state.imagePath !== 'asset:/images/uploadImgBack.png' ? '' : stringsoflanguages.sellerHome.img_up_txt}
                                                                            </Text>

                                                                          </Animated.View>

                                                                              <Animated.View style={[styles.closePAD,{top:this.topClose}]}>
                                                                                    <TouchableOpacity style={styles.closeBtn} onPress={()=> this.clearImage() }>
                                                                                        <Icon name='ios-close-circle' style={{fontSize:hp('6%'),color:'#fd8469'}} />
                                                                                      </TouchableOpacity>
                                                                              </Animated.View>


                                                                               <Animated.View style={[styles.pendingPAD,{top:this.topPending}]}>
                                                                                    <View style={styles.pendingActi} >
                                                                                       <ActivityIndicator size="large"  color='#61d887'/>
                                                                                      </View>
                                                                              </Animated.View>
                                                                        </ImageBackground>

                                                                                <View style={styles.upPad2}>

                                                                                        <View style={[styles.mainV,{marginTop:hp('2.5%')}]}>
                                                                                            <SimpleAnimation
                                                                                            delay={100}
                                                                                            duration={1000}
                                                                                            fade
                                                                                            direction="right"
                                                                                            distance={100}
                                                                                            movementType="slide"
                                                                                            style={styles.iconV}
                                                                                            >
                                                                                                    
                                                                                                                <Icon name ='ios-apps' style={styles.iconSty}/>
                                                                                                        </SimpleAnimation>


                                                                                                        <View style={styles.textV}>
                                                                                                                                <TextInput
                                                                                                                                onFocus={(event) => {
                                                                                                                                  this._scrollToInput(findNodeHandle(event.target))
                                                                                                                                }}

                                                                                                                            placeholder={this.state.titlePlaceholder}
                                                                                                                            placeholderTextColor="#ffbaaa"
                                                                                                                            style={styles.input}
                                                                                                                            value={this.state.foodName}
                                                                                                                            autoCorrect={false}
                                                                                                                            maxLength={20}
                                                                                                                            autoCapitalize="none"
                                                                                                                            onChangeText={foodName => this.setState({ foodName })}
                                                                                                                        />
                                                                                                            </View>
                                                                                                </View>








                                                                                                 <View style={styles.mainV}>
                                                                                            <SimpleAnimation
                                                                                            delay={300}
                                                                                            duration={1000}
                                                                                            fade
                                                                                            direction="right"
                                                                                            distance={100}
                                                                                            movementType="slide"
                                                                                            style={styles.iconV}
                                                                                            >
                                                                                                    
                                                                                                                <Icon name ='ios-pin' style={styles.iconSty}/>
                                                                                            </SimpleAnimation>


                                                                                                        <View style={styles.textV}>
                                                                                                                                <TextInput
                                                                                                                                    onFocus={(event) => {
                                                                                                                                      this._scrollToInput(findNodeHandle(event.target))
                                                                                                                                    }}
                                                                                                                            placeholder={this.state.locationPlaceholder}
                                                                                                                            placeholderTextColor="#ffbaaa"
                                                                                                                            style={styles.input}
                                                                                                                            value={this.state.location}
                                                                                                                            autoCorrect={false}
                                                                                                                            autoCapitalize="none"
                                                                                                                            onChangeText={location => this.setState({ location })}
                                                                                                                        />
                                                                                                            </View>
                                                                                                </View>






                                                                                                 <View style={styles.mainV}>
                                                                                            <SimpleAnimation
                                                                                            delay={500}
                                                                                            duration={1000}
                                                                                            fade
                                                                                            direction="right"
                                                                                            distance={100}
                                                                                            movementType="slide"
                                                                                            style={styles.iconV}
                                                                                            >
                                                                                                    
                                                                                                                <Icon name ='ios-pricetag' style={styles.iconSty}/>
                                                                                                        </SimpleAnimation>


                                                                                                        <View style={styles.textV}>
                                                                                                                                <TextInput
                                                                                                                                    onFocus={(event) => {
                                                                                                                                      this._scrollToInput(findNodeHandle(event.target))
                                                                                                                                    }}
                                                                                                                            placeholder={this.state.discountsPlaceholder}
                                                                                                                            placeholderTextColor="#ffbaaa"
                                                                                                                            style={styles.input}
                                                                                                                            value={this.state.price}
                                                                                                                            maxLength={30}
                                                                                                                            autoCorrect={false}
                                                                                                                            autoCapitalize="none"
                                                                                                                            onChangeText={price => this.setState({ price })}
                                                                                                                        />
                                                                                                            </View>
                                                                                                </View>




                                                                                            <View style={styles.mainV}>
                                                                                            <SimpleAnimation
                                                                                            delay={500}
                                                                                            duration={1000}
                                                                                            fade
                                                                                            direction="right"
                                                                                            distance={100}
                                                                                            movementType="slide"
                                                                                            style={styles.iconV}
                                                                                            >
                                                                                                    
                                                                                                                <Icon name ='ios-filing' style={styles.iconSty}/>
                                                                                                        </SimpleAnimation>


                                                                                                        <View style={styles.textV}>
                                                                                                                                <TextInput
                                                                                                                                    onFocus={(event) => {
                                                                                                                                      this._scrollToInput(findNodeHandle(event.target))
                                                                                                                                    }}
                                                                                                                            placeholder={this.state.discriptionPlaceholder}
                                                                                                                            placeholderTextColor="#ffbaaa"
                                                                                                                            style={styles.inputDescript}
                                                                                                                            value={this.state.descrtip}
                                                                                                                            maxLength={85}
                                                                                                                            autoCorrect={false}
                                                                                                                            multiline={true}
                                                                                                                            autoCapitalize="none"
                                                                                                                            onChangeText={descrtip => this.setState({ descrtip })}
                                                                                                                        />
                                                                                                            </View>
                                                                                                </View>



                                                                                
                                                                                </View>

                                                                    </View>

                                                         </View>

                                                            <View style={styles.uploadBtnPad}>

                                                                        {this.submitBTN()}

                                                                </View>


                                                           </BoxShadow>
                            
                                                    </View>














                                                    <View style={styles.middletxt}>
                                                                    <View style={styles.middletxtPad1}>
                                                                    <Text style={styles.txtFood}>{stringsoflanguages.sellerHome.title_2}</Text>
                                                                        </View>

                                                                        <View style={styles.middletxtPad2}>
                                                                        <Icon name="ios-pizza" style={styles.iconbtm} />
                                                                            </View>

                                                                </View>
                                                           


                                                           <FlatList 
                                                        
                                                                data={this.state.newOrders}

                                                                keyExtractor={(item, index) => item.key}

                                                                ListEmptyComponent={this.emptymsgFun()}

                                                                contentContainerStyle={{marginBottom:hp('5%'), marginLeft:wp('2%'),paddingRight:wp('5%')}}

                                                                horizontal={true}

                                                                renderItem={({ item, index }) =>

                                                                        <View style={[styles.listPad,{marginRight:wp('3%')}]}>

                                                                                <BoxShadow setting={shadowStyle3}>
                                                                                        <TouchableOpacity style={styles.listRow1} onPress={()=> this.openImage(item.pres_img_url)}>
                                                                                        <ImageBackground style={styles.backImg} source={{uri : item.pres_img_url}}>


                                                                                        <TouchableOpacity style={styles.buttonBtm} >
                                                                                                  <View style={styles.buttonBtmPad}>
                                                                                                  <Text style={styles.btnTXT}>{item.username}</Text>
                                                                                                  <Text style={styles.btnTXT2}>{item.phone}</Text>
                                                                                                  </View>
                                                                                          </TouchableOpacity>
                                                                                        </ImageBackground>

                                                                                                                                      

                                                                                        
                                                                                    <ImageBackground
                                                                                        style={{
                                                                                            position: 'absolute',
                                                                                            width:'100%',
                                                                                            height:'100%',
                                                                                         bottom:0,
                                                                                        }}
                                                                                        source={GrandBlue}
                                                                                    />

                                                                                    

                                                                                            
                                                                                        </TouchableOpacity>
                                                                                        

                                                                                        <View style={styles.btmOrdersBtn}  >
                                                                                                <View style={styles.btmOrdersBtnView}>
                                                                                                      <TouchableOpacity style={styles.rawView} onPress={()=> this.openCmnts(item.username,item.seller_id,item.customer_id,item.ord_id)}>
                                                                                                          <Image source={Comment} style={styles.btmIcon} />
                                                                                                      </TouchableOpacity>

                                                                                                            <View style={styles.rawViewMiddle}>
                                                                                                            <Image source={Line} style={styles.lineImg} />
                                                                                                            </View>

                                                                                                      <TouchableOpacity style={styles.rawView} onPress={()=> this.openPhoneCall(item.phone)}>
                                                                                                      <Image source={Phone} style={styles.btmIcon} />
                                                                                                      </TouchableOpacity>

                                                                                                  </View>
                                                                                            </View>      
                                                                                
                                                                                <View style={styles.newOrderBtnPad} >
                                                                                          <TouchableOpacity style={styles.newOrderBtnPadView} onPress={()=>this.pushToOngoingOrders(item)}>
                                                                                          <Text style={styles.acptTXT}>Accept</Text>
                                                                                          <Text style={styles.acptTXT}>Order</Text>
                                                                                          </TouchableOpacity>
                                                                                </View>


                                                                                </BoxShadow>

                                                                                                             
                                                                                                                
                                                                                                            
                                                                            </View>



                                                            }
                                                            refreshing={this.state.refreshing}
                                                            onRefresh={() => this.handleRefresh()}
                                                            />














                                                                <View style={styles.middletxt}>
                                                                    <View style={styles.middletxtPad1}>
                                                                    <Text style={styles.txtFood}>{stringsoflanguages.sellerHome.title_3}</Text>
                                                                        </View>

                                                                        <View style={styles.middletxtPad2}>
                                                                        <Icon name="ios-pizza" style={styles.iconbtm} />
                                                                            </View>

                                                                </View>
                                                           


                                                           <FlatList 
                                                        
                                                                data={this.state.foodData}

                                                                keyExtractor={(item, index) => item.key}

                                                                ListEmptyComponent={this.emptymsgFun()}

                                                                contentContainerStyle={{marginLeft:wp('2%'),paddingRight:wp('5%')}}

                                                                horizontal={true}

                                                                renderItem={({ item, index }) =>

                                                                        <View style={[styles.listPad,{marginRight:wp('3%')}]}>

                                                                                <BoxShadow setting={shadowStyle3}>
                                                                                        <TouchableOpacity style={styles.listRow1} onPress={()=> this.openImage(item.pres_img_url)}>
                                                                                        <ImageBackground style={styles.backImg} source={{uri : item.pres_img_url}}>


                                                                                        <TouchableOpacity style={styles.buttonBtm} >
                                                                                                  <View style={styles.buttonBtmPad}>
                                                                                                  <Text style={styles.btnTXT}>{item.username}</Text>
                                                                                                  <Text style={styles.btnTXT2}>{item.phone}</Text>
                                                                                                  </View>
                                                                                          </TouchableOpacity>
                                                                                        </ImageBackground>

                                                                                                                                      

                                                                                        
                                                                                    <ImageBackground
                                                                                        style={{
                                                                                            position: 'absolute',
                                                                                            width:'100%',
                                                                                            height:'100%',
                                                                                         bottom:0,
                                                                                        }}
                                                                                        source={GrandBlue}
                                                                                    />

                                                                                    

                                                                                            
                                                                                        </TouchableOpacity>
                                                                                        

                                                                                        <View style={styles.btmOrdersBtn}  >
                                                                                                <View style={styles.btmOrdersBtnView}>
                                                                                                      <TouchableOpacity style={styles.rawView} onPress={()=> this.openCmnts(item.username,item.seller_id,item.customer_id,item.ord_id)}>
                                                                                                          <Image source={Comment} style={styles.btmIcon} />
                                                                                                      </TouchableOpacity>

                                                                                                            <View style={styles.rawViewMiddle}>
                                                                                                            <Image source={Line} style={styles.lineImg} />
                                                                                                            </View>

                                                                                                      <TouchableOpacity style={styles.rawView} onPress={()=> this.openPhoneCall(item.phone)}>
                                                                                                      <Image source={Phone} style={styles.btmIcon} />
                                                                                                      </TouchableOpacity>

                                                                                                  </View>
                                                                                            </View>      
                                                                                
                                                                                {this.statusView(item.key,item.state,item.usernameDeli,
                                                                                  item.isDelivAccpt,item.phoneDeli,item.ratingDeli)}

                                                                                </BoxShadow>

                                                                                                             
                                                                                                                
                                                                                                            
                                                                            </View>



                                                            }
                                                            refreshing={this.state.refreshing}
                                                            onRefresh={() => this.handleRefresh()}
                                                            />
  
                                           </ScrollView>

                                                      {this.loadingView()}  

                                                      {this.header(translateY,translateOpa)}
                                                          <View style={styles.header} >
                                                                                <Image
                                                                                      style={styles.logo}
                                                                                  source={require('../../src/img/logo.png')}
                                                                                  /> 
                                    
                                                                      <TouchableOpacity style={styles.hamberPad} onPress={() => this.toggleDrawer() }>
                                                                                  <LottieView
                                                                                  ref={animation => {
                                                                                    this.animation = animation;
                                                                                  }}
                                                                                  autoPlay={false}
                                                                                  loop = {false}
                                                                                  style={{height:deviceHeight/3,}}
                                                                                          source={require('../../src/anim/menu.json')}
                                                                                      />
                                                                          </TouchableOpacity>

                                                                          <TouchableOpacity style={styles.searchPad} >
                                                                                  <Icon name="ios-search" style={{color:'#fff',fontSize:hp('4.5%')}}/>
                                                                          </TouchableOpacity>
                                                              </View>

                                                         
                                                                          
    <BottomTab _this={this} color={'#61d887'} screen={this.state.statHeight} where={'seller'}/>

        <CmtModal visible={this.state.cmtModal} _this ={this}  userName = {this.state.UserNameCmnt} CurrentUserName={this.state.userName}
        orid={this.state.orid} cusid={this.state.cusid} selid={this.state.selid} ProimagePath={this.state.ProimagePath}
        ref={this.message} screen={'buyer'}/>    

      <ImageModal visible={this.state.ImageModal} _this ={this}  imagePath={this.state.imagePathViewer}/>                                                                          
     <Drawer _this={this} isOpen={this.state.isOpen} ProimagePath={this.state.ProimagePath}  isProLoad={this.state.isProLoad} userName={this.state.userName} ref={this.drawer} screen={'seller'} loginTXT={this.state.loginTXT}/>
     <ImgUpModal visible={this.state.upmodal} _this ={this}  openPickerCam={this.openPickerCam} openPickerLib={this.openPickerLib}/>                                                      
    
     </View>
      )
    }
  }
  
  
  const styles = StyleSheet.create({
    container: {
      height:deviceHeight,
      width:deviceWidth,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
   
    header:{
        position:'absolute',
        height:deviceHeight/10,
        width:'100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#1ebab9',
  
    },
    headerTXT:{
      fontFamily: "Brush",
        fontSize:deviceHeight/31,
        color:'#fff',
        marginLeft: deviceWidth/10,
        marginBottom:-hp('1%')
    },
    logoPad:{
        position:'absolute',
        left:deviceWidth/15
    },
    logoView:{
        borderBottomLeftRadius: deviceHeight/40,
        borderBottomRightRadius: deviceHeight/40,
        backgroundColor:'#fa7181',
        
    },
    logo:{
      height:hp('5%'),
      borderRadius:hp('2%'),
        resizeMode: 'contain',
    },
  
    hamberPad:{
        position:'absolute',
       left:wp('1%'),
        height:hp('10%'),
        width:hp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchPad:{
      position:'absolute',
     right:wp('1%'),
      height:hp('10%'),
      width:hp('10%'),
      justifyContent: 'center',
      alignItems: 'center',
  },


    listPad:{
        height:hp('60%'),
       marginBottom:hp('4%'),
       
    },
    listRow1:{
        width:deviceWidth/1.5,
        height:'100%',
        backgroundColor:'#fff',
        borderRadius:deviceHeight/25,
        alignItems: 'center',
        overflow: 'hidden',
    },
    listRow2:{
        width:deviceWidth/3,
        height:'100%',
        justifyContent: 'center',
       alignItems: 'center',
    },

    backTXT:{
      flex:1,
      width:'100%',
      height:'100%',
      justifyContent: 'flex-end',
    },
  
    txtPad:{
      flexDirection:'row',
      height:hp('20%'),
      width:'100%',
      
    },

    txtPad1:{
        flex:0.7,
        height:hp('20%'),
        width:'100%',
        padding: hp('2%'),
        justifyContent: 'center',
    },

    txtPad2:{
      flex:0.3,
      width:'100%',
      height:hp('20%'),
      justifyContent: 'center',
     
    },
  
  
  
    addBtnWhite:{
      position:'absolute',
      width:'100%',
      height:'100%',
      justifyContent: 'center',
      left:wp('3%')
    },
    addBtnWhiteBB:{
      width:hp('8%'),
      height:hp('8%'),
      borderRadius:hp('16%'),
      backgroundColor:'#fff'
    }
  ,
  btmnav:{
    position:'absolute',
    bottom:0,
    
  },

  btmnavView:{
    width:wp('100%'),
    height:hp('19%')
  },


  backImg:{
    width:'100%',
    height:'100%',
    alignItems: 'center',
  },

  backgra:{
    position:'absolute',
    bottom:0,
    width:'100%',
    height:'100%'
  },

  txtbtm1:{
    fontFamily:'WorkSans-Light',
    color:'#fff',
    fontSize:hp('3%'),

  },

  txtbtm2:{
    fontFamily:'WorkSans-Light',
    color:'#fff',
    fontSize:hp('2%')
  },
  txtprice1:{
    fontSize:hp('2%'),
    color:'#fff',
    marginLeft: wp('6%'),
  },

  txtprice:{
    fontSize:hp('3%'),
    color:'#fff',
    marginLeft: wp('6%'),
  },


  bubbles:{
    position: "absolute",
    width:deviceWidth,
    height:hp('9%'),
    top:deviceHeight/10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20c9c8',
  },

  bubblesPad:{
    paddingHorizontal: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    height:hp('7%'),
    width:wp('22%'),
    borderColor: '#fff',
    borderRadius:hp('3.5%'),
    borderWidth:1,
    marginHorizontal:wp('1.2%'),
    marginTop:hp('1%')
  },

  txtBubble:{
    fontSize:hp('1.5%'),color:'#fff',
    textAlign:'center'
  },

  pricepp:{
    backgroundColor:'#fd8469',
    borderBottomLeftRadius:hp('10%'),
    borderTopLeftRadius:hp('10%'),
    paddingVertical: hp('1%'),
  },

  txtFood:{
      fontSize:hp('5%'),
      color:'rgba(32, 201, 200, 0.77)',
     marginLeft:wp('6%'),
     fontFamily:'WorkSans-ExtraLight'
  },

  middletxt1:{
    flexDirection: 'row',
    width:wp('100%'),
    marginBottom: hp('1%'),
},


  middletxt:{
      flexDirection: 'row',
      width:wp('100%'),
      marginBottom: -hp('1%'),
  },



  middletxtPad1:{
    width:wp('80%')
  },

  middletxtPad2:{
    width:wp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconbtm:{
      fontSize:hp('4.5%'),
      color:'rgba(32, 201, 200, 0.77)'
  },


  upPad:{
      height:'100%',
      width:'100%',
  },

  upPad1:{
    height:hp('30%'),
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  upPad2:{
    height:hp('30%'),
    width:'100%',
    alignItems: 'center',
  },

  pickphotoPad:{
      height:hp('15%'),
      width:wp('40%'),
      borderRadius:hp('5%'),
      backgroundColor:'#fff',
      justifyContent: 'center',
      alignItems:'center',

  },

  uptxt:{
      fontSize:hp('3%'),
      color:'#ddd',
      textAlign:'center',
      marginTop: hp('1%'),
      fontFamily:'WorkSans-Light'
  },


  mainV:{
    flexDirection:'row',
    width:wp('80%'),
    marginBottom: hp('2%'),
},

iconV:{
    flex:0.15,
    justifyContent: 'center',
    alignItems: 'center',
},
textV:{
    flex:0.85,
    justifyContent: 'center',
},


iconSty:{
    color:'rgba(32, 201, 200, 0.70)',
    fontSize:hp('4%')
},

input: {
    height: hp('6%'),
    width:'90%',
    textAlign:'center',
    color:'#aaa',
    fontSize:hp('1.7%'),
    borderRadius:hp('3%'),
   
    borderWidth: 1,
    borderColor: 'rgba(32, 201, 200, 0.70)',

    
  },

  inputDescript:{
    height: hp('10%'),
    width:'90%',
    textAlign:'center',
    color:'#aaa',
    fontSize:hp('1.7%'),
    borderRadius:hp('4%'),
   
    borderWidth: 1,
    borderColor: 'rgba(32, 201, 200, 0.70)',
  },

  uploadBtnPad:{
    position:'absolute',
    bottom:hp('2.5%'),
    width:'100%',
    alignItems: 'center',
    borderRadius:deviceHeight/25,
  },

  uploadBtn:{
    width:'80%',
    height:hp('7%'),
    backgroundColor: 'rgba(253, 132, 105, 0.82)',
    borderRadius:hp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },


  uploadBtnInact:{
    width:'80%',
    height:hp('7%'),
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    borderRadius:hp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },


  submitTXT:{
      color:'#fff',
      fontWeight:'bold',
      fontSize:hp('2.3%'),
      fontFamily:'WorkSans-ExtraLight'
  },

  imagePAD:{
    position:'absolute',
  },


  closePAD:{
    position:'absolute',
    right:wp('2%')
  },

  closeBtn:{
    height:hp('7%'),
    width:hp('7%'),
    borderRadius:hp('14%'),
    backgroundColor:'#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },


  pendingPAD:{
    position:'absolute',
  },
  pendingActi:{
    height:hp('12%'),
    width:hp('12%'),
    borderRadius:hp('14%'),
    backgroundColor:'#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyListPAD:{
    height:deviceHeight/1.7,
    width:wp('100%'),
    justifyContent:'center',
    alignItems:'center',
  },

  emBOX:{
    borderWidth:1,
    borderColor: '#ddd',
    paddingHorizontal:wp('10%'),
    paddingVertical:hp('20%'),
    borderRadius:5,
    alignItems: 'center',
  },

  emptyTXT:{
    //fontWeight:'bold',
    fontSize:hp('2.5%'),
    color:'#898989',
    fontFamily:'WorkSans-Light'
  },

  EmtyIco:{
    marginTop: hp('1%'),
    fontSize:hp('5%'),
    color:'#ddd'
  },

  LoadingView:{
    height:hp('100%'),
    width:'100%',
    marginHorizontal:wp('2%'),
    backgroundColor:'#fff'
  },

  loadPad1:{
    height:hp('45%'),
    width:'100%',
    backgroundColor:'#e0fffe',
    marginBottom:hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadPad2:{
    height:hp('45%'),
    backgroundColor:'#e0fffe',
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadinTXT:{
    color:'#c1c1c1',
    fontSize:hp('3%')
  },


  buttonBtm:{
    position:'absolute',
    top:0,
    //width:'100%',
    //right:0
  },
  buttonBtmPad:{
    height:hp('13%'),
    width:deviceWidth/2,
    borderBottomLeftRadius: hp('5%'),
    borderBottomRightRadius: hp('5%'),
    backgroundColor:'#1ebab9',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor:'#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnTXT:{
    fontSize:hp('3.5%'),
    color:'#fff',
    //fontFamily:'WorkSans-Light'
  },

  btnTXT2:{
    fontSize:hp('3%'),
    fontFamily:'WorkSans-Light',
    color:'#fff'
  },

  btmOrdersBtn:{
    position:'absolute',
    width:'100%',
    bottom:0,

  },

  btmOrdersBtnView:{
    height:hp('15%'),
    width:'100%',
    justifyContent: 'center',
    alignItems:'center',
    flexDirection:'row',

    
  },

  rawView:{
    height:'100%',
    width:'45%',
    justifyContent: 'center',
    alignItems: 'center',

  },

  rawViewMiddle:{
    height:'100%',
    width:'10%',
    justifyContent: 'center',
    alignItems:'center',
  },

  btmIcon:{
    width:wp('10%'),
    resizeMode: 'contain',
  },

  lineImg:{
    width:'25%',
    resizeMode: 'contain',
  },

  statusPad:{
    position:'absolute',
  },

  accept:{
    height:hp('20%'),
    width:hp('20%'),
    borderBottomLeftRadius:hp('5%'),
    borderTopRightRadius:hp('5%'),
    borderWidth:3,
    borderColor:'#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(32, 201, 200, 0.77)'
  },

  acptTXT:{
    fontSize:hp('3.2%'),
    color:'#fff'
  },

  btmBtnPads:{
    position:'absolute',
    bottom:0,
    alignItems: 'center',
  },

  btmBtn1:{
    height:hp('5%'),
    marginBottom:hp('1%'),
    borderRadius:hp('2.5%'),
    width:'80%',
    justifyContent: 'center',
    alignItems: 'center',
   backgroundColor: '#4bc14d',

  },
  btmBtn2:{
    height:hp('5%'),
    marginBottom:hp('1%'),
    borderRadius:hp('2.5%'),
    width:'80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1ebab9',
  },
  btmBtn3:{
    height:hp('5%'),
    width:hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e24331',
  },

  accept2:{
    height:hp('30%'),
    width:hp('20%'),
    overflow:'hidden',
    borderBottomLeftRadius:hp('5%'),
    borderTopRightRadius:hp('5%'),
    borderWidth:2,
    borderColor:'#1ebab9',
    alignItems: 'center',
  },

  btnState2Txt:{

    color:'#fff',
    fontSize:hp('1.8%'),


  },


  newOrderBtnPad:{
    position:'absolute',
  },

  newOrderBtnPadView:{
    height:hp('20%'),
    width:hp('20%'),
    borderBottomLeftRadius:hp('5%'),
    borderTopRightRadius:hp('5%'),
    borderWidth:3,
    borderColor:'#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(32, 201, 200, 0.77)'
  }




  
  })
  
  
  export default withNavigationFocus(SellerHome);