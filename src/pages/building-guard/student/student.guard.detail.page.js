import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Form,
  Layout,
  Row,
  Select,
  Skeleton,
  Tag,
} from 'antd';
import moment from 'moment';
import React from 'react';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getStudentById } from '../../../services';

const { Content } = Layout;
const { Option } = Select;
function StudentGuardDetailPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const universityState = useSelector((state) => state.university);

  const onUpdate = (values) => {
    if (values.BirthDate) values.BirthDate = values.BirthDate.toDate();
    if (values.DayIn) values.DayIn = values.DayIn.toDate();
    if (values.DayOut) values.DayOut = values.DayOut.toDate();
    setIsLoading(true);
  };
  let { id } = useParams();
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  React.useEffect(() => {
    setIsLoading(true);
    getStudentById(id).then((res) => {
      // console.log
      if (res.data.BirthDate) res.data.BirthDate = moment(res.data.BirthDate);
      if (res.data.DayIn) res.data.DayIn = moment(res.data.DayIn);
      if (res.data.DayOut) res.data.DayOut = moment(res.data.DayOut);
      console.log(res.data.DayOut);
      console.log(res.data.DayIn);
      setUser(res.data);
      setIsLoading(false);
    });
  }, []);

  return !user ? (
    <Skeleton active />
  ) : (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Building guard</Breadcrumb.Item>
        <Breadcrumb.Item>Student</Breadcrumb.Item>
        <Breadcrumb.Item>Student Detail</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{ padding: 24, margin: 0, minHeight: 280 }}
      >
        <Row>
          <Col span={3} />
          <Col span={8}>
            <Row>
              {user.Avatar != null ? (
                <img
                  src={user.Avatar}
                  alt="avatar"
                  style={{
                    width: '300px',
                    height: '300px',
                    margin: '20px',
                  }}
                />
              ) : (
                <Avatar
                  style={{ margin: 20 }}
                  shape="square"
                  size={300}
                  icon={<UserOutlined />}
                />
              )}
            </Row>
            <Row>
              <Col span={8} push={6}></Col>
            </Row>
          </Col>
          <Col span={8}>
            <Form
              initialValues={user}
              onFinish={onUpdate}
              onFinishFailed={onFinishFailed}
              {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
            >
              <div className="site-card-border-less-wrapper">
                <Card hoverable>
                  {!user ? (
                    <div></div>
                  ) : (
                    <Row className="user__card">
                      <Col span={8}>Username:</Col>
                      <Col span={16}>
                        <Tag color="blue">{user.Username}</Tag>
                      </Col>
                      <Col span={8}>Code:</Col>
                      <Col span={16}>
                        {' '}
                        <Tag color="blue">{user.Code}</Tag>
                      </Col>
                      <Col span={8}>Email:</Col>
                      <Col span={16}>
                        {' '}
                        <Tag color="blue">{user.Email}</Tag>
                      </Col>
                      <Col span={8}>Full name:</Col>
                      <Col span={16}>
                        <Tag color="blue">{user.FullName}</Tag>
                      </Col>
                      <Col span={8}>Phone number:</Col>
                      <Col span={16}>
                        <Tag color="blue">{user.Phone}</Tag>
                      </Col>
                      <Col span={8}>Gender:</Col>
                      <Col span={16}>
                        <Tag color="blue">
                          {user.Gender === 1 ? 'Female' : 'Male'}
                        </Tag>
                      </Col>
                      <Col span={8}>Date of birth:</Col>
                      <Col span={16}>
                        <Tag color="blue">
                          <Moment format="DD/MM/YYYY">{user.BirthDate}</Moment>
                        </Tag>
                      </Col>
                      <Col span={8}>Day in:</Col>
                      <Col span={16}>
                        <Tag color="blue">
                          <Moment format="DD/MM/YYYY">{user.DayIn}</Moment>
                        </Tag>
                      </Col>
                      <Col span={8}>Day out:</Col>
                      <Col span={16}>
                        <Tag color="blue">
                          <Moment format="DD/MM/YYYY">{user.DayOut}</Moment>
                        </Tag>
                      </Col>
                      <Col span={8}> University:</Col>
                      <Col span={16}>
                        <Tag color="blue">
                          {universityState.universities.length > 0 ? (
                            universityState.universities.filter(
                              (u) => u.Id === user.UniversityId
                            )[0].Name
                          ) : (
                            <div></div>
                          )}
                        </Tag>
                      </Col>
                    </Row>
                  )}
                </Card>
              </div>
              ,
            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default StudentGuardDetailPage;
