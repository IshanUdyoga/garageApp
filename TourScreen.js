import React, {Component} from 'react';
import { AsyncStorage,StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, TextInput,ScrollView,ImageBackground,Dimensions,KeyboardAvoidingView,FlatList,Alert,BackHandler} from 'react-native';
import { Button, Footer, FooterTab, Item, Icon, Input, Form, Label, Thumbnail,Body,ListItem,List,Radio} from 'native-base';
import DatePicker from 'react-native-datepicker';
import Checkbox from 'react-native-custom-checkbox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import _ from 'underscore';
//import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Toast, {DURATION} from 'react-native-easy-toast'
import FlatListData from '../screen/FlatListData';
import Swipeout from 'react-native-swipeout';
//import RestaurantMenu from '../screen/restaurantMenu';
//import Toast from 'react-native-simple-toast';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width
let carsSize = deviceWidth/6


var radio_props = [
    {label: 'param1', value: 0 },
    {label: 'param2', value: 1 }
  ];






class FlatListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeRowKey: null
        };
    }
      render(){
          const swipeSetting = {
              autoclose: true,
              onClose: (secId,rowId,direction) => {
                if(this.state.activeRowKey != null){
                    this.setState({ activeRowKey: null });
                }
              },
              onOpen:(secId,rowId,direction) => {
                this.setState({ activeRowKey: this.props.item.key})
            },
            right:[
                {
                    onPress:()=>{
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete?',
                            [
                                {text:'No', onPress: () => console.log('cancel Pressed'), style: 'cancel'},
                                {text: 'Yes', onPress: () => {
                                    FlatListData.splice(this.props.index, 1);
                                    //Refresh FlatList !
                                    this.props.parentFlatList.refreshflatList(deletingRow)
                                }},
                            ],
                            { cancelable: true}
                        );
                    },
                    text:'Delete', type:'delete'
                }
            ],
            rowId: this.props.index,
            sectionId:1
          };
          return(
             <Swipeout {...swipeSetting} style={{backgroundColor:'#ffe3af',borderRadius:10,marginLeft:5,marginTop:10}}>
                <ListItem >
                    <Text style={{color:'#686868'}}> {this.props.item.name} </Text>
                </ListItem>
             </Swipeout>
          );
      }
}









let keys = ['placholder1', 'placholder2','UserStops','UserEx','NumAdults','NumKids'];




export default class TourScreen extends React.Component {

   

    static navigationOptions = ({ navigation, screenProps }) => ({
        
        headerTitle: (
          <View style={{alignItems:'center',width:'100%',height:'100%',backgroundColor:'#f4a442'}}>
          <ImageBackground style={{width:'100%',height:'100%'}} source={require('../../src/img/header.png')}>
          <View style={{height:'100%',justifyContent:'center',marginLeft:-50}}><Text style={{textAlign:'center',fontWeight:'bold',fontSize:20,color:'#fff'}}>Tours</Text></View></ImageBackground>
        </View>
        ),

        headerLeft: <TouchableOpacity style={{width:70,height:40,justifyContent:'center'}} onPress={ () => { navigation.navigate('JustGo'); AsyncStorage.multiRemove(keys) }}><Icon name={'ios-arrow-back'}
             style={{paddingLeft:15,paddingTop:3,color:'#fff'}}/></TouchableOpacity>,


        headerStyle: {
            backgroundColor: '#fbb13f'
          },

          headerTintColor: 'white',
       
        });


    constructor(props){
        super(props);


        this.state = {
            newStop:'',
            deletedRowKey:null,
            Startdate:"2018-08-09",
            Enddate:"2018-08-10",
            dateS:false,
            dataE:false,

            //google auto complete feild 1
             address:"",
             myState: [],
            //  {
            //     "key":"ugc3muiqktkbg52yf9n32vb8",
            //     "name":"Negombo, Sri Lanka",
            //     "stops_LAT":7.200796799999999,
            //     "stops_LNG":79.8736754
            // }

            ExcurMyState: [],

            // {
            //     "key":"ugc3muiqktkbg52yf9n32vb8",
            //     "name":"Whale Watching",
            //     "EX_LAT":7.200796799999999,
            //     "EX_LNG":79.8736754
            // }


             refreshing:false,
            STOPS_LAT:"",
            STOPS_LNG:"",
            AdultsNum:"0",
            KidsNum:"0",
            value: 0,
            ValuAddedServices:[],
            

            PrefferedVehicle:"Compact",

            CompactV:true,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,

            slide:false,
            babyseat:false,
            Cushio:false,
            GPSv:false,
            Icebox:false,
            DVDScreen:false,
            SimCards:false,
            wifi:false,


            FromState:"Start Location",
            ToState:"End Location",

            FromStateVaL:"",
            ToStateVaL:"",
            // FROM_LAT_sub:0.0,
            // FROM_LNG_sub:0.0,
            // //google auto complete feild 2
            // address2:"",
            // TO_LAT:0.0,
            // TO_LNG:0.0

        }
    }


    refreshflatList = (deletedKey) => {
        this.setState((prevState) => {
            return {
                deletedRowKey: deletedKey
            };
        });
    }

    generateKey = (numberOfCharactors)=>{
        return require('random-string')({length: numberOfCharactors});
    }

    handleBackPress(){
        AsyncStorage.multiRemove(keys)
    }

  componentDidMount() {
    AsyncStorage.setItem('CurrentScreen',"Round_Tours");

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    
    AsyncStorage.getItem('UserStops').then((value) => {
        if(JSON.parse(value) === null){
            this.setState({myState: []});
        }else{
            this.setState({myState: JSON.parse(value)});
        }
        

    });

    AsyncStorage.getItem('UserEx').then((value) => {
        if(JSON.parse(value) === null){
            this.setState({ExcurMyState: []});
        }else{
            this.setState({ExcurMyState: JSON.parse(value)});
        }
    });


    AsyncStorage.getItem('placholder1').then((value) => {
        if(value == undefined){
            this.setState({FromState: "Start Location",FromStateVaL:""});
        }else{
            this.setState({FromState: value,FromStateVaL:value});
        }
        

    });
    
    // if(this.state.FromState===null){
    // alert(this.state.FromState)
    // }

    //AsyncStorage.removeItem('placholder1');


    AsyncStorage.getItem('placholder2').then((value) => {
        if(value == undefined){
            this.setState({ToState: "End Location",ToStateVaL:""});
        }else{
            this.setState({ToState: value,ToStateVaL:value});
        }
        

    });

    AsyncStorage.getItem('NumAdults').then((value) => {
        if(value == undefined){
            this.setState({AdultsNum: "0"});
        }else{
            this.setState({AdultsNum: value});
        }
        

    });

    AsyncStorage.getItem('NumKids').then((value) => {
        if(value == undefined){
            this.setState({KidsNum: "0"});
        }else{
            this.setState({KidsNum: value});
        }
        

    });

  }

  handleRefresh = ()=>{
    this.setState({ refreshing: true }, function() {
    
      });
      
};


removeitem(kk){

    //this.state.myState.splice(ind, kk);

    var myState = [...this.state.myState]
    let index = myState.indexOf(kk);
    myState.splice(index, 1);
    this.setState({ myState });

    AsyncStorage.setItem('UserStops', JSON.stringify(myState) );
}

removeitem2(kk){

    //this.state.myState.splice(ind, kk);

    var ExcurMyState = [...this.state.ExcurMyState]
    let index = ExcurMyState.indexOf(kk);
    ExcurMyState.splice(index, 1);
    this.setState({ ExcurMyState });

    AsyncStorage.setItem('UserEx', JSON.stringify(ExcurMyState) );
}

emptymsgFun(){
    if(this.state.myState.length==0){
      return(<View style={{height:'100%',width:deviceWidth/1.2,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontWeight:'bold',fontSize:17,color:'#ffdc9b',textAlign:'center'}}>No Stops Added !</Text></View>)
    }
}

emptymsgFun2(){
    if(this.state.ExcurMyState.length==0){
      return(<View style={{height:'100%',width:deviceWidth/1.2,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontWeight:'bold',fontSize:17,color:'#ffdc9b',textAlign:'center'}}>No Excursions Added !</Text></View>)
    }
}


onSelect(index, value){
    this.setState({
      text: `Selected index: ${index} , value: ${value}`
    })
  }



  radioFun(val){
    switch (val) {
        case 'Compact':
        this.setState({
            CompactV:true,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Compact"})

        break

        case 'Full-Size':
        this.setState({
            CompactV:false,
            FullSizeV:true,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Full-Size"})

        break
            case 'Full-Size SUV':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:true,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Full-Size SUV"})

         break
            case 'Full-Size Van':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:true,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Full-Size Van"})

        break


        case 'Luxuary Car':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:true,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Luxuary Car"})

        break


        case 'Mid-Size':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:true,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Mid-Size"})

        break


        case 'Mid-Size SUV':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:true,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Mid-Size SUV"})

        break

        case 'Mini Van':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:true,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Mini Van"})

        break
        case 'Premium':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:true,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:"Premium"})

        break
        case 'Standard':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:true,
            StandardSuV:false,
            PrefferedVehicle:"Standard"})

        break

        case 'Standard SUV':
        this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:true,
            PrefferedVehicle:"Standard SUV"})

        break

        
        default:this.setState({
            CompactV:false,
            FullSizeV:false,
            FullSizeSUV:false,
            FullsizeVan:false,
            LuxuaryCar:false,
            MidSize:false,
            MidsizeSUV:false,
            MiniVan:false,
            Premium:false,
            Standard:false,
            StandardSuV:false,
            PrefferedVehicle:""
        })

    }

   

  }


  ValuAddedFun(nam,chcked){
        

      if(chcked)  {
        const newKey = this.generateKey(24);
        const ValuAddedServices = {
            key: newKey,
            name: nam,
        };

        this.state.ValuAddedServices.push(ValuAddedServices);

        
            
            switch (nam) {
                case 'Baby Seat':this.setState({babyseat:chcked});
                break
                case 'Cushions':this.setState({Cushio:chcked});
                break
                case 'GPS':this.setState({GPSv:chcked});
                break
                case 'Ice Box':this.setState({Icebox:chcked});
                break
                case 'DVD + Screen':this.setState({DVDScreen:chcked});
                break
                case 'Local Sim Cards':this.setState({SimCards:chcked});
                break
                case 'Wi-Fi':this.setState({wifi:chcked});
            }
        
    }else{
        var ValuAddedServices = [...this.state.ValuAddedServices]
            for(var i = 0;i< ValuAddedServices.length;i++){
                if(ValuAddedServices[i].name == nam){
                    ValuAddedServices.splice(i, 1);
                }
            }
    
    this.setState({ ValuAddedServices });

    switch (nam) {
        case 'Baby Seat':this.setState({babyseat:chcked});
        break
        case 'Cushions':this.setState({Cushio:chcked});
        break
        case 'GPS':this.setState({GPSv:chcked});
        break
        case 'Ice Box':this.setState({Icebox:chcked});
        break
        case 'DVD + Screen':this.setState({DVDScreen:chcked});
        break
        case 'Local Sim Cards':this.setState({SimCards:chcked});
        break
        case 'Wi-Fi':this.setState({wifi:chcked});
    }

    }
    //this.setState({ babyseat:chcked,Cushio:chcked });
  }


  SaveAllDetails(){
                               if(this.state.FromStateVaL === "" || this.state.ToStateVaL === ""){
                                this.refs.toast.show('Please Enter Start Location End Location',1500);
                               }
                                else if(this.state.dateS == false || this.state.dateE == false){

    this.refs.toast.show('Please Enter Start Date End Date',1500);
   // Toast.show('Please Enter Your Details');
                                             }else if(this.state.AdultsNum === "0" || this.state.AdultsNum === "" ){
                                                this.refs.toast.show('Please Enter No of Pax',1500);
                                             }else{
                                AsyncStorage.setItem('UserStops', JSON.stringify(this.state.myState) );
                                AsyncStorage.setItem('UserStartDate',this.state.Startdate);
                                AsyncStorage.setItem('UserEndDate', this.state.Enddate);
                                AsyncStorage.setItem('NumAdults', this.state.AdultsNum);
                                AsyncStorage.setItem('NumKids', this.state.KidsNum);
                                AsyncStorage.setItem('PreferredVehicle', this.state.PrefferedVehicle );
                                AsyncStorage.setItem('ValuAddedServices', JSON.stringify(this.state.ValuAddedServices) );

                                this.refs.toast.show('Your Details Saved To Draft',1500);
                                //Toast.show('Your Details Saved To Draft');
                                this.props.navigation.navigate("Vehicles")
                                             }


    
}


slideFun(){
    if(this.state.slide){
    return(<View style={styles.fullSizeExcur}>
  
        </View>)}else{
return(<View >

    </View>)
        }
}

slideOpen(){
    this.setState({slide:true})
}



  

  render() {
    return (  
        
        <ImageBackground  source={require('../../src/img/bg13.png')} style={styles.container}>

        

            <View style={styles.txtContainer}>
                <Text style={styles.txt}>Search for Round Tours</Text>
            </View>
            <KeyboardAvoidingView behavior="padding" style={{height:deviceHeight-140,width:'100%'}}>

                               

            <ScrollView >
            <View style={{paddingRight:10,paddingLeft:10}}>
               
            <Item style={{marginLeft:null,height:deviceHeight/7,alignItems: 'center',justifyContent: 'center',}} stackedLabel>
                    <Label>From</Label>
                    <Item rounded style={{borderColor:'#f4a442',height: 40, marginTop:8}}>
                        <Icon active name='ios-pin' style={{color:'#f4a442'}} />
                        <Input placeholder='' placeholderTextColor='#c1c1c1' editable={false}/>
                    </Item>
                </Item>

                <Item style={{marginLeft:null,height:deviceHeight/7,alignItems: 'center',justifyContent: 'center',}} stackedLabel>
                    <Label>To</Label>
                    <Item rounded style={{borderColor:'#f4a442',height: 40, marginTop:8}}>
                        <Icon active name='ios-pin' style={{color:'#f4a442'}} />
                        <Input placeholder='' placeholderTextColor='#c1c1c1' editable={false}/>
                    </Item>
                </Item>

 <View style={{padding:10,borderRadius:5,borderWidth:1,marginTop:10,height:deviceHeight/4,flexDirection:'column',borderColor:'#ffa216'}}>
                    <Item style={{paddingTop:5,flex:0.35,marginLeft:null,paddingBottom:25,alignItems: 'center',justifyContent: 'center'}} stackedLabel>
                        <Label>Stops</Label>
                        <Item rounded style={{width:deviceWidth/1.2,borderColor:'#ffa216',height: 40, marginTop:8,flexDirection:'row'}}>

                            <TouchableOpacity style={{width:'100%',marginRight:5,alignItems: 'flex-end',justifyContent: 'center'}}>
                                <Icon 
                                onPress={() => {
                                    if (this.state.newStop.length == 0){
                                        alert("you must enter stop");
                                        return;
                                    }


                                    const newKey = this.generateKey(24);
                                    const newStop = {
                                        key: newKey,
                                        name: this.state.newStop,
                                        stops_LAT:this.state.STOPS_LAT,
                                        stops_LNG:this.state.STOPS_LNG
                                    };

                                    this.state.myState.push(newStop);
                                    AsyncStorage.setItem('UserStops', JSON.stringify(this.state.myState) );
                                    this.refs.toast.show('Successfully Added',1500);
                                   // Toast.show('Successfully Added');
                                    
                                    this.handleRefresh()
                                    this.setState({ newStop: "",refreshing:false })

                                }}
                                style={{color:'#ffa216',padding:5}} active name='ios-add-circle-outline' />
                            </TouchableOpacity>
                        </Item>
                    </Item>
                    <FlatList
                        data={this.state.myState}

                        ListEmptyComponent={this.emptymsgFun()}

                        horizontal={true}

                        renderItem={({item,index})=>
                        <View style={{width:null,backgroundColor:'#ffe3af',margin:5,borderRadius:7,flexDirection:'row'}}>

                                <View style={{flex:0.8,justifyContent:'center',alignItems:'center',paddingHorizontal:8}}>
                                <Text style={{color:'#4c4c4c'}}>{item.name}</Text>
                                </View>

                                <TouchableOpacity style={{flex:0.2,backgroundColor:'#ff7363',width:40,borderBottomRightRadius:7,
                                borderTopRightRadius:7,justifyContent:'center',alignItems:'center'}}      onPress={() => {this.removeitem(item)}}>
                                    <Icon name="ios-close" style={{color:'#fff'}} />
                                </TouchableOpacity>


                            </View>
                            
                       // paddingHorizontal:20,paddingVertical:20,justifyContent:'center',alignItems:'center'
                        }

                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                        />
                             
                </View>




<View style={{padding:10,borderRadius:5,borderWidth:1,marginTop:18,height:deviceHeight/4,flexDirection:'column',borderColor:'#ffa216',}}>
                    <Item style={{paddingTop:5,flex:0.35,marginLeft:null,paddingBottom:25,alignItems: 'center',justifyContent: 'center'}} stackedLabel>
                        <Label>Add Excursions</Label>
                        <Item rounded style={{width:deviceWidth/1.2,borderColor:'#ffa216',height: 40, marginTop:8,flexDirection:'row'}}>

                            <TouchableOpacity style={{width:'100%',marginRight:5,alignItems: 'center',justifyContent: 'center'}} onPress={() => {this.props.navigation.navigate("RoundTourEx")}}>
                                <Icon 
                                
                                style={{color:'#ffa216',padding:5}} active name='ios-add-circle-outline' />
                            </TouchableOpacity>
                        </Item>
                    </Item>
                    <FlatList
                        data={this.state.ExcurMyState}


                        horizontal={true}

                        ListEmptyComponent={this.emptymsgFun2()}

                        renderItem={({item,index})=>
                        <View style={{width:null,backgroundColor:'#ffe3af',margin:5,borderRadius:7,flexDirection:'row'}}>

                                <View style={{flex:0.8,justifyContent:'center',alignItems:'center',paddingHorizontal:8}}>
                                <Text style={{color:'#4c4c4c'}}>{item.name}</Text>
                                </View>

                                <TouchableOpacity style={{flex:0.2,backgroundColor:'#ff7363',width:40,borderBottomRightRadius:7,
                                borderTopRightRadius:7,justifyContent:'center',alignItems:'center'}}      onPress={() => {this.removeitem2(item)}}>
                                    <Icon name="ios-close" style={{color:'#fff'}} />
                                </TouchableOpacity>


                            </View>
                            
                       // paddingHorizontal:20,paddingVertical:20,justifyContent:'center',alignItems:'center'
                        }

                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                        />
                             
                </View>


                <View style={{height:deviceHeight/7,flexDirection:'row'}}>
                    <View style={{flex:0.5,alignItems: 'center',justifyContent: 'center',marginRight:15}}>
                        
                            <Label style={{color:'#474747',position: null,top: null,left: null,right: null,paddingTop: 5,alignSelf: "flex-start",fontSize:14,paddingLeft:5}}>Start Date</Label>
                            <Item rounded style={{marginLeft:null,height: 40,borderColor:'#f4a442', marginTop:8}}>
                                <DatePicker
                                    style={{width: 170}}
                                    date={this.state.Startdate}
                                    mode="date"
                                    placeholder="Select Date"
                                    format="YYYY-MM-DD"
                                    minDate="2000-01-01"
                                    maxDate="2030-12-31"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 15,
                                    },
                                    dateInput: {
                                        marginLeft: 15,
                                        borderWidth: null
                                    },
                                    placeholderText: {
                                        color: '#333'
                                      },
                                      btnTextConfirm: {
                                        color: '#ff7043',
                                      },
                                      btnTextCancel: {
                                        color: '#ff7043',
                                      }
                                    // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {this.setState({Startdate: date,dateS:true})}}
                                />
                           
                        </Item>
                    </View>
                    <View style={{flex:0.5,alignItems: 'center',justifyContent: 'center',paddingLeft:5}}>
                        
                    <Label style={{color:'#474747',position: null,top: null,left: null,right: null,paddingTop: 5,alignSelf: "flex-start",fontSize:14,paddingLeft:5}}>End Date</Label>
                            <Item rounded style={{marginLeft:null,height: 40,borderColor:'#f4a442', marginTop:8}}>
                                <DatePicker
                                    style={{width: 170}}
                                    date={this.state.Enddate}
                                    mode="date"
                                    placeholder="Select Date"
                                    format="YYYY-MM-DD"
                                    minDate="2000-01-01"
                                    maxDate="2030-12-31"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 15,
                                    },
                                    dateInput: {
                                        marginLeft: 15,
                                        borderWidth: null
                                    },
                                    datePickerMask: {
                                        flex: 1,
                                        alignItems: 'flex-end',
                                        flexDirection: 'row',
                                        backgroundColor: '#00000077'
                                      },
                                      placeholderText: {
                                        color: '#333'
                                      },
                                      btnTextConfirm: {
                                        color: '#ff7043',
                                      },
                                      btnTextCancel: {
                                        color: '#ff7043',
                                      }
                                    // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {this.setState({Enddate: date,dateE:true})}}
                                />
                            </Item>
                        
                    </View>           
                </View>

                <Item style={{marginLeft:null,height:deviceHeight/6,alignItems: 'center',justifyContent: 'center'}} stackedLabel>
                    <Label style={{fontSize:14,color:'#333'}}>No of Pax :</Label>
                    <View style={{ flexDirection:'row',borderColor:'#f4a442', marginTop:8,paddingBottom:5}}>
                              <View style={{flex:0.5,paddingHorizontal:10}}>  
                                <Label>Adults</Label>
                                <Item rounded style={{height: 40,borderColor:'#f4a442', marginTop:8}}>
                                    <Icon active name='ios-people' style={{color:'#f4a442'}}/>
                                    <Input rounded placeholder={this.state.AdultsNum} keyboardType="numeric" onChangeText={ (text) => this.setState({ AdultsNum: text }) }/>
                                </Item>
                                </View>

                                <View style={{flex:0.5,paddingHorizontal:10}}>
                                <Label>Kids</Label>
                                <Item rounded style={{height: 40,borderColor:'#f4a442', marginTop:8}}>
                                    <Icon active name='ios-person' style={{color:'#f4a442'}}/>
                                    <Input rounded  placeholder={this.state.KidsNum} keyboardType="numeric" onChangeText={ (text) => this.setState({ KidsNum: text }) }/>
                                </Item>
                                </View>

                    </View>
                </Item>



                <View style={{paddingLeft:null,flex:0.3,alignItems: 'center',justifyContent: 'center',paddingTop:15,}}>
                        <Label style={{color:'#333',position: null,top: null,left: null,right: null,paddingTop: 5,alignSelf: "flex-start",fontSize:14,}}>Preferred Vehicle</Label>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Compact")}}
                                        selected={this.state.CompactV}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                                                <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carCompact.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Compact</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Full-Size")}}
                                        selected={this.state.FullSizeV}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carFull.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Full-Size</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Full-Size SUV")}}
                                        selected={this.state.FullSizeSUV}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/suvFull.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Full-Size SUV</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Full-Size Van")}}
                                        selected={this.state.FullsizeVan}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carM.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Full-Size Van</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Luxuary Car")}}
                                        selected={this.state.LuxuaryCar}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carLux.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Luxuary Car</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Mid-Size")}}
                                        selected={this.state.MidSize}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carMicro.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Mid-Size</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Mid-Size SUV")}}
                                        selected={this.state.MidsizeSUV}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carM.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Mid-Size SUV</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Mini Van")}}
                                        selected={this.state.MiniVan}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carCompact.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Mini Van</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Premium")}}
                                        selected={this.state.Premium}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carLx.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Premium</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Standard")}}
                                        selected={this.state.Standard}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carS.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Standard</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                <Radio 
                                        onPress={() => {this.radioFun("Standard SUV")}}
                                        selected={this.state.StandardSuV}
                                        color={"#f4a442"}
                                        selectedColor={"#f4a442"}/>
                                    <Image
                                        style={{width:carsSize,height:carsSize,marginLeft:15}}
                                    source={require('../../src/img/carFull.png')}
                                    />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Standard SUV</Text>
                            </View>
                        </ScrollView>                          
                </View>




                <View style={{height:deviceHeight/5,alignItems: 'center',justifyContent: 'center',paddingTop:15,}}>
                        <Label style={{color:'#474747',position: null,top: null,left: null,right: null,paddingTop: 5,alignSelf: "flex-start",fontSize:14,}}>Value Added Services</Label>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                    <Checkbox     
                                        checked={this.state.babyseat}
                                        style={{backgroundColor: '#f2f2f2', color:'#ffbe5e',
                                        borderWidth: 1,borderColor:'#ffbe5e'}}
                                        onChange={(name, checked) => this.ValuAddedFun("Baby Seat", checked)}/>
                                    <Icon style={{fontSize:50,marginLeft:15,color:'#f49913'}}  name='ios-basket' />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Baby Seat</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                    <Checkbox     
                                        checked={this.state.Cushio}
                                        style={{backgroundColor: '#f2f2f2', color:'#ffbe5e',
                                        borderWidth: 1,borderColor:'#ffbe5e'}}
                                        onChange={(name, checked) => this.ValuAddedFun("Cushions", checked)}/>
                                    <Icon style={{fontSize:50,marginLeft:15,color:'#f49913'}}  name='ios-bowtie' />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Cushions</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                    <Checkbox     
                                        checked={this.state.GPSv}
                                        style={{backgroundColor: '#f2f2f2', color:'#ffbe5e',
                                        borderWidth: 1,borderColor:'#ffbe5e'}}
                                        onChange={(name, checked) => this.ValuAddedFun("GPS", checked)}/>
                                    <Icon style={{fontSize:50,marginLeft:15,color:'#f49913'}}  name='ios-locate' />
                                </ListItem>
                                <Text style={{color:'#474747'}}>GPS</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                    <Checkbox     
                                        checked={this.state.Icebox}
                                        style={{backgroundColor: '#f2f2f2', color:'#ffbe5e',
                                        borderWidth: 1,borderColor:'#ffbe5e'}}
                                        onChange={(name, checked) => this.ValuAddedFun("Ice Box", checked)}/>
                                    <Icon style={{fontSize:50,marginLeft:15,color:'#f49913'}}  name='ios-cube' />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Ice Box</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                    <Checkbox     
                                        checked={this.state.DVDScreen}
                                        style={{backgroundColor: '#f2f2f2', color:'#ffbe5e',
                                        borderWidth: 1,borderColor:'#ffbe5e'}}
                                        onChange={(name, checked) => this.ValuAddedFun("DVD + Screen", checked)}/>
                                    <Icon style={{fontSize:50,marginLeft:15,color:'#f49913'}}  name='ios-desktop' />
                                </ListItem>
                                <Text style={{color:'#474747'}}>DVD + Screen</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                    <Checkbox     
                                        checked={this.state.SimCards}
                                        style={{backgroundColor: '#f2f2f2', color:'#ffbe5e',
                                        borderWidth: 1,borderColor:'#ffbe5e'}}
                                        onChange={(name, checked) => this.ValuAddedFun("Local Sim Cards", checked)}/>
                                    <Icon style={{fontSize:50,marginLeft:15,color:'#f49913'}}  name='ios-card' />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Local Sim Cards</Text>
                            </View>
                            <View style={{flexDirection:'column',alignItems: 'center',justifyContent: 'center'}}>
                                <ListItem style={{paddingTop:null,paddingBottom:null,flexDirection:'row'}}>
                                    <Checkbox     
                                        checked={this.state.wifi}
                                        style={{backgroundColor: '#f2f2f2', color:'#ffbe5e',
                                        borderWidth: 1,borderColor:'#ffbe5e'}}
                                        onChange={(name, checked) => this.ValuAddedFun("Wi-Fi", checked)}/>
                                    <Icon style={{fontSize:50,marginLeft:15,color:'#f49913'}}  name='ios-wifi' />
                                </ListItem>
                                <Text style={{color:'#474747'}}>Wi-Fi</Text>
                            </View>
                        </ScrollView>                          
                </View>
                <Button style={styles.btn2} rounded block onPress= {() => this.SaveAllDetails()} >
                    <Text style={styles.btnText}>Select Your Vehicle</Text>
                    <Icon name="ios-arrow-forward" style={{color:'#fff'}}/>
                </Button>

                {/* <Button style={styles.btn2} rounded block onPress= {() => this.props.navigation.navigate("Vehicles")} >
                    <Text style={styles.btnText}>Select Your Excursion</Text>
                    <Icon name="ios-arrow-forward" style={{color:'#fff'}}/>
                </Button> */}
            </View>

            

                                <View style={styles.fullSize3}>
                                                    <GooglePlacesAutocomplete
                                placeholder="Add Stop"
                                minLength={1}
                                autoFocus={false}
                                enablePoweredByContainer={false}
                                returnKeyType={'default'}
                                fetchDetails={true}
                                //getDefaultValue={() => this.state.newStop}
                              
                                  

                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

                                this.setState(
                                    {
                                     
                                        newStop:data.description,
                                        STOPS_LAT:details.geometry.location.lat,
                                        STOPS_LNG:details.geometry.location.lng
                                    },
                                  );

                               // let val1 =details.geometry.location.lat

                                //   AsyncStorage.setItem('placholder1', data.description );
                                //   AsyncStorage.setItem('FromLAT',JSON.stringify(details.geometry.location.lat) );
                                //   AsyncStorage.setItem('FromLNG', JSON.stringify(details.geometry.location.lng) );
                                 


                                  //alert(this.state.FROM_LAT+" "+this.state.FROM_LNG)
                      
                              }}


                            //   textInputProps={{
                            //     onChangeText: (text) => { this.setState({newStop: this.state.address}) }
                            // }}


                             
                                styles={{
                                    textInputContainer: {
                                    backgroundColor: 'transparent',
                                    borderTopWidth: 0,
                                    borderBottomWidth:0
                                    },
                                    textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 38,
                                    backgroundColor: 'transparent',
                                    color: '#5d5d5d',
                                    fontSize: 16
                                    },
                                    predefinedPlacesDescription: {
                                    color: '#1faadb'
                                    },

                                    listView:{
                                        borderBottomWidth:2,
                                        borderLeftWidth:2,
                                        borderRightWidth:2,
                                        borderRadius:5,
                                        borderColor:'#ffc175',
                                        backgroundColor: '#fff',
                                    }
                                }}
                                currentLocation={false}
                                query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: 'AIzaSyDCy48UtAztBxAKzchJVUZPCrjop9dOvxs',
                                        language: 'en', // language of the results
                                        //types: 'geocode', // default: 'geocode'
                                        components: 'country:lk'
                                    }}
                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                   
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'food'
                                    }}

                                    
                                /></View>




                                <View style={styles.fullSize2}>
                                                    <GooglePlacesAutocomplete
                                placeholder={this.state.ToState}
                                minLength={1}
                                autoFocus={false}
                                enablePoweredByContainer={false}
                                returnKeyType={'default'}
                                fetchDetails={true}


                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

                                // this.setState(
                                //     {
                                     
                                //       FROM_LAT_sub: details.geometry.location.lat,
                                //       FROM_LNG_sub:details.geometry.location.lng
                                //     },
                                //   );

                               // let val1 =details.geometry.location.lat

                                  AsyncStorage.setItem('placholder2', data.description );
                                  this.setState({ToStateVaL: data.description});

                                  AsyncStorage.setItem('ToLAT',JSON.stringify(details.geometry.location.lat) );
                                  AsyncStorage.setItem('ToLNG', JSON.stringify(details.geometry.location.lng) );
                                 


                                  //alert(this.state.FROM_LAT+" "+this.state.FROM_LNG)
                      
                              }}


                                styles={{
                                    textInputContainer: {
                                    backgroundColor: 'transparent',
                                    borderTopWidth: 0,
                                    borderBottomWidth:0
                                    },
                                    textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 38,
                                    backgroundColor: 'transparent',
                                    color: '#5d5d5d',
                                    fontSize: 16
                                    },
                                    predefinedPlacesDescription: {
                                    color: '#1faadb'
                                    },

                                    listView:{
                                        borderBottomWidth:2,
                                        borderLeftWidth:2,
                                        borderRightWidth:2,
                                        borderRadius:5,
                                        borderColor:'#ffc175',
                                        backgroundColor: '#fff',
                                    }
                                }}
                                currentLocation={false}
                                query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: 'AIzaSyDCy48UtAztBxAKzchJVUZPCrjop9dOvxs',
                                        language: 'en', // language of the results
                                        components: 'country:lk'
                                    }}
                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                   
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'food'
                                    }}

                                    
                                /></View>



                                 <View style={styles.fullSize}>
                                                    <GooglePlacesAutocomplete
                                placeholder={this.state.FromState}
                                
                                minLength={1}
                                autoFocus={false}
                                enablePoweredByContainer={false}
                                returnKeyType={'default'}
                                fetchDetails={true}

                                onPress={(data, details = null) => {

                                  AsyncStorage.setItem('placholder1', data.description );
                                  this.setState({FromStateVaL: data.description});

                                  AsyncStorage.setItem('FromLAT',JSON.stringify(details.geometry.location.lat) );
                                  AsyncStorage.setItem('FromLNG', JSON.stringify(details.geometry.location.lng) );
                                 
                      
                              }}


                             
                                styles={{
                                    textInputContainer: {
                                    backgroundColor: 'transparent',
                                    borderTopWidth: 0,
                                    borderBottomWidth:0
                                    },
                                    textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    height: 38,
                                    backgroundColor: 'transparent',
                                    color: '#5d5d5d',
                                    fontSize: 16
                                    },
                                    predefinedPlacesDescription: {
                                    color: '#1faadb'
                                    },

                                    listView:{
                                        borderBottomWidth:2,
                                        borderLeftWidth:2,
                                        borderRightWidth:2,
                                        borderRadius:5,
                                        borderColor:'#ffc175',
                                        backgroundColor: '#fff',
                                    }
                                }}
                                currentLocation={false}
                                query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: 'AIzaSyDCy48UtAztBxAKzchJVUZPCrjop9dOvxs',
                                        language: 'en', // language of the results
                                       // types: '(cities)',
                                        //types: 'geocode', // default: 'geocode'
                                        components: 'country:lk'

                                    }}
                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                   
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'food'
                                    }}

                                    
                                /></View>
            </ScrollView>
            </KeyboardAvoidingView>

              <Toast ref="toast"/>

               {this.slideFun()}

        </ImageBackground>
  
    );
  }
}


const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      flex: 1,
      alignItems:'center',
      backgroundColor: 'white',
    },
    txt: {
        fontSize: 17,
        fontWeight: 'bold',
        paddingHorizontal:30,
        paddingTop:30,
        color: '#fff'
    },
    txtContainer:{
        marginTop:-10,
        borderRadius:10,
        paddingBottom:7,
        alignItems: 'center',
        backgroundColor:'#ffb94f',
    },
    btn2: {
        flex: 0.2,
        backgroundColor: '#f4a442',
        marginBottom:10
      },
      btnText: {
        paddingLeft:40,
        color: 'white',
        fontWeight: 'bold'
      },
      
fullSize:{
 
    position:'absolute',
    width:'85%',
    
    left:'9%',
    top:'3.6%'

},

fullSize2:{
 
    position:'absolute',
    width:'85%',
    
    left:'9%',
    top:'12.5%'

},



fullSize3:{
 
    position:'absolute',
    
    width:'70%',
    
    left:'9%',
    top:'21.7%'

},


fullSizeExcur:{
 
    position:'absolute',
    width:'100%',
    height:'100%',
    backgroundColor:'#ddd'
    

},
  });