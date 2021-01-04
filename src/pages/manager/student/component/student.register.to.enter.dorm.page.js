import React, { Component } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Breadcrumb,
  Radio,
  Skeleton,
  Spin,
} from "antd";
import { DatePicker, Space } from "antd";
import { ImportOutlined } from "@ant-design/icons";
import moment from "moment";
import { Row, Col } from "antd";
import { Link, useParams } from "react-router-dom";
import {
  getStudentById,
  getBuildings,
  getBuildingById,
  getRooms,
} from "../../../../services";
import { setBuildings, setRooms, submitRegisterIntoDorm } from "../../../../redux";
import { useSelector, useDispatch } from "react-redux";

const { Content } = Layout;

const tailLayout = {
  wrapperCol: {
    offset: 11,
    span: 10,
  },
};
const { Option } = Select;

function RegisterToEnterDormPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [student, setStudent] = React.useState(null);
  const roomState = useSelector((state) => state.room);
  const buildingState = useSelector((state) => state.building);
  const universityState = useSelector((state) => state.university);
  const [roomsDisplay, setRoomsDisplay] = React.useState([]);
  const studentState = useSelector((state) => state.student);
  //user redux
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  let { id: studentId } = useParams();

  React.useEffect(() => {
    setIsLoading(true);
    getStudentById(studentId).then((res) => {
      console.log(res.data);
      if (res.data.DayIn) res.data.DayIn = moment(res.data.DayIn);
      if (res.data.DayOut) res.data.DayOut = moment(res.data.DayOut);
      if (universityState.universities.length > 0) {
        res.data.University = universityState.universities.filter(
          (r) => r.Id === res.data.UniversityId
        )[0].Name;
      }
      setStudent(res.data);
      form.setFieldsValue(res.data);
      getBuildings().then((res) => {
        dispatch(setBuildings(res.data));
      });
      getRooms().then((res) => {
        dispatch(setRooms(res.data));
      });

      setIsLoading(false);
    });
  }, [universityState.universities]);

  const changeRoomDisplay = (value) => {
    setRoomsDisplay(
      roomState.rooms.filter((room) => room.BuildingId === value)
    );
  };

  const onUpdate = (values) => {
    dispatch(submitRegisterIntoDorm(values));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return !student ? (
    <Skeleton active />
  ) : (
    <Layout>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Form
          form={form}
          initialValues={student}
          onFinish={onUpdate}
          onFinishFailed={onFinishFailed}
          {...{ labelCol: { span: 6 }, wrapperCol: { span: 10 } }}
        >
          <Form.Item name="Id" style={{ display: "none" }}>
            <Input type="text" />
          </Form.Item>
          {/* Ch need this field to update face image :) do not delete line 130,132,132 */}
          <Form.Item name="UserId" style={{ display: "none" }}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Full name" name="FullName">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item label="Code" name="Code">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item label="University" name="University">
            <Input disabled={true} />
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
            <Select style={{ width: 240 }} onChange={changeRoomDisplay}>
              {buildingState.buildings.map((u) => (
                <Option value={u.Id}>{u.Code}</Option>
              ))}
            </Select>
          </Form.Item>
       
          <Form.Item
            name="RoomId"
            label="Room"
            rules={[
              {
                required: true,
                message: "Please input your Room!",
              },
            ]}
          >
            {roomsDisplay.length > 0 ? (
              <Select style={{ width: 240 }}>
                {roomsDisplay.map((u) => (
                  <Option value={u.Id}>{u.Code}</Option>
                ))}
              </Select>
            ) : (
              <Select style={{ width: 240 }} disabled={true}></Select>
            )}
          </Form.Item>
          <Form.Item
            label="Day In"
            name="DayIn"
            rules={[
              {
                required: true,
                message: "Please input your day in!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Day Out"
            name="DayOut"
            rules={[
              {
                required: true,
                message: "Please input your day out!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Spin spinning={isLoading}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: 200, "margin-left": -100 }}
              >
                Submit
              </Button>
            </Spin>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
export default RegisterToEnterDormPage;
