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
  Avatar,
  Upload,
  AutoComplete,
} from "antd";
import {
  UserOutlined,
  FileExcelOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { useLocation } from "react-router-dom";
import { createUser, getRooms, uploadUserAvatar } from "../../../services";
import { useSelector, useDispatch } from "react-redux";
import { setUniversities } from "../../../redux";
import { getUniversities } from "../../../services";

const { Content } = Layout;
const { Option } = Select;
function UserProfilePage() {
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);

  const [isStudent, setIsStudent] = React.useState(false);
  const roleState = useSelector((state) => state.role);
  const buildingState = useSelector((state) => state.building);
  const [form] = Form.useForm();
  const universityState = useSelector((state) => state.university);
  const [imageUpload, setImageUpload] = React.useState(null);

  const dispatch = useDispatch();
  const location = useLocation();

  React.useEffect(() => {
    if (location.search.includes("student=true")) {
      setIsStudent(true);
      if (roleState.roles.filter((role) => role.Name == "Student").length > 0) {
        form.setFieldsValue({
          RoleId: roleState.roles.filter((role) => role.Name == "Student")[0]
            .Id,
        });
      }
    }
  }, [roleState]);
  const onFinish = (values) => {
    console.log(values);
    if (values.BirthDate) values.BirthDate = values.BirthDate.toDate();
    if(values.ConfirmPassword !== values.Password) {
      setErr("Confirm password is not matched")
      return;
    }
    setIsLoading(true);
    createUser(values)
      .then((res) => {
        if (imageUpload) {
          const file = imageUpload;
          const fd = new FormData();
          fd.append("avatarImage", file, file.name);
          uploadUserAvatar(fd, res.data.Id)
            .then((res) => {
              setIsLoading(false);
              setDone(true);
            })
            .catch((err) => {
              setIsLoading(false);
              setErr(err.response.data.message);
            });
        } else {
          setIsLoading(false);
          setDone(true);
        }
        if (isStudent) {
          console.log(res.data.UniversityId);
          if (
            universityState.universities.filter(
              (r) => r.Id === res.data.UniversityId
            ).length === 0
          ) {
            getUniversities().then((res) => {
              dispatch(setUniversities(res.data));
            });
          }
        }
      })
      .catch((e) => {
        setErr(e.response.data.message);
        setIsLoading(false);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const selectRoleChange = (value) => {
    if (
      roleState.roles.filter((role) => role.Id === value)[0].Name == "Student"
    )
      setIsStudent(true);
    else setIsStudent(false);
  };
  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Create</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{ padding: 24, margin: 0, minHeight: 280 }}
      >
        <Row>
          <Col span={3} />
          <Col span={8}>
            <Row justify="center">
              <Avatar
                style={{ margin: 20 }}
                shape="square"
                size={250}
                icon={<UserOutlined />}
              />
            </Row>
            <Row justify="center">
              <Col span={6}>
                <Upload
                  // style={{width: '100px', height: '100px'}}
                  accept={".png,.jpeg,.jpg"}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={(file) => {
                    setImageUpload(file);
                  }}
                  onRemove={() => {
                    setImageUpload(null);
                  }}
                >
                  {imageUpload ? null : (
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
              form={form}
              initialValues={{
                Gender: true,
                BirthDate: moment("1998-10-10"),
                Password: "123456",
                ConfirmPassword: "123456"
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
            >
              <Form.Item
                label="Username"
                name="Username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                  { type: "email", message: "Email in invalid format!" },
                ]}
              >
                <Input
                  onChange={(e) => {
                    console.log(e);
                    form.setFieldsValue({
                      Email: e.target.value,
                    });
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                  { type: "email", message: "Email in invalid format!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input Password!",
                  },
                  {
                    min: 6,
                    message: "Password must at least 6 characters",
                  },
                  {
                    max: 128,
                    message: "Password must not exceed 128 characters",
                  },
                ]}
              >
                <Input.Password placeholder="input password" />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="ConfirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input Confirm Password!",
                  },
                  {
                    min: 6,
                    message: "Password must at least 6 characters",
                  },
                  {
                    max: 128,
                    message: "Password must not exceed 128 characters",
                  },
                ]}
              >
                <Input.Password placeholder="input password" />
              </Form.Item>

              <Form.Item
                label="Full name"
                name="FullName"
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                  {
                    min: 6,
                    message: "Full name must at least 6 characters",
                  },
                  {
                    max: 100,
                    message: "Full name must not exceed 100 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Code"
                name="Code"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                  {
                    pattern: /^[A-Za-z0-9-]{3,20}$/,
                    message:
                      "The code contain (3 - 20) characters of [a-zA-Z0-9]!",
                  },
                ]}
              >
                <Input />
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
                      "Phone number cannot contain text and must be 10 characters!",
                  },
                ]}
              >
                <Input />
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
                <Select style={{ width: 300 }}>
                  <Option value={true}>Male</Option>
                  <Option value={false}>Female</Option>
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
                <Select
                  onChange={(value) => selectRoleChange(value)}
                  style={{ width: 300 }}
                >
                  {roleState.roles.map((role) => (
                    <Option value={role.Id}>{role.Name}</Option>
                  ))}
                </Select>
              </Form.Item>
              {isStudent ? (
                <>
                  <Form.Item
                    label="Building"
                    name="BuildingId"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Building!",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: 300 }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(value) => {
                        if (value) {
                          getRooms({ BuildingId: value }).then((res) => {
                            setRooms(res.data);
                          });
                        }
                      }}
                      placeholder="Select a building"
                    >
                      {buildingState.buildings.map((u) => (
                        <Option value={u.Id}>{u.Code}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Room"
                    name="RoomId"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Room!",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: 300 }}
                      placeholder="Select a room"
                      disabled={rooms.length === 0}
                    >
                      {rooms.map((u) => (
                        // <Option value={u.Id} style={}><Text>{u.Code}</Text></Option>
                        <Option
                          value={u.Id}
                          style={
                            u.Gender != null
                              ? u.Gender === true
                                ? { color: "blue" }
                                : { color: "pink" }
                              : {}
                          }
                        >
                          {u.Code}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              ) : (
                <div></div>
              )}
              {isStudent ? (
                <Form.Item
                  label="University Code"
                  name="UniversityId"
                  rules={[
                    {
                      required: true,
                      message: "Please input your University!",
                    },
                    {
                      min: 3,
                      message: "University code must at least 3 characters",
                    },
                    {
                      max: 7,
                      message: "University code must not exceed 7 characters",
                    },
                    {
                    pattern: /^[A-Z0-9]{3,}$/,
                    message:
                      "The code is invalid. Check this code in here: https://diemthi.tuyensinh247.com/danh-sach-truong-dai-hoc-cao-dang.html",
                  },
                  ]}
                >
                  <AutoComplete
                    options={universityState.universities.map((u) => {
                      return { value: u.Name };
                    })}
                    style={{
                      width: 300,
                    }}
                  />
                  {/* <Select style={{ width: 120 }}>
                    {universityState.universities.map((u) => (
                      <Option value={u.Id}>{u.Name}</Option>
                    ))}
                  </Select> */}
                </Form.Item>
              ) : (
                <div></div>
              )}
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
                <DatePicker disabledDate={(current) => current && current > moment().subtract(18, 'years').set('month', 11).set('date', 31)} style={{ width: 300 }} />
              </Form.Item>

              <Form.Item
                {...{
                  wrapperCol: {
                    offset: 8,
                    span: 16,
                  },
                }}
              >
                <Spin spinning={isLoading}>
                  <Button type="primary" htmlType="submit">
                    Create
                  </Button>
                </Spin>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
      <SweetAlert
        show={done}
        success
        title="Create user success"
        onConfirm={() => {
          setDone(false);
          window.history.back();
        }}
      />
      <SweetAlert
        show={err.length > 0}
        error
        title={err}
        onConfirm={() => setErr("")}
      />
    </Layout>
  );
}

export default UserProfilePage;
