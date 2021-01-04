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
  Skeleton,
  Upload,
  Avatar,
  
} from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { checkToken, updateUser, uploadAvatar } from "../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import "./ant.css";
import { useHistory } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;
function UserProfilePage(props) {
  const [err, setErr] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reloadPage, setReloadPage] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const roleState = useSelector((state) => state.role);
  const [isView, setView] = React.useState(true);
  const [imageUpload, setImageUpload] = React.useState(null);

  console.log()
  const onUpdate = (values) => {
    if (values.BirthDate) values.BirthDate = values.BirthDate.toDate();
    // Validate date
    
    setIsLoading(true);
    updateUser(values)
      .then(() => {
        if (imageUpload) {
          // const file = imageUpload.file.originFileObj;
          const file = imageUpload;
          const fd = new FormData();
          fd.append("avatarImage", file, file.name);
          uploadAvatar(fd)
            .then((res) => {
              setReloadPage(true);
              setImageUpload(null);
              setUser({ ...user, Avatar: res.data.Link });
              setView(true);
              setIsLoading(false);
              setDone(true);
              setReloadPage(false);
            })
            .catch((err) => {
              setErr(true);
              console.error(err.message);
              setIsLoading(false);
            });
        } else {
          setView(true);
          setIsLoading(false);
          setDone(true);
        }
      })
      .catch((err) => {
        setErr(true);
        console.error(err.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const history = useHistory();

  React.useEffect(() => {

    setIsLoading(true);
    checkToken().then((res) => {
      if (res.data.BirthDate) res.data.BirthDate = moment(res.data.BirthDate);
      setUser(res.data);
      setIsLoading(false);
      console.log(res.data);
    }).catch(e=>{
      history.push('no_internet_connection');
      
    });
  }, []);

  return !user || reloadPage ? (
    <Skeleton active />
  ) : (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
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
                  style={{ width: "300px", height: "300px", margin: "20px"}}
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
                <Upload
                  accept={".png,.jpeg,.jpg"}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  style={{ width: "100%", height: "300px" }}
                  beforeUpload={(file) => {
                    setImageUpload(file);
                  }}
                  onRemove={() => {
                    setImageUpload(null);
                  }}
                >
                  {imageUpload || isView ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Change avatar</div>
                    </div>
                  )}
                </Upload>
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
                  { type: 'email', message: 'is not a valid email!' },
                ]}
              >
                <Input disabled={isView} />
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
                <Input disabled={isView} />
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
                    message: "Phone number cannot contain text and length must be equal to 10 characters",
                  },
                ]}
              >
                <Input disabled={isView} />
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
                <Select
                  defaultValue="male"
                  style={{ width: 280 }}
                  disabled={isView}
                >
                  <Option value={true}>male</Option>
                  <Option value={false}>female</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Role"
                name="RoleId"
                rules={[
                  {
                    required: true,
                    message: "Please input your Role!",
                  },
                ]}
              >
                <Select style={{ width: 280 }} disabled={true}>
                  {roleState.roles.map((role) => (
                    <Option value={role.Id}>{role.Name}</Option>
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
                <DatePicker style={{ width: 280 }} disabled={isView} />
              </Form.Item>

              <Form.Item
                {...{
                  wrapperCol: {
                    offset: 8,
                    span: 16,
                  },
                }}
              >
                {!isView ? (
                  <Spin spinning={isLoading}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Spin>
                ) : (
                  ""
                )}
                {isView ? (
                  <Button
                    danger
                    htmlType="button"
                    onClick={() => setView(false)}
                  >
                    Edit
                  </Button>
                ) : (
                  ""
                )}
                {props.buildingGuard ? (<></>): (<Link to="/manager/change-password">
                  <Button type="ghost" htmlType="button">
                    Change Password
                  </Button>
                </Link>)}
                
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
      <SweetAlert
        show={done}
        success
        title="Update success"
        onConfirm={() => setDone(false)}
      />
      <SweetAlert
        show={err}
        error
        title="Update failed"
        onConfirm={() => setErr(false)}
      />
    </Layout>
  );
}

export default UserProfilePage;
