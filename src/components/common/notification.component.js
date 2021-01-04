import React, { Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Card, Row, Col, Tag } from "antd";
import { readNotification, readAllNotification } from "../../services";
import { updateIsRead, updateIsReadAll } from "../../redux";
import NotificationTimeComponent from "./notification.time.component";
import { useHistory } from "react-router-dom";
import "./notification.css";
import {
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  AlertTwoTone,
  ExclamationCircleTwoTone
} from "@ant-design/icons";
export default function Notification() {
  const history = useHistory();
  const notiState = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const onClick = (item) => {
    switch (item.Type) {
      case "0": message.success(item.Title); break;
      case "1":
      case "2": message.error(item.Title); break;
      case "3": message.warning(item.Title); break;
      default: message.warning(item.Title);
    }
    
    if (!item.IsRead) {
      readNotification(item.Id).then(() => {
        dispatch(updateIsRead(item.Id));
      });
    }
    history.push(item.URL);
  };

  const allRead = () => {
    readAllNotification().then(() => {
      dispatch(updateIsReadAll())
    })
  }

 

  const notificationIcon = (type) => {
    switch (type) {
      //success_message
      case "0": return (
        <CheckCircleTwoTone style={{fontSize:28}} twoToneColor="#8CB369" />
      );
      //fail_message
      case "1": return (
        <CloseCircleTwoTone style={{fontSize:28}} twoToneColor="#BC4B51" />
      );
      //dangerous_case_message
      case "2": return (
        <AlertTwoTone style={{fontSize:28}} twoToneColor="#C86A6F"/>
      );
      //warining_case_message
      case "3": return (
        <ExclamationCircleTwoTone  style={{fontSize:28}} twoToneColor="#F4E285"/>
      );
      default: return  (
        <CloseCircleTwoTone style={{fontSize:28}} twoToneColor="#BC4B51" />
      );
    }
  }

  if (notiState.notifications.length > 0) {
    return (
      <div style={{ maxHeight: "700px", width: "500px", overflow: "scroll" }}>
      <Row style={{background:'whitesmoke',}} >
        <Col span={22} align="right">
          <p onClick={allRead} className='mark_all_read'>Mark all read</p>
        </Col>
      </Row>
        {notiState.notifications.map((item) => (
          <div
            key={item.Id}
            className={
              item.IsRead ? "notification__card notification__card__read" : "notification__card"
            }
          >
            <Row type="flex" align="middle">
              <Col span={6} align="center">
                {notificationIcon(item.Type)}
                </Col>
              <Col span={18}>
                <Card
                  onClick={() =>
                    onClick(item)
                  }
                  title={item.Title}
                  bordered={false}
                  extra={<NotificationTimeComponent time={item.CreatedAt} />}
                >
                  {item.Body}
                </Card>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    );
  } else
    return (
      <div>
        <Card
          style={{ width: 300 }}
          title="Notification is empty"
          bordered={false}
        >
          Nothing to show
        </Card>
      </div>
    );
}
