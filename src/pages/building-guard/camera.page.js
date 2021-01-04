import React from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  Space,
  Row,
  Col,
  Button,
  Skeleton,
  Spin,
  Tag,
  Select,
} from "antd";
import { getCameras, enableCamera, disableCamera } from "../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector } from "react-redux";

const { Content } = Layout;
const { Column } = Table;
const { Option } = Select;

function CameraPage() {
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);
  const [cameras, setCameras] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const [params, setParams] = React.useState({ Type: 0 });
  const [showPassword, setShowPassword] = React.useState([]);
  const socketState = useSelector((state) => state.socket);
  const buildingState = useSelector((state) => state.building.building);
  const camerasRef = React.useRef(cameras);
  React.useEffect(() => {
    camerasRef.current = cameras;
  }, [cameras]);
  React.useEffect(() => {
    // console.log("effect on");
    if (buildingState) {
      fetchCameras(true, { ...params, ...pagination }).then((res) => {
        setPagination({ ...pagination, total: res.data.info.total });
      });
    }
  }, [buildingState]);

  React.useEffect(() => {
    try {
      const socket = socketState.socket;
      console.log(socket.id);
      socket.on("enable_camera", (camera_code) => {
        console.log("camera_code to enable: ", camera_code);
      });
      socket.on("disable_camera", (camera_code) => {
        console.log("camera_code to disable: ", camera_code);
      });
      // if (!socket.hasListeners("updateCameraIsOn")) {
      //   socket.on("updateCameraIsOn", (cameraId) => {
      //     // if (camerasRef.current.filter((e) => e.Id == cameraId).length > 0) {
      //     // }
      //     fetchCameras(false, { ...pagination, ...params });
      //   });
      // }
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
    return getCameras({ ...params, BuildingId: buildingState.Id }).then(
      (res) => {
        setCameras(res.data.results);
        setIsLoading(false);
        setIsLoadingBtn(false);
        let p = [];
        res.data.results.forEach((e) => p.push(false));
        setShowPassword(p);
        return res;
      }
    );
  };

  const togglePassword = (index) => {
    setShowPassword((oldArr) =>
      oldArr.map((e, i) => {
        if (i === index) e = !e;
        return e;
      })
    );
  };

  const enable = (id) => {
    setIsLoadingBtn(true);
    enableCamera(id)
      .then(() => {
        setDone("Enable camera success");
        fetchCameras(false, { ...params, ...pagination });
      })
      .catch(() => {
        setErr("Enable camera failed");
        setIsLoadingBtn(false);
      });
  };
  const disable = (id) => {
    setIsLoadingBtn(true);
    disableCamera(id)
      .then(() => {
        setDone("Disable camera success");
        fetchCameras(false, { ...params, ...pagination });
      })
      .catch(() => {
        setErr("Disable camera failed");
        setIsLoadingBtn(false);
      });
  };
  return  (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Building Guard</Breadcrumb.Item>
        <Breadcrumb.Item>Camera</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        {isLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <Table
              dataSource={cameras}
              rowKey="Id"
              pagination={{
                ...pagination,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "40", "60"],
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} records`,
              }}
              loading={isLoadingBtn}
              onChange={handleTableChange}
              rowKey="Id"
            >
              <Column title="Code" dataIndex="Code" key="Code" align="center"/>
              <Column title="Username" dataIndex="Username" key="Username" align="center"/>
              {/* <Column title="Password" dataIndex="Password" key="Password"/> */}
              <Column
                title="Status Streaming"
                dataIndex="Status"
                key="Status"
                align="center"
                render={(Status) => {
                  if (Status === 0) return <Tag color="cyan">Connected</Tag>;
                  if (Status === 1) return <Tag color="green">Streaming</Tag>;
                  if (Status === 2) return <Tag color="red">Disable</Tag>;
                }}
              />

              <Column
                title="Image"
                dataIndex="Image"
                key="Image"
                align="center"
                render={(Image) =>
                  Image ? (
                    <img
                      alt="preview"
                      width={250}
                      height={200}
                      src={`data:image/webp;base64,${Image}`}
                    />
                  ) : (
                    "Camera is not streaming yet"
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

export default CameraPage;
