import firebase from "firebase";
import {  notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import React from 'react';
import {pushNotification, setCameraDetected} from '../redux'
import {addToken} from './index';
import { useHistory } from "react-router-dom";

var firebaseConfig = {
  apiKey: "AIzaSyC9izJHMtdebUkfBHhLu6w9Xpa2ysEHfiw",
  authDomain: "sdms-captone-4ab5b.firebaseapp.com",
  databaseURL: "https://sdms-captone-4ab5b.firebaseio.com",
  projectId: "sdms-captone-4ab5b",
  storageBucket: "sdms-captone-4ab5b.appspot.com",
  messagingSenderId: "1083415409588",
  appId: "1:1083415409588:web:dcdf8e8c726494128038e1",
  measurementId: "G-GHMH3MV76W",
};
// Initialize Firebase
const initializeFirebase = (dispatch) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }
  
  askForPermissioToReceiveNotifications(dispatch);
  //   firebase.analytics();
};



const askForPermissioToReceiveNotifications = async (dispatch) => {
  try {
    const messaging = firebase.messaging();
    // await messaging.requestPermission();
    const token = await messaging.getToken();
    let model = {
      Token : token,
      DeviceType : 'browser',
    };
    addToken(model).then(() => {
      console.log("Token added now");
    }).catch(() => {
      console.log("Token have been added!");
    })
    navigator.serviceWorker.addEventListener("message",(message) =>{
      const duration = 120
      const noti = message.data.notification
      let audio = null;
      switch(message.data.data.type){
        case "0":
          notification['success']({
            duration: duration,
            message: noti.title,
            description:
              noti.body,
            placement: 'topRight',
            onClick: (() => window.location.assign( message.data.data.link))
          });
          audio = new Audio('http://localhost:3000/tinh_normal.mp3');
          audio.play();
          break;
        case "1":
        case "2":
          notification['error']({
            duration: duration,

            message: noti.title,
            description:
              noti.body,
            placement: 'topRight',
            onClick: (() => window.location.assign( message.data.data.link))
          });
          audio = new Audio('http://localhost:3000/tinh.mp3');
          audio.play();
          break;
        default:
          notification['warning']({
            duration: duration,
            message: noti.title,
            description:(<span>{noti.body.split('.').map(e=> <p>{e.split(':')[0]} : <span style={{fontWeight:'bold'}}>{e.split(':')[1]}</span></p>)}</span>),
            placement: 'topRight',
            onClick: (() => window.location.assign( message.data.data.link))
          });
          audio = new Audio('http://localhost:3000/tinh.mp3');
          audio.play();
      }
      
      console.log(message.data)
      let arr = message.data.data.link.split("/")
      dispatch(setCameraDetected(null))
      dispatch(setCameraDetected(message.data.data.CreatedBy))
      dispatch(pushNotification({
        Title: noti.title,
        Body: noti.body,
        IsRead: false,
        Id: parseInt(arr[arr.length-1]),
        URL: message.data.data.link,
        CreatedAt: new Date().toString(),
        Type: message.data.data.type
      }))
      setCameraDetected()
      if(message.data.messageType ==='notification-clicked') {
        window.location.assign( message.data.data.link)
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export default initializeFirebase;
