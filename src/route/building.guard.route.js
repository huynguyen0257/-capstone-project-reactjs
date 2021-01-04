import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  Link,
} from "react-router-dom";
import {
  DangerousCaseDetailPage,
  DangerousCaseListPage,
  BuildingDashBoardPage,
  BuildingStreamPage,
  StudentGuardListPage,
  UserProfilePage,
  UserChangePasswordPage,
  BuildingCameraPage,
  RoomGuardListPage,
  StudentGuardDetailPage,
  CaseListGuardPage
} from "../pages";
import { Layout, Menu, Dropdown, Badge } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  AreaChartOutlined,
  UserSwitchOutlined,
  BellOutlined,
  NotificationOutlined,
  WeiboOutlined,
  CameraOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { logOut, fetchLogout } from "../services";
import socketIOClient from "socket.io-client";
import { environment } from "../environment";
import { useSelector, useDispatch } from "react-redux";
import { setSocket } from "../redux";
import { Notification } from "../components/index";
import initializeFirebase from "../services/firebase.service";
import { getNotifications, getUsername, getBuildingByGuard } from "../services";
import { setListNotification,setBuilding } from "../redux";
import { useHistory } from "react-router-dom";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

function BuildingGuardRoute(props) {
  const [isLogOut, setIsLogOut] = React.useState(false);
  const [Username, setUserName] = React.useState("Account");
  const socketState = useSelector((state) => state.socket);
  const notiState = useSelector((state) => state.notification);
  const buildingState = useSelector((state) => state.building.building);
  const history = useHistory();
  const dispatch = useDispatch();
  React.useEffect(() => {
    const user = getUsername();
    if (user) setUserName(user);
    initializeFirebase(dispatch);
    dispatch(setSocket(socketIOClient(environment.endpoint)));
    getNotifications().then((res) => {
      dispatch(setListNotification(res.data));
    });
    buildingState
      ? setBuilding(buildingState)
      : getBuildingByGuard()
          .then((e) => {
            setBuilding(e.data);
            dispatch(setBuilding(e.data));
          })
          .catch(() => {
            history.push('no_building');
          });
  }, []);

  const signOut = () => {
    fetchLogout().then(e =>{
      logOut();
      setIsLogOut(true);
      socketState.socket.close();
    })
  };

  let match = useRouteMatch();
  let pathName = props.location.pathname
    .replaceAll("/", "")
    .replaceAll("-", "");
  return isLogOut ? (
    <Redirect to="/login" />
  ) : (
    <Router>
      <Layout>
        <Header className="header">
          <div className="logo">
            <img className="logo" src="./logo_long.png" />
          </div>
          <Menu
            style={{ float: "right" }}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[pathName]}
          >
            <Menu.Item>
              {/* <Dropdown overlay={menu} trigger={['click']} arrow> */}
              <Dropdown overlay={<Notification />} trigger={["click"]} arrow>
                <Badge
                  count={
                    notiState.notifications.filter((n) => n.IsRead === false)
                      .length
                  }
                >
                  <BellOutlined style={{ fontSize: "26px" }} />
                </Badge>
              </Dropdown>
            </Menu.Item>
            <Menu.Item key="buildingguardprofile">
              <Link to="/building-guard/profile">{Username}</Link>
            </Menu.Item>
            <Menu.Item key="2" onClick={signOut}>
              Log Out
            </Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={250} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={[pathName]}
              defaultOpenKeys={["sub2", "sub3", "sub4", "sub5", "user"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="/building-guard" icon={<AreaChartOutlined />}>
                <Link to={"/building-guard"}>Dashboard</Link>
              </Menu.Item>
              <SubMenu
                key="sub2"
                icon={<VideoCameraOutlined />}
                title="Camera management"
              >
                <Menu.Item
                  key="building-guardstreamingai"
                  icon={<WeiboOutlined />}
                >
                  <Link to="/building-guard/streaming-ai">AI streaming</Link>
                </Menu.Item>
                <Menu.Item key="building-guardcamera" icon={<CameraOutlined />}>
                  <Link to={"/building-guard/camera"}>Monitor camera</Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item
                key="building-guardwaitingcaselist"
                icon={
                  <Badge count={1}>
                    <NotificationOutlined />
                  </Badge>
                }
              >
                <Link to="/building-guard/dangerous-case"> Dangerous case</Link>
              </Menu.Item>
              <SubMenu
                key="user"
                icon={<UserOutlined />}
                title="User management"
              >
                <Menu.Item
                  key="building-guardstudentlist"
                  icon={<UserSwitchOutlined />}
                >
                  <Link to="/building-guard/student-dorm">Student list</Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="/buildingguardroom" icon={<ApartmentOutlined />}>
                <Link to={"/building-guard/room"}>Room Management</Link>
              </Menu.Item>
            </Menu>
          </Sider>

          <Switch>
            <Route exact path={`${match.path}/`}>
              <BuildingDashBoardPage />
            </Route>
            <Route path={`${match.path}/change-password`}>
              <UserChangePasswordPage />
            </Route>
            <Route path={`${match.path}/streaming-ai`}>
              <BuildingStreamPage />
            </Route>

            <Route exact path={`${match.path}/`}>
              <BuildingDashBoardPage />
            </Route>
            <Route path={`${match.path}/profile`}>
              <UserProfilePage buildingGuard={true}/>
            </Route>
            
            <Route path={`${match.path}/camera`}>
              <BuildingCameraPage />
            </Route>

            <Route path={`${match.path}/student-dorm`}>
              <StudentGuardListPage />
            </Route>
            <Route path={`${match.path}/student/:id`}>
              <StudentGuardDetailPage />
            </Route>
            <Route path={`${match.path}/dangerous-case/:id`}>
              <DangerousCaseDetailPage />
            </Route>
            <Route path={`${match.path}/dangerous-case`}>
              <CaseListGuardPage />
            </Route>
            <Route path={`${match.path}/room`}>
              <RoomGuardListPage />
            </Route>
          </Switch>
        </Layout>
      </Layout>
    </Router>
  );
}

export default BuildingGuardRoute;
