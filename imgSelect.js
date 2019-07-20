import * as React from 'react';
import {StatusBar, Text, View, StyleSheet,Dimensions,TouchableOpacity,Image,AsyncStorage,ScrollView,FlatList,ImageBackground,TextInput,Keyboard,LayoutAnimation,UIManager } from 'react-native';

import Modal from "react-native-modal";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width



export default class ImgUpModal extends React.Component {

  constructor(props) {

    super(props);

    this.state={
        user_input:''
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


close(){
    this.props._this.setState({ imgSelect: false })
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

                        <TouchableOpacity style={styles.up_btn}>
                        <Text style={styles.send_txt}>Send</Text>
                        </TouchableOpacity>
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
