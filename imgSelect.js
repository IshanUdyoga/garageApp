import * as React from 'react';
import {StatusBar,ActivityIndicator, Text, View, StyleSheet,Dimensions,TouchableOpacity,Image,AsyncStorage,ScrollView,FlatList,ImageBackground,TextInput,Keyboard,LayoutAnimation,UIManager } from 'react-native';

import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import * as firebase from 'react-native-firebase';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width
let today = new Date();
            let time = new Date();

            let TimeType, hour, minutes, seconds, fullTime;

            let dd = today.getDate();
            let mm = today.getMonth()+1; 
            let yyyy = today.getFullYear();


export default class ImgUpModal extends React.Component {

  constructor(props) {

    super(props);

    this.state={
        user_input:'',
        isbtnpressed:false
    }
}


    componentDidMount () {


    }

  componentWillMount(){
 
  }


openPicker(val){
    if(val === 1){
            this.props.openPickerCam()
    }else{
        this.props.openPickerLib()
    }
}


getTime(){

    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 

         today = new Date();
         time = new Date();

         dd = today.getDate();
         mm = today.getMonth()+1; 
         yyyy = today.getFullYear();

        if(dd<10) 
        {
            dd='0'+dd;
        } 
        
        if(mm<10) 
        {
            mm='0'+mm;
        } 

        today = yyyy+'.'+mm+'.'+dd;



hour = time.getHours(); 

if(hour <= 11)
{

TimeType = 'AM';

}
else{

TimeType = 'PM';

}


if( hour > 12 )
{
hour = hour - 12;
}

if( hour == 0 )
{
hour = 12;
} 


minutes = time.getMinutes();

if(minutes < 10)
{
minutes = '0' + minutes.toString();
}


seconds = time.getSeconds();

if(seconds < 10)
{
seconds = '0' + seconds.toString();
}


fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();


        // this.setState({
        //     date : today,
        //     time:fullTime

       
    return(fullTime)
  }


uploadImageToweb(){
    const { currentUser } = firebase.auth()

    if(this.props.imagePath === 'asset:/images/img_icons/blank_camera.png' || this.state.user_input === ''){
        alert('Please Enter Your Details !')
    }else{
            this.setState({isbtnpressed:true})
          

        const sessionId = new Date().getTime();
        firebase
        .storage()
        .ref(`/images/${sessionId}.jpg`)
        .putFile(this.props.imagePath
      ).then((suc) => {
            

                                  firebase.database().ref('users/'+currentUser.uid+'/my_requests').push({
                                    img_url:suc.downloadURL,
                                    question:this.state.user_input,
                                }).then((data)=>{
                                      firebase.database().ref('all_requests').push({
                                        img_url:suc.downloadURL,
                                        question:this.state.user_input,
                                        user_id:currentUser.uid,
                                        user_name:this.props.user_name,
                                        time:this.getTime()
                                        })
                                    //this.fetchData()
                                    alert('Your Request Sent Succesfully !')
                                    this.clearImage()  
                                    this.setState({user_input:'',isbtnpressed:false})

                                }).catch((error)=>{
                                  alert(error)
                                  this.clearImage()
                                  this.setState({user_input:'',isbtnpressed:false})
                                })

                                            
            
          })
          .catch((error) => {
            this.clearImage()
            this.setState({user_input:'',isbtnpressed:false})
            alert(error);
     
          }) 
       

    }
    


  }


  clearImage(){
    this.props._this.setState({imagePath:'asset:/images/img_icons/blank_camera.png'})  

    ImagePicker.clean().then(() => {
    }).catch(e => {
    });
}


close(){
    this.props._this.setState({ imgSelect: false })
}


submitBTN(){
    if(this.state.isbtnpressed){
      return(<View style={styles.up_btn}>
      <ActivityIndicator size="small" color="#fff" />
</View>)
    }else{
      return(<TouchableOpacity style={styles.up_btn} onPress={()=>this.uploadImageToweb()}>
      <Text style={styles.send_txt}>Send</Text>
</TouchableOpacity>)
    }
  }


  render() {
    return (
        <Modal isVisible={this.props.visible} avoidKeyboard={true}  onBackdropPress= {() =>this.props._this.setState({ imgSelect: false })}  >
          <StatusBar
     backgroundColor="rgba(0, 0, 0, 20)"
     barStyle="light-content"
     translucent={false}
   />
        <View style={styles.container} >
                <View style={styles.con_sec_1}>
                        <TouchableOpacity style={styles.imageCon} onPress={()=>this.props.openImageUpModel()}>
                                             <Image
                                                style={styles.selected_image}
                                                source={{uri : this.props.imagePath}}
                                            />
                                            <Text style={styles.select_txt}>Select an Image</Text>

                            </TouchableOpacity>
                </View>

                <View style={styles.con_sec_2}>
                        <View style={styles.inp_con}>
                            <TextInput
                                        style={styles.inputCus}
                                        onChangeText={(user_input) => this.setState({user_input}) }
                                        multiline={true}
                                        placeholder='Enter Item Description !'
                                        //value={this.state.sum_insured.toString()}
                                                    
                            />
                        </View>

                        {this.submitBTN()}
                </View>
         
        </View>
      
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'flex-end' ,
    backgroundColor: '#fff',
    height:'100%'
  },
 

pad:{
    height:hp('20%'),
    width:deviceWidth/1.1,
    backgroundColor:'#fff',
    borderRadius: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
},

pad2:{
    height:hp('8%'),
    width:deviceWidth/1.1,
    backgroundColor:'#fff',
    borderRadius: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
},

fontTT:{
    color:'#4dcbf9',
    fontSize: hp('3%'),
},

btnPad:{
    height:hp('10%'),
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
},
ttBtn:{
    height:'100%',
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
},
con_sec_1:{
    flex:0.4,
    width:'100%',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
},
con_sec_2:{
    flex:0.6,
    width:'100%'
},

inp_con:{
    flex:0.8,
    width:'100%',
    padding:hp('2%')
},

up_btn:{
    flex:0.2,
    width:'100%',
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',

},

imageCon:{
    alignItems: 'center',
},

selected_image:{
    width:wp('50%'),
    height:'80%',
    opacity:0.5
},
select_txt:{
    fontSize:hp('2.5%')
},

send_txt:{
    fontSize:hp('2.5%'),
    color:'#fff'
},

inputCus:{
    width:'100%',
    height:'100%',
    borderWidth:1,
    borderRadius:hp('2%')
}



});
