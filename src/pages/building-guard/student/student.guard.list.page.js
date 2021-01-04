import React from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  Space,
  Input,
  Select,
  Row,
  Col,
  Button,
  Alert,
  Spin,
  Modal,
  Upload,
  Skeleton,
  Popover,
  Tag,
  Typography,
} from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getStudents,
} from "../../../services";
import Moment from "react-moment";
const { Column } = Table;
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

function StudentDormListPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingTable, setIsLoadingTable] = React.useState(false);
  const [params, setParams] = React.useState({});
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const [done, setDone] = React.useState("");
  const [err, setErr] = React.useState("");
  const [students, setStudents] = React.useState([]);
  const [fileUpload, setFileUpload] = React.useState([]);
  const [studentData, setStudentData] = React.useState([]);
  const [modelVisible, setModelVisible] = React.useState(false);
  const buildingState = useSelector((state) => state.building.building);

  const universityState = useSelector((state) => state.university);
  const dispatch = useDispatch();
 

  const fetchStudents = (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    setIsLoadingTable(true);
    return getStudents({...params, BuildingId: buildingState.Id}).then((res) => {
      setStudents(res.data.results);
      setIsLoading(false);
      setIsLoadingTable(false);
      return res;
    });
  };

  // initial | constructor
  React.useEffect(() => {
    if(buildingState) {
      fetchStudents(true, { ...pagination }).then((res) => {
        setPagination({ ...pagination, total: res.data.info.total });
      });
    }
  }, [buildingState]);

  const searchByName = (fullname) => {
    if (!fullname || fullname.length === 0) fullname = null;

    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      Fullname: fullname,
    }).then((res) => {
      setParams({ ...params, Fullname: fullname });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const searchByCode = (code) => {
    if (!code || code.length === 0) code = null;
    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      Code: code,
    }).then((res) => {
      setParams({ ...params, Code: code });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const searchByRoomCode = (code) => {
    if (!code || code.length === 0) code = null;
    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      RoomCode: code,
    }).then((res) => {
      setParams({ ...params, RoomCode: code });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const searchByUniversity = (universityId) => {
    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      UniversityId: universityId,
    }).then((res) => {
      setParams({ ...params, UniversityId: universityId });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const handleTableChange = (pagination, filter, sorter) => {
    const _params = { ...params, ...pagination };
    if (sorter.column) {
      _params["OrderBy"] = sorter.column.dataIndex;
      _params["OrderType"] = sorter.order === "ascend" ? "ASC" : "DESC";
    }
    fetchStudents(false, _params).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Building Guard</Breadcrumb.Item>
        <Breadcrumb.Item>List of student</Breadcrumb.Item>
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
          <Col span={4}>
            <Search
              placeholder="Input Student Code"
              onSearch={(value) => searchByCode(value)}
              style={{ width: "90%" }}
              enterButton
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Input Name"
              onSearch={(value) => searchByName(value)}
              style={{ width: "90%" }}
              enterButton
            />
          </Col>
          <Col span={4}>
            <Search
              placeholder="Input Room Code"
              onSearch={(value) => searchByRoomCode(value)}
              style={{ width: "90%" }}
              enterButton
            />
          </Col>
          <Col span={4}>
            <Select
              onChange={(value) => searchByUniversity(value)}
              style={{ width: "90%" }}
              placeholder="Search by University"
            >
              <Option value={null} key={-1}>
                All of university
              </Option>
              {universityState.universities.map((u) => (
                <Option value={u.Id} key={u.Id}>
                  {u.Name}
                </Option>
              ))}
            </Select>
          </Col>
       
        </Row>

        <div>
          {isLoading ? (
            <Skeleton active />
          ) : (
            <Table
              dataSource={students}
              pagination={{
                ...pagination,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "40", "60"],
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} records`,
              }}
              loading={isLoadingTable}
              onChange={handleTableChange}
              rowKey="Id"
            >
              <Column
                title="No"
                dataIndex="Id"
                key="id"
                render={(id, record, index) => <Text>{index + 1}</Text>}
              />
              <Column
                title="Code"
                dataIndex="Code"
                key="Code"
                align="center"
                sorter={true}
              />
              <Column
                title="Full name"
                align="left"
                dataIndex="FullName"
                key="FullName"
              />
              <Column
                title="Room"
                dataIndex="RoomCode"
                key="RoomCode"
                align="center"
              />

              <Column
                title="Gender"
                dataIndex="Gender"
                key="Gender"
                align="center"
                render={(Gender) =>
                  Gender === true ? <span>Male</span> : <span>Female</span>
                }
              />
              {universityState.universities.length > 0 ? (
                <Column
                  title="University"
                  key="UniversityId"
                  dataIndex="UniversityId"
                  align="left"
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
                align="center"
                title="Active"
                key="IsActive"
                dataIndex="IsActive"
                render={(IsActive) =>
                  IsActive === true ? (
                    <Tag color="green">Available</Tag>
                  ) : (
                    <Tag color="volcano">Error</Tag>
                  )
                }
              />
              <Column
                title="Action"
                key="Id"
                align="center"
                dataIndex="Id"
                render={(text, record) => (
                  <Space size="middle">
                    <Link to={`/building-guard/student/${record.Id}`}>
                      <Button style={{ margin: 0 }} type="dashed">
                        View detail
                      </Button>
                    </Link>
                  </Space>
                )}
              />
            </Table>
          )}
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

export default StudentDormListPage;
