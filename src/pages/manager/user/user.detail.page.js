import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Skeleton,
  Spin,
  Upload,
} from "antd";
import moment from "moment";
import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  getRooms,
  getStudentsByRoom,
  getUserById,
  updateUser,
  uploadUserAvatar,
} from "../../../services";
import { useHistory } from "react-router-dom";

const { Content } = Layout;
const { Option } = Select;
function UserProfilePage() {
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reloadPage, setReloadPage] = React.useState(false);
  const [isView, setView] = React.useState(true);
  const [rooms, setRooms] = React.useState([]);
  const [currentRoom, setCurrentRoom] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [isStudent, setIsStudent] = React.useState(false);
  const roleState = useSelector((state) => state.role);
  const universityState = useSelector((state) => state.university);
  const buildingState = useSelector((state) => state.building);
  const [imageUpload, setImageUpload] = React.useState(null);
  const [dayOut, setDayOut] = React.useState(null);
  const history = useHistory();

  const onUpdate = (values) => {
    if (values.BirthDate) {
      values.BirthDate = values.BirthDate.toDate();
      if (
        !values.BirthDate ||
        typeof values.BirthDate !== typeof new Date() ||
        values.BirthDate.getFullYear() < 1950 ||
        values.BirthDate.getFullYear() > new Date().getFullYear() - 18
      ) {
        setErr(
          `The birth date is invalidate The year in range(1950-${
            new Date().getFullYear() - 18
          })`
        );
        return;
      }
    }
    setIsLoading(true);
    updateUser(values)
      .then(() => {
        if (imageUpload) {
          console.log(imageUpload);
          // const file = imageUpload.file.originFileObj;
          const file = imageUpload;
          const fd = new FormData();
          fd.append("avatarImage", file, file.name);
          uploadUserAvatar(fd, values.Id)
            .then((res) => {
              setReloadPage(true);
              setUser({ ...user, Avatar: res.data.Link });
              setImageUpload(null);
              setView(true);
              setIsLoading(false);
              setDone(true);
              setReloadPage(false);
            })
            .catch((err) => {
              setView(true);
              setIsLoading(false);
              setErr(err.response.data.message);
            });
        } else {
          setView(true);
          setIsLoading(false);
          setDone(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setErr(err.response.data.message);
        setIsLoading(false);
      });
  };

  let { id } = useParams();
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const location = useLocation();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (roleState.roles.length > 0 && buildingState.buildings.length > 0) {
      setIsLoading(true);
      getUserById(id)
        .then((res) => {
          if (res.data.BirthDate)
            res.data.BirthDate = moment(res.data.BirthDate);
          console.log(res.data);
          setUser(res.data);
          setIsLoading(false);
          if (res.data.RoomId) {
            getStudentsByRoom(res.data.RoomId).then((_res) => {
              setCurrentRoom(_res.data);
              console.log(_res.data.BuildingId);
              form.setFieldsValue({ BuildingId: _res.data.BuildingId });
              getRooms({ BuildingId: _res.data.BuildingId }).then((res) => {
                setRooms(res.data);
              });
            });
          }
        })
        .catch((e) => {
          history.push("/manager/404");
        });
      console.log(location.search.includes("Edit=true"));
      if (location.search.includes("Edit=true")) {
        setIsStudent(true);
        if (
          roleState.roles.filter((role) => role.Name === "Student").length > 0
        ) {
          form.setFieldsValue({
            RoleId: roleState.roles.filter((role) => role.Name === "Student")[0]
              .Id,
          });
        }
      }

      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      var c = new Date(year + 4, month, day);
      setDayOut(moment(c, "DD/MM/YYYY"));
      // form.setFields(DayOut:c)
      form.setFieldsValue({
        DayOut: moment(c, "DD/MM/YYYY"),
      });
    }
  }, [roleState, buildingState]);

  // return !user || (isStudent && !currentRoom) || reloadPage ? (
  return !user || reloadPage ? (
    <Skeleton active />
  ) : (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>User Detail</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{ padding: 24, margin: 0, minHeight: 280 }}
      >
        <Row>
          <Col span={3} />
          <Col span={8}>
            <Row justify="center">
              {user.Avatar != null ? (
                <img
                  src={user.Avatar}
                  alt="avatar"
                  style={{ width: "300px", height: "300px", margin: "20px" }}
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
              <Col span={6} push={8}>
                <Upload
                  // style={{width: '100px', height: '100px'}}
                  accept={".png,.jpeg,.jpg"}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  // fileList={[imageUpload]}
                  beforeUpload={(file) => {
                    setImageUpload(file);
                  }}
                  onRemove={() => {
                    setImageUpload(null);
                  }}
                >
                  {imageUpload || (isView && !isStudent) ? null : (
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
              initialValues={user}
              onFinish={onUpdate}
              onFinishFailed={onFinishFailed}
              {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
            >
              {isStudent ? (
                <div>
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
                      { type: "email", message: "is not a valid email!" },
                    ]}
                  >
                    <Input />
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
                    <Select style={{ width: 270 }} disabled={true}>
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
                    <Select style={{ width: 270 }} disabled={true}>
                      {roleState.roles.map((role) => (
                        <Option value={role.Id}>{role.Name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
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
                      style={{ width: 150 }}
                      // defaultValue={currentRoom.BuildingId}
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
                        // <Option value={u.Id}>{currentRoom? currentRoom.BuildingId : 0}</Option>
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
                      style={{ width: 150 }}
                      showSearch
                      placeholder="Select a room"
                      disabled={rooms.length === 0}
                    >
                      {rooms.length > 0 ? (
                        rooms.map((u) => (
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
                        ))
                      ) : currentRoom ? (
                        <Option value={currentRoom.Id}>
                          {currentRoom.Code}
                        </Option>
                      ) : (
                        <></>
                      )}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="DayOut"
                    name="DayOut"
                    rules={[
                      {
                        required: true,
                        message: "Please select day out!",
                      },
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" defaultValue={dayOut} />
                  </Form.Item>

                  {roleState.roles.length > 0 &&
                  roleState.roles.filter((r) => r.Id == user.RoleId)[0].Name ==
                    "Student" ? (
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
                      <Select style={{ width: 270 }}>
                        {universityState.universities.map((u) => (
                          <Option value={u.Id}>{u.Name}</Option>
                        ))}
                      </Select>
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
                    <DatePicker
                      disabledDate={(current) =>
                        current &&
                        current >
                          moment()
                            .subtract(18, "years")
                            .set("month", 11)
                            .set("date", 31)
                      }
                      format="DD/MM/YYYY"
                    />
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
                        Submit
                      </Button>
                    </Spin>
                  </Form.Item>
                </div>
              ) : (
                <div>
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
                    rules={[]}
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                      { type: "email", message: "is not a valid email!" },
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
                        message:
                          "Phone number cannot contain text and must be 10 characters!",
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
                    <Select style={{ width: 270 }} disabled={true}>
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
                    <Select style={{ width: 270 }} disabled={true}>
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
                    <DatePicker
                      format="DD/MM/YYYY"
                      disabled={isView}
                      style={{ width: 270 }}
                    />
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
                    ) : 
                    // user.IsActive ? (
                    //   <Link to={`/manager/user-register-face/${id}`}>
                    //     <Button type="primary" htmlType="submit">
                    //       Register face
                    //     </Button>
                    //   </Link>
                    // ) : 
                    (
                      <></>
                    )}
                    {isView && user.IsActive ? (
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
                  </Form.Item>
                </div>
              )}
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
        show={err.length > 0}
        error
        title={err}
        onConfirm={() => setErr("")}
      />
    </Layout>
  );
}

export default UserProfilePage;
