import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Col,
  Input,
  Layout,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Switch,
  Table,
  Tag
} from 'antd';
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useSelector } from 'react-redux';
import { disableCamera, enableCamera, getCameras } from '../../../services';
import './camera.css';
const { Content } = Layout;
const { Column } = Table;
const { Option } = Select;
const { Search } = Input;

function CameraListPage() {
  const [err, setErr] = React.useState('');
  const [done, setDone] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);
  const [cameras, setCameras] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const socketState = useSelector((state) => state.socket);
  const buildingState = useSelector((state) => state.building);
  const [params, setParams] = React.useState({ Type: 0 });
  const [showPassword, setShowPassword] = React.useState([]);
  // const [buildingDisplay, setBuildingDisplays] = React.useState([]);

  React.useEffect(() => {
    fetchCameras(true, { ...params, ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  }, []);
  const camerasRef = React.useRef(cameras);
  React.useEffect(() => {
    camerasRef.current = cameras;
  }, [cameras]);
  React.useEffect(() => {
    try {
      const socket = socketState.socket;
      socket.on('enable_camera', (camera_code) => {
        console.log('camera_code to enable: ', camera_code);
      });
      socket.on('disable_camera', (camera_code) => {
        console.log('camera_code to disable: ', camera_code);
      });
      if (!socket.hasListeners('updateCameraIsOn')) {
        socket.on('updateCameraIsOn', (cameraId) => {
          // if (camerasRef.current.filter((e) => e.Id == cameraId).length > 0) {
          // }
          fetchCameras(false, { ...pagination, ...params });
        });
      }
    } catch (e) {}

    return () => {
      try {
        const socket = socketState.socket;
        socket.removeAllListeners();
      } catch (e) {}
    };
  }, [socketState.socket]);

  const handleTableChange = (pagination, sorter) => {
    fetchCameras(false, { ...params, ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };

  const fetchCameras = (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    setIsLoadingBtn(true);
    return getCameras(params).then((res) => {
      setCameras(res.data.results);
      setIsLoading(false);
      setIsLoadingBtn(false);
      let p = [];
      res.data.results.forEach((e) => p.push(false));
      setShowPassword(p);
      return res;
    });
  };
  const togglePassword = (index) => {
    setShowPassword((oldArr) =>
      oldArr.map((e, i) => {
        if (i === index) e = !e;
        return e;
      })
    );
  };

  const toggle = (id, current) => {
    setIsLoadingBtn(true);

    if (!current)
      enableCamera(id)
        .then(() => {
          fetchCameras(false, { ...params, ...pagination });
        })
        .catch(() => {
          setErr('Enable camera failed');
          setIsLoadingBtn(false);
        });
    else {
      disableCamera(id)
        .then(() => {
          fetchCameras(false, { ...params, ...pagination });
        })
        .catch(() => {
          setErr('Disable camera failed');
          setIsLoadingBtn(false);
        });
    }
  };
  const searchByCode = (input) => {
    fetchCameras(false, {
      ...params,
      Code: input,
      ...pagination,
      current: 1,
    }).then((res) => {
      setParams({ ...params, Code: input });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const filterByBuilding = (input) => {
    fetchCameras(false, {
      ...params,
      BuildingId: input,
      ...pagination,
      current: 1,
    }).then((res) => {
      setParams({ ...params, BuildingId: input });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const filterByStatus = (input) => {
    fetchCameras(false, {
      ...params,
      Status: input,
      ...pagination,
      current: 1,
    }).then((res) => {
      setParams({ ...params, Status: input });
      setPagination({ ...pagination, current: 1 });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Camera</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: '90vh',
        }}
      >
        {isLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <Row>
              <Col span={6}>
                <Select
                  onChange={(value) => filterByBuilding(value)}
                  style={{ width: 300, marginBottom: 10 }}
                  placeholder="Filter by building"
                  optionFilterProp="children"
                >
                  <Option value={null} key={-1}>
                    All of status process
                  </Option>
                  {buildingState.buildings.map((b) => (
                    <Option value={b.Id} key={b.Id}>
                      {b.Code}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  onChange={(value) => filterByStatus(value)}
                  style={{ width: 300, marginBottom: 10 }}
                  placeholder="Filter by status"
                  optionFilterProp="children"
                >
                  <Option value={null} key={-1}>
                    All
                  </Option>
                  <Option value={0} key={0}>
                    connected
                  </Option>
                  <Option value={1} key={1}>
                    streaming
                  </Option>
                  <Option value={2} key={2}>
                    disable
                  </Option>
                </Select>
              </Col>
            </Row>
            <Table
              dataSource={cameras}
              rowKey="Id"
              pagination={{
                ...pagination,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '40', '60'],
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} records`,
              }}
              loading={isLoadingBtn}
              onChange={handleTableChange}
            >
              <Column title="Code" dataIndex="Code" key="Code" align="center" />
              <Column
                title="Username"
                dataIndex="Username"
                key="Username"
                align="center"
              />
              {buildingState.buildings.length > 0 ? (
                <Column
                  title="Building"
                  dataIndex="BuildingId"
                  key="Id"
                  align="center"
                  render={(Id) =>
                    buildingState.buildings.filter((r) => r.Id === Id)[0].Code
                  }
                />
              ) : (
                <Column />
              )}
              <Column
                title="Password"
                dataIndex="Password"
                align="center"
                render={(Password, record, index) => {
                  return showPassword[index] ? (
                    <span>
                      Password
                      <EyeInvisibleOutlined
                        onClick={() => togglePassword(index)}
                        className={'eye__icon'}
                      />
                    </span>
                  ) : (
                    <span>
                      ****
                      <EyeOutlined
                        onClick={() => togglePassword(index)}
                        className={'eye__icon'}
                      />
                    </span>
                  );
                }}
              />
              <Column
                title="Streaming"
                dataIndex="Status"
                key="Status"
                align="center"
                render={(Status, Record) => {
                  if (Record.IsOn) {
                    if (Status === 0) return <Tag color="cyan">Connected</Tag>;
                    if (Status === 1) return <Tag color="green">Streaming</Tag>;
                    if (Status === 2) return <Tag color="red">Disable</Tag>;
                  } else {
                    if (Status === 0)
                      return <Tag color="#b1b1b1">Connected</Tag>;
                    if (Status === 1)
                      return <Tag color="#b1b1b1">Streaming</Tag>;
                    if (Status === 2) return <Tag color="#b1b1b1">Disable</Tag>;
                  }
                }}
              />
              <Column
                title="Status"
                dataIndex="IsOn"
                key="IsOn"
                align="center"
                render={(IsOn) => {
                  if (IsOn) return <Tag color="green">Ready</Tag>;
                  return <Tag color="red">Disable</Tag>;
                }}
              />
              <Column
                title="Action"
                key="Id"
                dataIndex="Id"
                align="center"
                render={(Id, Record) => (
                  <Space size="middle">
                    <Spin spinning={isLoadingBtn}>
                      <Switch
                        disabled = {!Record.IsOn}
                        checked={Record.Status === 1}
                        onClick={() => toggle(Id, Record.Status === 1)}
                      />
                    </Spin>
                  </Space>
                )}
              />
              <Column
                title="Image"
                dataIndex="Image"
                key="Image"
                align="center"
                render={(Image) =>
                  Image ? (
                    <img
                      width={250}
                      height={200}
                      src={`data:image/webp;base64,${Image}`}
                    />
                  ) : (
                    'Camera is not streaming yet'
                  )
                }
              />
            </Table>
          </div>
        )}
      </Content>
      <SweetAlert
        show={done.length > 0}
        success
        title={done}
        onConfirm={() => setDone('')}
      />
      <SweetAlert
        show={err.length > 0}
        error
        title={err}
        onConfirm={() => setErr('')}
      />
    </Layout>
  );
}

export default CameraListPage;
