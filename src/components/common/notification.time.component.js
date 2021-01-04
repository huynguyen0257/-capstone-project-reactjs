import React from 'react'
import Moment from 'react-moment';
import 'moment-timezone'
import moment from "moment";
import { Typography, Tag } from 'antd';

const { Text, Link } = Typography;
function NotificationTimeComponent(props) {
    return (
        <Tag color='blue'>{moment(props.time).fromNow()}</Tag>
    )
}

export default NotificationTimeComponent
