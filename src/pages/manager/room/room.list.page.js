import React from "react";
import {
  Layout,
  Breadcrumb,
  message,
  Table,
  Typography,
  Space,
  Input,
  Select,
  Row,
  Col,
  Button,
  Spin,
  Alert,
} from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getRooms as fetchRooms,
} from "../../../services";
const { Column } = Table;
const { Text } = Typography;
const { Content } = Layout;
const data = [];

const { Search } = Input;
const { Option } = Select;

function RoomListPage() {
  const [roomDisplay, setRoomDisplay] = React.useState([]);
  const [listRooms, setListRooms] = React.useState([])

  // initial | constructor
  React.useEffect(() => {
    fetchRooms().then((res) => {
        setListRooms(res.data)
      setRoomDisplay(res.data)
      
    });
  }, []);

  const search = (event) => {
    let input = event.target.value
    let roomSearch = listRooms.filter((room) =>
    room.Code.toLowerCase().includes(input)
    );
    setRoomDisplay(roomSearch)
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>List Room in Dorm</Breadcrumb.Item>
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
          <Col span={8}>
          <Search
              placeholder="Input code of room"
              onChange={(value) => search(value)}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
          <Col span={2}>

          </Col>
          <Col span={7}>
          </Col>
          <Col span={3}>

          </Col>
          <Col span={4}>
            <Link to={"/manager/room/create"}>
              <Button type="primary"> + Import from excel </Button>{" "}
            </Link>
          </Col>
        </Row>

        <div>
          <Table dataSource={roomDisplay} rowKey="Id">
            <Column title="Code" dataIndex="Code" key="Code" align="center"  />
            <Column title="Floor" dataIndex="Floor" key="Floor" align="center" />
            <Column title="Number Of Student" dataIndex="NumberOfStudent" key="NumberOfStudent" align="center" />
            <Column title="Current student" dataIndex="CurrentStudent" key="CurrentStudent" align="center" />
            <Column title="Building Code" dataIndex="BuildingCode" key="BuildingCode"  align="center"/>
          </Table>
        </div>
      </Content>
    </Layout>
  );
}

export default RoomListPage;
