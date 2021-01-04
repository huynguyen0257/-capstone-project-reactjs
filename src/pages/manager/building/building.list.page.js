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
  Modal,
  Upload,
  Skeleton,
} from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import XLSX from "xlsx";
import { environment } from "../../../environment/env";
import "./building.css";
import {
  getBuildings as fetchBuildings,
  createListBuilding,
  getSecurityMans,
} from "../../../services";
const { Column } = Table;
const { Text } = Typography;
const { Content } = Layout;
var b_data = [];
var r_data = [];

const { Search } = Input;
const { Option } = Select;

function BuildingListPage() {
  const [done, setDone] = React.useState("");
  const [err, setErr] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [buildingDisplay, setBuildingDisplay] = React.useState([]);
  const [listBuilding, setListBuilding] = React.useState([]);
  const [fileUpload, setFileUpload] = React.useState(null);
  const [roomData, setRoomData] = React.useState(null);
  const [buildingData, setBuildingData] = React.useState(null);
  const [modelVisible, setModelVisible] = React.useState(false);

  // initial | constructor
  React.useEffect(() => {
    fetchBuildings().then((res) => {
      setListBuilding(res.data);
      setBuildingDisplay(res.data);
    });
  }, []);

  const search = (event) => {
    let input = event.target.value;
    let buildingSearch = listBuilding.filter((building) =>
      building.Code.toLowerCase().includes(input.toLowerCase())
    );
    setBuildingDisplay(buildingSearch);
  };

  const uploadFile = () => {
    if (fileUpload) {
      /* Update state */
      setIsLoading(true);
      createListBuilding({ Room: roomData, Building: buildingData })
        .then((result) => {
          setDone(result.data.message);
        })
        .catch((res) => {
          setErr(res.response.data.message);
        });
      setModelVisible(false);
      setIsLoading(false);
    }
  };

  const showDataInFile = () => {
    if (fileUpload) {
      /* Boilerplate to set up FileReader */
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {
          type: rABS ? "binary" : "array",
          bookVBA: true,
        });
        /* Get first worksheet */
        const wsRoomName = wb.SheetNames[0];
        const wsBuildingName = wb.SheetNames[1];
        const wsRoom = wb.Sheets[wsRoomName];
        const wsBuilding = wb.Sheets[wsBuildingName];
        /* Convert array of arrays */
        r_data = XLSX.utils.sheet_to_json(wsRoom, { range: 1 });
        setRoomData(r_data);
        b_data = XLSX.utils.sheet_to_json(wsBuilding, { range: 1 });
        // VALIDATION
        for (let room of r_data) {
          if (![0, 3, 4, 6, 8, 10].includes(room.NumberOfStudent)) {
            setErr(`Error at ${room.RoomNumber}, No ${room.No}. The number of student is valid`)
            return {};
          }
        }
        //Show data to modal
        b_data.map((building) => {
          // console.log(building.Code);
          building.Rooms = r_data.filter(
            (room) => room.BuildCode === building.Code
          );
          building.Rooms.map((room) => {
            room.Code = `${room.BuildCode}-${room.Floor}-${room.RoomNumber}`;
            room.CurrentStudent = 0;
          });
          building.NumberOfStudent = building.Rooms.reduce(
            (sum, current) => sum + current.NumberOfStudent,
            0
          );
          building.NumberOfRoom = building.Rooms.length;
          building.NumberOfFloor = building.Rooms.reduce(
            (max, current) => (max = max > current.Floor ? max : current.Floor),
            0
          );
        });
        console.log(b_data);
        setBuildingData(b_data);
      };
      if (rABS) {
        reader.readAsBinaryString(fileUpload);
        setModelVisible(true);
      } else {
        reader.readAsArrayBuffer(fileUpload);
      }
    }
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Modal
        className={'full__size'}
        title="Preview data of building excel"
        visible={modelVisible}
        onOk={uploadFile}
        onCancel={() => setModelVisible(false)}
      >
        {buildingData && buildingData.length > 0 ? (
          <Row>
            <Col span={24}>Total Building: <Text mark>{buildingData.length} Building </Text></Col>
            <Col span={24}>
              Total Size: <Text mark>{buildingData.map(e => e.NumberOfStudent).reduce(
              (a, b) => a + b
            )} Students </Text>
            </Col>
          </Row>
        ) : (
            <></>
          )}

        <Table bordered dataSource={buildingData} rowKey="Code" pagination={{ defaultPageSize: 20, showSizeChanger: true, pageSizeOptions: ["20", "40", "60"] }}>
          <Column title="Code" dataIndex="Code" key="Code" align="center" />
          <Column title="Name" dataIndex="Name" key="Name" align="center" />
          <Column
            title="Location"
            dataIndex="Location"
            key="Location"
            align="center"
          />
          <Column
            title="Floor"
            dataIndex="NumberOfFloor"
            key="NumberOfFloor"
            align="center"
          />
          <Column
            title="Room"
            dataIndex="NumberOfRoom"
            key="NumberOfRoom"
            align="center"
          />
          <Column
            title="Student"
            dataIndex="NumberOfStudent"
            key="NumberOfStudent"
            align="center"
          />
        </Table>
      </Modal>

      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>List building in dorm</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: '90vh',
        }}
      >
        <Row>
          <Col span={8}>
            <Search
              placeholder="Input code of building"
              onChange={(value) => search(value)}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
          <Col span={2}></Col>
          <Col span={7}></Col>
          {/* <Col span={3}></Col> */}
          <Col span={4}>
            <Upload
              accept={environment.SheetJSFT}
              onRemove={() => setFileUpload(null)}
              beforeUpload={(file) => setFileUpload(file)}
              fileUpload
            >
              <Button type="primary" style={{ marginLeft: 30 }}>
                Import data from excel file
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={showDataInFile}
              disabled={fileUpload == null}
              loading={isLoading}
              style={{ marginTop: 16, marginLeft: 120 }}
            >
              {isLoading ? "Uploading" : "Start Upload"}
            </Button>
          </Col>
        </Row>

        <div>
          {isLoading ? <Skeleton /> : (<div></div>)}
          <Row gutter={[48, 48]}>
            {buildingDisplay.map((building) => (
              <Col className="gutter-row" span={6}>
                <Link
                  to={`/manager/building/${building.Id}`}
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  <div
                    className={
                      buildingDisplay && buildingDisplay.Code === building.Code
                        ? "building__box active"
                        : "building__box un_active"
                    }
                  >
                    <div>Building: {building.Code}</div>
                    <div>Manager: {building.ManagerName}</div>
                    <div>Location: {building.Location}</div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <SweetAlert
        show={done.length > 0}
        success
        title={done}
        onConfirm={() => setDone("")}
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

export default BuildingListPage;
