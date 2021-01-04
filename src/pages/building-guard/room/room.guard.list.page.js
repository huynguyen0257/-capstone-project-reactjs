import React, { useState } from "react";
import {
  Layout,
  Select,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Button,
  Descriptions,
  Table,
  Spin,
  Skeleton,
  Card,
  Modal,
  Space,
  Tag,
} from "antd";
import { UserOutlined, ShopOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  getBuildingById,
  updateBuilding,
  getBuildingGuard,
  getStudentsByRoom,
} from "../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import "./building.css";
import Moment from "react-moment";

const { Content } = Layout;
const { Column } = Table;
const { Search } = Input;

function RoomGuardListPage() {
  const [err, setErr] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isView, setView] = React.useState(true);
  const [buildingGuard, setBuildingGuard] = React.useState([]);
  const [buildingDisplay, setBuildingDisplay] = React.useState(null);
  const [roomsDisplay, setRoomsDisplay] = React.useState([]);
  const [roomDisplay, setRoomDisplay] = React.useState(null);
  const [visible, setVisible] = useState(false);
  const [listRoom, setListRoom] = React.useState([]);
  const [floorSearch, setFloorSearch] = React.useState(-1);
  const universityState = useSelector((state) => state.university);
  const buildingState = useSelector((state) => state.building);

  // const onUpdate = (values) => {
  //   setIsLoading(true);
  //   updateBuilding(values)
  //     .then(() => {
  //       setView(true);
  //       setIsLoading(false);
  //       setDone(true);
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //       setErr(true);
  //     });
  // };
  const getRoomDetail = (id) => {
    setIsLoading(true);
    getStudentsByRoom(id).then((res) => {
      setRoomDisplay(res.data);
      setIsLoading(false);
    });
    setVisible(true);
  };
  const searchByCode = (event) => {
    let input = event.target.value;
    let roomSearch = listRoom.filter((room) =>
      room.Code.toLowerCase().includes(input)
    );
    setRoomsDisplay(roomSearch);
  };
  const searchByFloor = (event) => {
    let input = event;
    let floors = [];
    if (input !== -1) {
      floors = listRoom.filter((floor) => floor.Floor === input);
    } else {
      floors = listRoom;
    }
    setFloorSearch(input);
    setRoomsDisplay(floors);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const { Option } = Select;

  var floors_indents = [];
  if (buildingDisplay) {
    for (var i = 0; i < buildingDisplay.NumberOfFloor; i++) {
      floors_indents.push(
        <div>
          {floorSearch === -1 || floorSearch === i + 1 ? (
            <Row gutter={[16, 6]}>
              {roomsDisplay.filter((room) => room.Floor == i + 1).length > 0 ? (
                <Col span={2} style={{ fontWeight: "bold" }}>Floor {i + 1}</Col>
              ) : (
                <div></div>
              )}
              {roomsDisplay
                .filter((room) => room.Floor == i + 1)
                .sort((a, b) => (a.Code > b.Code ? 1 : -1))
                .map((room) => (
                  <Col
                    className="gutter-row"
                    span={2}
                    onClick={() => getRoomDetail(room.Id)}
                  >
                    <Spin spinning={isLoading}>
                      <div
                         className={
                          roomDisplay && roomDisplay.Code === room.Code
                            ? 'room__box active'
                            : room.CurrentStudent === 0 ? 'room__box un_active empty':'room__box un_active'
                        }
                      >
                        <p>
                          <ShopOutlined /> {room.Code.split("-")[2]}
                        </p>
                        <p>
                          <UserOutlined /> {room.CurrentStudent} /{" "}
                          {room.NumberOfStudent}
                        </p>
                      </div>
                    </Spin>
                  </Col>
                ))}
            </Row>
          ) : (
            <Row gutter={[16, 8]}></Row>
          )}
        </div>
      );
    }
  }

  var searchFloor = [];
  searchFloor.push(<Option value={-1}>All</Option>);
  if (buildingDisplay) {
    for (let i = 0; i < buildingDisplay.NumberOfFloor; i++) {
      searchFloor.push(<Option value={i + 1}>Floor {i + 1}</Option>);
    }
  }
  React.useEffect(() => {
    if (buildingState.building) {
      setIsLoading(true);
      getBuildingById(buildingState.building.Id).then((res) => {
        setBuildingDisplay(res.data);
        setRoomsDisplay(res.data.Rooms);
        setListRoom(res.data.Rooms);
        getBuildingGuard().then((res) => {
          setBuildingGuard(res.data);
        });
        setIsLoading(false);
      });
    }
  }, [buildingState.building]);

  return !buildingDisplay ? (
    <Skeleton active />
  ) : (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Building Guard</Breadcrumb.Item>
        <Breadcrumb.Item>Building Detail</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Row>
          <Col span={18}>
            <Card hoverable>
              {!buildingDisplay ? (
                <div></div>
              ) : (
                <Descriptions bordered size="default" font-weight="bold">
                  <Descriptions.Item label="Code">
                    <Tag color="blue">{buildingDisplay.Code}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    <Tag color="blue">{buildingDisplay.Location}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of floors">
                    <Tag color="blue">{buildingDisplay.NumberOfFloor}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of rooms">
                    <Tag color="blue">{buildingDisplay.NumberOfRoom}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Total student">
                    <Tag color="blue">{buildingDisplay.NumberOfStudent}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Manager name">
                    <Tag color="blue">{buildingDisplay.ManagerName}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
            {/* <Col flex={2}> */}
            <div style={{ marginTop: 30 }}>
              {/* <Search
                placeholder="Input room code"
                onChange={(value) => searchByCode(value)}
                style={{ width: 250 }}
                enterButton
              /> */}
              <Select
                onChange={(value) => searchByFloor(value)}
                style={{ width: 250 }}
                placeholder="Search by floor"
              >
                {searchFloor}
              </Select>
            </div>
          </Col>
          <Col span={6} align="center">
            <img width={'80%'} height={150} src={buildingState.building && buildingState.building.ImageUrl && buildingState.building.ImageUrl.length>0 ? buildingState.building.ImageUrl : 'https://vanhoadoanhnghiepvn.vn/wp-content/uploads/2020/08/112815953-stock-vector-no-image-available-icon-flat-vector.jpg'} alt='building' />
          </Col>
        </Row>
        {floors_indents}

        {!roomDisplay ? (
          <div></div>
        ) : (
          <div>
            <Modal
              title="Room information"
              // centered
              visible={visible}
              onOk={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              // onCancel={{hide: () => setVisible(true)}}
              width={1500}
            >
              <p>
                Room code: <Tag color="geekblue">{roomDisplay.Code}</Tag>
              </p>
              <p>
                Floor: <Tag color="cyan">{roomDisplay.Floor}</Tag>
              </p>
              <Table pagination={false} dataSource={roomDisplay.Students}>
                <Column
                  title="No"
                  dataIndex="Id"
                  key="id"
                  render={(id, record, index) => <p>{index + 1}</p>}
                />
                <Column
                  title="Avatar"
                  dataIndex="Avatar"
                  key="Avatar"
                  render={(Avatar) => (
                    <img src={Avatar? Avatar : 'https://vanhoadoanhnghiepvn.vn/wp-content/uploads/2020/08/112815953-stock-vector-no-image-available-icon-flat-vector.jpg'} alt="abc" width={150} height={150} />
                  )}
                />
                <Column title="Full name" dataIndex="FullName" key="FullName" />
                <Column
                  title="Gender"
                  dataIndex="Gender"
                  key="Gender"
                  align="center"
                  render={(Gender) =>
                    Gender === true ? <span>Male</span> : <span>Female</span>
                  }
                />
                <Column title="Phone" dataIndex="Phone" key="Phone" />
                {universityState.universities.length > 0 ? (
                  <Column
                    title="University"
                    key="UniversityId"
                    dataIndex="UniversityId"
                    render={(UniversityId) =>
                      universityState.universities.filter(
                        (r) => r.Id === UniversityId
                      )[0].Name
                    }
                  />
                ) : (
                  <Column />
                )}
                <Column
                  title="Day in"
                  dataIndex="DayIn"
                  key="date"
                  align="center"
                  render={(date) => <Moment format="DD/MM/YYYY">{date}</Moment>}
                />
                <Column
                  title="Day out"
                  dataIndex="DayOut"
                  key="date"
                  align="center"
                  render={(date) => <Moment format="DD/MM/YYYY">{date}</Moment>}
                />
                <Column
                  title="Action"
                  key="Id"
                  align="center"
                  dataIndex="Id"
                  render={(text, record) => (
                    <Space size="middle">
                      <Link to={`/building-guard/student/${record.Id}`}>
                        <Button type="dashed" style={{ margin: 0 }}>
                          View detail
                        </Button>
                      </Link>
                    </Space>
                  )}
                />
              </Table>
            </Modal>
          </div>
        )}
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

export default RoomGuardListPage;
