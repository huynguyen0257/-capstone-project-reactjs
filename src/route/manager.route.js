import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  Link,
} from "react-router-dom";
import { useHistory } from "react-router-dom";

import {
  DangerousCaseDetailPage,
  DangerousCaseListPage,
  DashBoardPage,
  StandardStreamPage,
  StudentDormListPage,
  StudentDetailPage,
  UserProfilePage,
  UserChangePasswordPage,
  SecurityManListPage,
  UserPage,
  UserDetailPage,
  UserCreatePage,
  UniversityListPage,
  UniversityCreatePage,
  UniversityDetailPage,
  CameraListPage,
  BuildingListPage,
  BuildingDetailPage,
  RoomListPage,
  RoleListPage,
  RelativeCreatePage,
  RelativeFaceRegisterForm,
  RelativeListPage,
  UserRegisterFacePage,
  ConfigurationPage,
  // RelativeInfoForm
} from "../pages";
import { Layout, Menu, Dropdown, Badge, Result, Button, Row } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  AreaChartOutlined,
  UserSwitchOutlined,
  BellOutlined,
  ShopOutlined,
  ToolOutlined,
  ReadOutlined,
  IssuesCloseOutlined,
  SecurityScanOutlined,
  NotificationOutlined,
  WeiboOutlined,
  CameraOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { logOut } from "../services";
import socketIOClient from "socket.io-client";
import { environment } from "../environment";
import { useSelector, useDispatch } from "react-redux";
import { setSocket, setListNotification } from "../redux";
import { Notification } from "../components/index";
import initializeFirebase from "../services/firebase.service";
import { getNotifications, getUsername, fetchLogout, getRole } from "../services";
const { SubMenu } = Menu;
const { Header, Sider,Content } = Layout;
function ManagerRoute(props) {
  const [isLogOut, setIsLogOut] = React.useState(false);
  const [Username, setUserName] = React.useState("Account");
  const socketState = useSelector((state) => state.socket);
  const notiState = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const history = useHistory();

  React.useEffect(() => {
    document.title = `${
      notiState.notifications.filter((n) => n.IsRead === false).length == 0
        ? ""
        : `(${
            notiState.notifications.filter((n) => n.IsRead === false).length
          })`
    } DSMS`;
  }, [notiState.notifications.filter((n) => n.IsRead === false).length]);

  React.useEffect(() => {
    const user = getUsername();
    const role = getRole();
    if(role !== 'Manager') {
      logOut();
    }
    if (user) setUserName(user);
    initializeFirebase(dispatch);
    dispatch(setSocket(socketIOClient(environment.endpoint)));
    getNotifications().then((res) => {
      dispatch(setListNotification(res.data));
    });
    return signOut;
  }, []);

  const signOut = () => {
    fetchLogout().then((e) => {
      logOut();
      setIsLogOut(true);
      socketState.socket.close();
    });
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
            <img className="logo" src="http://localhost:3000/logo_long.png" />
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
            <Menu.Item key="managerprofile">
              <Link to="/manager/profile">{Username}</Link>
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
              <Menu.Item key="/manager" icon={<AreaChartOutlined />}>
                <Link to={"/manager"}>Dashboard</Link>
              </Menu.Item>
              <SubMenu
                key="sub2"
                icon={<VideoCameraOutlined />}
                title="Camera management"
              >
                <Menu.Item key="managerstreamingai" icon={<WeiboOutlined />}>
                  <Link to="/manager/streaming-ai">AI streaming</Link>
                </Menu.Item>
                <Menu.Item key="managercamera" icon={<CameraOutlined />}>
                  <Link to={"/manager/camera"}>Monitor camera</Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item
                key="managerwaitingcaselist"
                icon={
                  <Badge count={0}>
                    <NotificationOutlined />
                  </Badge>
                }
              >
                <Link to="/manager/dangerous-case"> Dangerous case</Link>
              </Menu.Item>
              <SubMenu
                key="user"
                icon={<UserOutlined />}
                title="User management"
              >
                <Menu.Item key="manageruser" icon={<UserOutlined />}>
                  <Link to="/manager/user">User list</Link>
                </Menu.Item>
                <Menu.Item
                  key="managerstudentlist"
                  icon={<UserSwitchOutlined />}
                >
                  <Link to="/manager/student-dorm">Student list</Link>
                </Menu.Item>
                <Menu.Item
                  key="managersecuritymanlist"
                  icon={<SecurityScanOutlined />}
                >
                  <Link to="/manager/security-man-list">
                    Security guard list
                  </Link>
                </Menu.Item>
              </SubMenu> 
              <Menu.Item
                  key="managerrelativelist"
                  icon={<TeamOutlined />}
                >
                  <Link to="/manager/relative">Relative list</Link>
                </Menu.Item>
              <Menu.Item key="managerrole" icon={<IssuesCloseOutlined />}>
                <Link to={"/manager/role"}>Role list</Link>
              </Menu.Item>
              <Menu.Item key="managerbuilding" icon={<ShopOutlined />}>
                <Link to={"/manager/building"}>Building list</Link>
              </Menu.Item>
              {/* <Menu.Item key="managerroom" icon={<AuditOutlined />}>
                <Link to={'/manager/room'}>Room List</Link>
              </Menu.Item> */}
              <Menu.Item key="manageruniversity" icon={<ReadOutlined />}>
                <Link to={"/manager/university"}>University list</Link>
              </Menu.Item>
              <Menu.Item key="managerconfiguration" icon={<ToolOutlined />}>
                <Link to={"/manager/configuration"}>Configuration</Link>
              </Menu.Item>
            </Menu>
          </Sider>

          <Switch>
            <Route exact path={`${match.path}/`}>
              <DashBoardPage />
            </Route>
            <Route path={`${match.path}/profile`}>
              <UserProfilePage />
            </Route>
            <Route path={`${match.path}/change-password`}>
              <UserChangePasswordPage />
            </Route>
            <Route path={`${match.path}/streaming-ai`}>
              <StandardStreamPage />
            </Route>

            <Route exact path={`${match.path}/`}>
              <DashBoardPage />
            </Route>
            <Route path={`${match.path}/change-password`}>
              <UserChangePasswordPage />
            </Route>
            <Route path={`${match.path}/camera`}>
              <CameraListPage />
            </Route>
            <Route path={`${match.path}/user-register-face/:id`} exact>
              <UserRegisterFacePage />
            </Route>
            {/* <Route path={`${match.path}/student-register-into-dorm/:id`}>
              <RegisterToEnterDormPage />
            </Route>
            <Route path={`${match.path}/student-register-face/:id`}>
              <RegisterFacePage />
            </Route> */}
            <Route path={`${match.path}/student-dorm`}>
              <StudentDormListPage />
            </Route>
            <Route path={`${match.path}/student/:id/relative/create`}>
              <RelativeCreatePage />
              {/* <RelativeFaceRegisterForm /> */}
            </Route>
            <Route path={`${match.path}/relative`}>
              <RelativeListPage />
              {/* <RelativeFaceRegisterForm /> */}
            </Route>
            <Route path={`${match.path}/student/:id`}>
              <StudentDetailPage />
            </Route>
            <Route path={`${match.path}/building/:id`}>
              <BuildingDetailPage />
            </Route>
            <Route path={`${match.path}/building`}>
              <BuildingListPage />
            </Route>
            <Route path={`${match.path}/room`}>
              <RoomListPage />
            </Route>
            <Route exact path={`${match.path}/dangerous-case`}>
              <DangerousCaseListPage />
            </Route>
            <Route path={`${match.path}/dangerous-case/:id`}>
              <DangerousCaseDetailPage />
            </Route>
            <Route path={`${match.path}/security-man-list`}>
              <SecurityManListPage />
            </Route>
            <Route path={`${match.path}/user/create`}>
              <UserCreatePage />
            </Route>
            <Route path={`${match.path}/user/:id`}>
              <UserDetailPage />
            </Route>
            <Route path={`${match.path}/user`}>
              <UserPage />
            </Route>
            <Route path={`${match.path}/university/create`}>
              <UniversityCreatePage />
            </Route>
            <Route path={`${match.path}/university/:id`}>
              <UniversityDetailPage />
            </Route>

            <Route path={`${match.path}/university`}>
              <UniversityListPage />
            </Route>
            <Route path={`${match.path}/role`}>
              <RoleListPage />
            </Route>
            <Route path={`${match.path}/configuration`}>
              <ConfigurationPage />
            </Route>
            <Route path={`${match.path}/404`} exact>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                <Row justify="center">
                  <Result
                    status="404"
                    title="Your request id is not existed on database"
                    subTitle=""
                    extra={
                      <Button
                        onClick={() => {
                          window.location.href = "/manager";
                        }}
                        type="primary"
                      >
                        Back
                      </Button>
                    }
                  />
                </Row>
              </Content>
            </Route>
          </Switch>
        </Layout>
      </Layout>
    </Router>
  );
}

export default ManagerRoute;
