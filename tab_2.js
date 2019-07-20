import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Alert,
  ScrollView,
  StatusBar,
  Dimensions,
  FlatList
} from 'react-native';

import PendingReply from '../PendingReply';

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width
import sort from 'fast-sort';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {Content, Accordion , ActionSheet, Button ,Header , Card,Thumbnail, Tab, Tabs, Left,CardItem,DatePicker,  Form, Item, Picker,Badge, Fab ,Body, Icon, Right,ListItem,List, CheckBox, Footer, FooterTab} from "native-base";

export default class Tab_2 extends Component {


  constructor (props) {

    super(props);


    this.state = {
        fadeBody:new Animated.Value(0),
        left:new Animated.Value(-deviceWidth/3),
        leftPro:new Animated.Value(-wp('60%')),
        PendingReply:false,
        is_toggled:false,
        loading:false, 
        question:'',
        user_name:'',
        time:'',
        image:'',
        uid:''

       
    };

}

SetValues(item){

      this.setState({PendingReply:true, user_name:item.user_name, question:item.question, time:item.time, image:item.img_url,uid:item.user_id})

}


  render() {
    return (
      <View style={styles.container}>
                      <FlatList 
                          style={{width:'100%'}}
                          
                          //data={this.props.req_data}

                         data={sort(this.props.req_data).desc(u => u.key)}

                          keyExtractor={(item, index) => item.key}

                          //ListEmptyComponent={this.emptymsgFun()}
                          //contentContainerStyle={styles.main_cat_LIST}
                          renderItem={({ item, index }) =>
                           <List >
                                  <ListItem avatar  onPress = {() => this.SetValues(item) }>
                                        <Left>
                                          <Thumbnail source={{uri : item.img_url}} />
                                        </Left>
                                        <Body>
                                          <Text style={styles.textsadeep}>{item.user_name}</Text>
                                          <Text note>{item.question}</Text>
                                        </Body>
                                        <Right>
                                          <Text note>{item.time}</Text>
                                        </Right>
                                      </ListItem>
                            </List>
                           
                        }
                      //refreshing={this.state.refreshing}
                      // onRefresh={() => this.handleRefresh()}
                        />

{/* <ScrollView style={styles.scrollSS}>

   <Content>
        <List style={styles.list} >

       
            <ListItem avatar  onPress = {() => this.setState({PendingReply:true}) }>
              <Left>
                <Thumbnail source={require('../../../img/Sir.png')} />
              </Left>
              <Body>
                <Text style={styles.textsadeep}>Jhons Chanradasa</Text>
                <Text note>Doing what you like will always keep you happy . .</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
   

            <ListItem avatar>
              <Left>
                <Thumbnail source={require('../../../img/Tissa.jpg')} />
              </Left>
              <Body>
                <Text style={styles.textsadeep}>Tissa Gunawardena</Text>
                <Text note>Doing what you like will always keep you happy . .</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>

            

            <ListItem avatar>
              <Left>
                <Thumbnail source={require('../../../img/sadee.jpg')} />
              </Left>
              <Body>
                <Text style={styles.textsadeep}>Sadeep Dhananjana</Text>
                <Text note>No 262/B Udumulla Rd, Madakumbura, Karandeniya.</Text>
              </Body>
              <Right>
                <Text note>1:07 pm</Text>
              </Right>
            </ListItem>      

         
          </List>
          </Content>

          <PendingReply visible={this.state.PendingReply} _this ={this} screen={"drawer"}/>

          </ScrollView> */}

<PendingReply visible={this.state.PendingReply} _this ={this} screen={"drawer"}  user_name ={this.state.user_name} image ={this.state.image}  time ={this.state.time} question ={this.state.question}  uid={this.state.uid} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  body:{
    flex:1
  },
  scrollSS:{
    width:'100%',
  },

});