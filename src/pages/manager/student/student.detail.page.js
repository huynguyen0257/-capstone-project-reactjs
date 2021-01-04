import React from "react";
import {
  Layout,
  Select,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Button,
  DatePicker,
  Spin,
  Tabs,
  Skeleton,
  Upload,
  Avatar
} from "antd";
import { NotificationOutlined, HistoryOutlined, PlusOutlined, UserOutlined, SolutionOutlined } from "@ant-design/icons";
import moment from "moment";
import { Link, useParams, useLocation  } from "react-router-dom";
import { getStudentById } from "../../../services";
import { useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { RelativeStudentPage, DangerousCaseIndividual } from '../../index'
import { useHistory } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
function StudentDetailPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const universityState = useSelector((state) => state.university);
  const history = useHistory();

  const onUpdate = (values) => {
    if (values.BirthDate) values.BirthDate = values.BirthDate.toDate();
    if (values.DayIn) values.DayIn = values.DayIn.toDate();
    if (values.DayOut) values.DayOut = values.DayOut.toDate();
    setIsLoading(true);
  };
  let { id } = useParams();
  // let { TabPane } = useParams();
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  let tabPane =new URLSearchParams(useLocation().search).get("tabPane") 


  React.useEffect(() => {
    setIsLoading(true);
    getStudentById(id).then((res) => {
      if (res.data.BirthDate) res.data.BirthDate = moment(res.data.BirthDate);
      if (res.data.DayIn) res.data.DayIn = moment(res.data.DayIn);
      if (res.data.DayOut) res.data.DayOut = moment(res.data.DayOut);
      setUser(res.data);
      setIsLoading(false);
    })
    .catch(e =>{
      history.push('/manager/404');
    });
  }, []);

  return !user ? (
    <Skeleton active />
  ) : (
      <Layout style={{ padding: "0 24px 24px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Manager</Breadcrumb.Item>
          <Breadcrumb.Item>Student</Breadcrumb.Item>
          <Breadcrumb.Item>Student Detail</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{ padding: 24, margin: 0, minHeight: 280 }}
        >
        <Row justify="center">
            <Col span={8} className={"user__card"}>
              <Row>
                <Col span={12}>Code:</Col>
                <Col className={"content"} span={12}>
                  {user.Code}
                </Col>
              </Row>
              <Row>
                <Col span={12}>Full name:</Col>
                <Col className={"content"} span={12}>
                  {user.FullName}
                </Col>
              </Row>
            </Col>
        </Row>
          <Tabs defaultActiveKey={tabPane?tabPane:1}>
            <TabPane
              tab={
                <span>
                  <NotificationOutlined />
                Information
              </span>
              }
              key="1"
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
                          width: "300px",
                          height: "300px",
                          margin: "20px",
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
                    <Col span={8} push={6}>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Form
                    initialValues={user}
                    onFinish={onUpdate}
                    onFinishFailed={onFinishFailed}
                    {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
                  >
                    <Form.Item name="Id" style={{ display: "none" }}>
                      <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Username" name="Username">
                      <Input disabled={true} />
                    </Form.Item>
                    <Form.Item label="Code" name="Code">
                      <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name="Email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                      ]}
                    >
                      <Input disabled={true} />
                    </Form.Item>

                    <Form.Item
                      label="Full name"
                      name="FullName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your full name!",
                        },
                      ]}
                    >
                      <Input disabled={true} />
                    </Form.Item>

                    <Form.Item
                      label="Phone number"
                      name="Phone"
                      rules={[
                        {
                          required: true,
                          message: "Please input your phone number!",
                        },
                        {
                          pattern: /^\d{10}$/,
                          message:
                            'Phone number cannot contain text and must be 10 characters!',
                        },
                      ]}
                    >
                      <Input disabled={true} />
                    </Form.Item>

                    <Form.Item
                      label="Gender"
                      name="Gender"
                      rules={[
                        {
                          required: true,
                          message: "Please input your gender!",
                        },
                      ]}
                    >
                      <Select style={{ width: 270 }} disabled={true}>
                        <Option value={true}>Male</Option>
                        <Option value={false}>Female</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Room"
                      name="RoomCode"
                      rules={[
                        {
                          required: true,
                          message: "Please input your room!",
                        },
                      ]}
                    >
                      <Select style={{ width: 270 }} disabled={true}>
                        <Option value={true}>Male</Option>
                        <Option value={false}>Female</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="University"
                      name="UniversityId"
                      rules={[
                        {
                          required: true,
                          message: "Please input your University!",
                        },
                      ]}
                    >
                      <Select style={{ width: 270 }} disabled={true}>
                        {universityState.universities.map((u) => (
                          <Option value={u.Id}>{u.Name}</Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Date of birth"
                      name="BirthDate"
                      rules={[
                        {
                          required: true,
                          message: "Please input your day of birth!",
                        },
                      ]}
                    >
                      <DatePicker disabled={true} style={{ width: 270 }} format="DD/MM/YYYY"/>
                    </Form.Item>

                    <Form.Item label="Day In" name="DayIn">
                      <DatePicker disabled={true} style={{ width: 270 }} format="DD/MM/YYYY"/>
                    </Form.Item>

                    <Form.Item label="Day Out" name="DayOut">
                      <DatePicker disabled={true} style={{ width: 270 }} format="DD/MM/YYYY"/>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Row justify="center">
                <Col>
                  {user.IsActive ? (
                    <Link to={`/manager/user/${user.UserId}?Edit=true`}>
                    <Button
                      danger
                      htmlType="button"
                    >
                      Edit
                      </Button>
                  </Link>
                  ):(
                    <Button
                      danger
                      htmlType="button"
                      disabled={true}
                    >
                      User are deactivated
                      </Button>
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <HistoryOutlined />
                Dangerous case
              </span>
              }
              key="2"
            >
              <DangerousCaseIndividual />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SolutionOutlined />
                Relatives
              </span>
              }
              key="3"
            >
              <RelativeStudentPage />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
}

export default StudentDetailPage;
