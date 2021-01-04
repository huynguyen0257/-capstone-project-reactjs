import React from 'react';
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  Space,
  Radio,
  Button,
  Typography,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  Tag,
  Popover,
  Switch,
} from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ToolOutlined,
  BellOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { setFrame } from '../../../redux';
import { FrameComponent } from '../../../components';
import './stream.css';
import {
  getCameras,
  createDangerousCase,
  getUserByCode,
} from '../../../services';
import Moment from 'react-moment';
import { environment } from '../../../environment';
import moment from 'moment';

const { Content } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;

function StandardStreamPage() {
  const [err, setErr] = React.useState('');
  const [done, setDone] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState(null);
  const [cameras, setCameras] = React.useState([]);
  const [camera, setCamera] = React.useState(null);
  const [showRaw, setShowRaw] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [imageModal, setImageModal] = React.useState(null);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [sizeCamera, setSizeCamera] = React.useState(12);
  const [cameraSelectedId, setCameraSelectedId] = React.useState(null);
  const socketState = useSelector((state) => state.socket);
  const policy = useSelector((state) => state.policy);
  const roles = useSelector((state) => state.role.roles);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [openSetting, setOpenSetting] = React.useState(false);
  const [modalUserInfo, setModalUserInfo] = React.useState(false);
  const [saveImage, setSaveImage] = React.useState(false);
  const [faceDetect, setFaceDetect] = React.useState(false);
  const [tinyDetect, setTinyDetect] = React.useState(false);
  const [tracking, setTracking] = React.useState(false);
  const [weirdHour, setWeirdHour] = React.useState(false);
  const [prohibitedItemDetect, setProhibitedItemDetect] = React.useState(false);
  const [sendNoti, setSendNoti] = React.useState(false);
  const [buildingDetect, setBuildingDetect] = React.useState(false);
  const [maskDetect, setMaskDetect] = React.useState(false);
  const [userOnStream, setUserOnStream] = React.useState([]);
  const closeStreaming = () => {
    return () => {
      if (camera) {
        try {
          const socket = socketState.socket;
          socket.emit('closeStream', camera.Code, () => {
            console.log('closeStream done');
          });
          socket.emit('closeStreamRaw', camera.Code, () => {
            console.log('closeStream raw done');
          });
          cameras.forEach((e) => {
            if (e.Code !== camera.Code)
              socket.emit('closeStream', e.Code, () => {});
          });
        } catch (e) {
          console.log('closeStream failed');
        }
      }
    };
  };
  const newStreaming = () => {
    if (camera) {
      try {
        const socket = socketState.socket;
        console.log('enable new streaming');
        if (!socket.hasListeners('takeStream')) {
          socket.on('takeStream', (data, callback) => {
            console.log(
              'take stream detect',
              data.camera_code,
              'no mask',
              data.no_mask
            );
            dispatch(setFrame(data.camera_code, false, data.image));
            setUserOnStream(data.faceData);
            callback();
            if (data.no_mask) {
              const audio = new Audio('http://localhost:3000/tinh_mask.mp3');
              audio.play();
            }
          });
        }
        socket.emit('getStream', camera.Code);

        if (!socket.hasListeners('takeStreamRaw')) {
          socket.on('takeStreamRaw', (data, callback) => {
            // console.log("take stream raw", data.camera_code);
            dispatch(setFrame(data.camera_code, true, data.image));
            callback();
          });
        }
        socket.emit('getStreamRaw', camera.Code);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleFaceDetect = () => {
    const socket = socketState.socket;
    socket.emit('toggleFaceDetect');
  };

  const toggleTinyDetect = () => {
    const socket = socketState.socket;
    socket.emit('toggleTinyDetect');
  };

  const toggleTracking = () => {
    const socket = socketState.socket;
    socket.emit('toggleTracking');
  };

  const toggleWeirdHour = () => {
    const socket = socketState.socket;
    socket.emit('toggleWeirdHour');
  };

  const toggleProhibitedItemDetect = () => {
    const socket = socketState.socket;
    socket.emit('toggleProhibitedItemDetect');
  };
  const toggleSendNoti = () => {
    const socket = socketState.socket;
    socket.emit('toggleSendNoti');
  };
  const toggleBuildingDetect = () => {
    const socket = socketState.socket;
    socket.emit('toggleBuildingDetect');
  };
  const toggleMaskDetect = () => {
    const socket = socketState.socket;
    socket.emit('toggleMaskDetect');
  };
  const alertNewCase = (values) => {
    setVisibleModal(false);
    values.CreatedAt = values.CreatedAt.toDate();
    values.Images = [
      { Image: imageModal.replace('data:image/jpg;base64,', '') },
    ];
    createDangerousCase(values);
    setDone('Please wait a minute');
  };

  React.useEffect(() => {
    newStreaming();
    return closeStreaming();
  }, [camera]);

  React.useEffect(() => {
    if (socketState.socket) {
      getCameras({ Type: 0 }).then((res) => {
        setCameras(res.data.results);
        setCamera(res.data.results[0]);
        if (res.data.results[0]) {
          setCameraSelectedId(res.data.results[0].Id);
        }
      });
      socketState.socket.on('receiveStreamingStatus', (data) => {
        setSaveImage(data.saveImage);
        setFaceDetect(data.faceDetect);
        setTinyDetect(data.tinyDetect);
        setTracking(data.tracking);
        setWeirdHour(data.weirdHour);
        setProhibitedItemDetect(data.prohibitedItemDetect);
        setSendNoti(data.sendNoti);
        setBuildingDetect(data.buildingDetect);
        setMaskDetect(data.maskDetect);
      });
      socketState.socket.emit('getStreamingStatus');
    }
    return () => {
      if (socketState.socket) {
        socketState.socket.removeAllListeners();
      }
    };
  }, [socketState.socket]);

  const enableAllCamera = () => {
    setCameraSelectedId(null);
    try {
      const socket = socketState.socket;
      cameras.forEach((e) => {
        if (camera && e.Code != camera.Code) socket.emit('getStream', e.Code);
      });
    } catch (err) {}
    setShowAll(true);
  };

  const disableAllCamera = (cam) => {
    if (showAll) {
      try {
        const socket = socketState.socket;
        cameras.forEach((e) => {
          if (camera && e.Code != camera.Code)
            socket.emit('closeStream', e.Code, () => {});
        });
      } catch (err) {}
      setShowAll(false);
    }
    setCamera(cam);
    setCameraSelectedId(cam.Id);
  };
  let frameState = useSelector((state) => state.frame);
  const openAlertModel = () => {
    setImageModal(frameState[camera.Code]);
    setVisibleModal(true);
    form.setFieldsValue({
      CreatedAt: moment(new Date()),
      CreatedBy: `Camera: ${camera.Code}, Building ${camera.BuildingCode}`,
      CreatedByCamera: camera.Code,
      BuildingId: camera.BuildingId,
      BuildingCode: camera.BuildingCode,
    });
  };
  // <Moment format="yyyy-MM-DD HH:mm">{new Date()}</Moment>
  const handlePositionChange = ({ target: { value: dotPosition } }) => {
    let cam = cameras.filter((e) => e.Id === dotPosition)[0];
    disableAllCamera(cam);
  };
  return (
    <Layout
      className={fullScreen ? 'fullscreen' : 'normal'}
      style={{ padding: '0 24px 24px', position: 'relative' }}
    >
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>AI Stream</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className={openSetting ? 'open__camera_setting' : ''}
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        {camera ? (
          <div>
            <Row>
              <Col span={showAll ? 8 : 12}>
                <Space align="center">
                  {!showAll ? (
                    <Button type="primary" onClick={() => enableAllCamera()}>
                      Show all
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <Radio.Group
                    onChange={handlePositionChange}
                    value={cameraSelectedId}
                    style={{ marginBottom: 8 }}
                  >
                    {cameras.map((e) => (
                      <Radio.Button key={e.Id} value={e.Id}>
                        {e.Code}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </Space>
              </Col>
              {!showAll ? (
                <Col span={2}>
                  <Button type="dashed" danger onClick={() => openAlertModel()}>
                    Alert new case
                  </Button>
                </Col>
              ) : (
                <div></div>
              )}
              <Col align="right" span={10}>
                <Button
                  type="primary"
                  onClick={() => setFullScreen(!fullScreen)}
                >
                  {!fullScreen ? (
                    <FullscreenOutlined style={{ fontSize: 20 }} />
                  ) : (
                    <FullscreenExitOutlined style={{ fontSize: 20 }} />
                  )}
                </Button>
              </Col>

              {showAll ? (
                <Col span={6}>
                  <Text>Size of camera </Text>
                  {[
                    { name: 'Large', size: 12 },
                    { name: 'Medium', size: 8 },
                    { name: 'Small', size: 6 },
                  ].map((e) => (
                    <Button onClick={() => setSizeCamera(e.size)}>
                      {e.name}
                    </Button>
                  ))}
                </Col>
              ) : (
                <div></div>
              )}
            </Row>
            {showAll ? (
              <Row>
                {cameras.map((cam, index) => (
                  <Col
                    span={sizeCamera}
                    push={
                      index === cameras.length - 1 &&
                      cameras.length % (24 / sizeCamera) === 1
                        ? (24 - sizeCamera) / 2
                        : 0
                    }
                  >
                    <div
                      onClick={() => {
                        disableAllCamera(cam);
                      }}
                    >
                      <FrameComponent raw={''} camera_code={cam.Code} />
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div>
                {showRaw ? (
                  <Row>
                    <Col span={12}>
                      <FrameComponent raw={''} camera_code={camera.Code} />
                    </Col>
                    <Col span={12}>
                      <FrameComponent raw={'RAW'} camera_code={camera.Code} />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col span={3}></Col>
                    <Col span={12}>
                      <FrameComponent raw={''} camera_code={camera.Code} />
                    </Col>
                    <Col align="center" span={2}>
                      {userOnStream.sort().map((e, i) =>
                        e.toLowerCase() !== 'unknown' ? (
                          <Tag
                            onClick={() => {
                              setModalUserInfo(true);
                              getUserByCode(e)
                                .then((res) => setCurrentUser(res.data))
                                .catch((err) => setCurrentUser(null));
                            }}
                            style={{
                              fontSize: 16,
                              padding: 10,
                              cursor: 'pointer',
                              margin: 10,
                            }}
                            color="grey"
                            key={i}
                          >
                            {e}
                          </Tag>
                        ) : (
                          <></>
                        )
                      )}
                    </Col>
                  </Row>
                )}
              </div>
            )}
          </div>
        ) : (
          <Text type="warning">
            No camera connected, please check your camera management
          </Text>
        )}
      </Content>
      <div className={openSetting ? 'tool__camera open' : 'tool__camera'}>
        <ToolOutlined onClick={() => setOpenSetting((val) => !val)} />
        <div className="body">
          <Row>
            <Col span={18}>Notification</Col>
            <Col span={6}>
              <Switch checked={sendNoti} onChange={toggleSendNoti} />
            </Col>
          </Row>
          <Row>
            <Col span={18}>Face detect</Col>
            <Col span={6}>
              <Switch checked={faceDetect} onChange={toggleFaceDetect} />
            </Col>
          </Row>
          <Row>
            <Col span={18}>Face tracking</Col>
            <Col span={6}>
              <Switch checked={tracking} onChange={toggleTracking} />
            </Col>
          </Row>
          <Row>
            <Col span={18}>Body detect</Col>
            <Col span={6}>
              <Switch checked={tinyDetect} onChange={toggleTinyDetect} />
            </Col>
          </Row>
          <Row>
            <Col span={18}>Weird hour</Col>
            <Col span={6}>
              <Switch checked={weirdHour} onChange={toggleWeirdHour} />
            </Col>
          </Row>
          <Row>
            <Col span={18}>Item detect</Col>
            <Col span={6}>
              <Switch
                checked={prohibitedItemDetect}
                onChange={toggleProhibitedItemDetect}
              />
            </Col>
          </Row>
          <Row>
            <Col span={18}>Building detect</Col>
            <Col span={6}>
              <Switch
                checked={buildingDetect}
                onChange={toggleBuildingDetect}
              />
            </Col>
          </Row>
          <Row>
            <Col span={18}>Mask detect</Col>
            <Col span={6}>
              <Switch checked={maskDetect} onChange={toggleMaskDetect} />
            </Col>
          </Row>
        </div>
      </div>
      <div className={modalUserInfo ? 'user__info open' : 'user__info'}>
        <CloseCircleOutlined onClick={() => setModalUserInfo(false)} />
        {currentUser ? ( // student | body guard
          currentUser.Username ? ( //This is user information
            <Row>
              <Col align="center" span={24}>
                <img
                  alt="this is the user "
                  src={
                    currentUser.Avatar
                      ? currentUser.Avatar
                      : environment.loading_image
                  }
                  width={200}
                  height={200}
                />
              </Col>
              <Col span={24} className={'contents'}>
                <Row>
                  <Col span={6}> Name:</Col>
                  <Col span={18}>
                    <span className="content">{currentUser.FullName}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Code:</Col>
                  <Col span={18}>
                    <span className="content">{currentUser.Code}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Birth date:</Col>
                  <Col span={18}>
                    <span className="content">
                      <Moment format="yyyy">{currentUser.BirthDate}</Moment>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Gender:</Col>
                  <Col span={18}>
                    <span className="content">
                      {currentUser.Gender ? 'Male' : 'Female'}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Email:</Col>
                  <Col span={18}>
                    <span className="content"> {currentUser.Email}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Phone:</Col>
                  <Col span={18}>
                    <span className="content"> {currentUser.Phone}</span>
                  </Col>
                </Row>

                {roles.length > 0 ? (
                  <Row>
                    <Col span={6}> Role:</Col>
                    <Col span={18}>
                      <span className="content">
                        {
                          roles.filter(
                            (role) => role.Id === currentUser.RoleId
                          )[0].Name
                        }
                      </span>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                {currentUser.RoomCode ? (
                  <Row>
                    <Col span={6}> Room:</Col>
                    <Col span={18}>
                      <span className="content">
                        {currentUser.RoomCode.toString()}
                      </span>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}

                <Row>
                  <Col span={6}> IsActive:</Col>
                  <Col span={18}>
                    <span className="content">
                      {currentUser.IsActive.toString()}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            //This is relative information
            <Row>
              <Col align="center" span={24}>
                <img
                  alt="this is the user "
                  src={
                    currentUser.Avatar
                      ? currentUser.Avatar
                      : environment.loading_image
                  }
                  width={200}
                  height={200}
                />
              </Col>
              <Col span={24} className={'contents'}>
                <Row>
                  <Col span={6}> Name:</Col>
                  <Col span={18}>
                    <span className="content">{currentUser.Name}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Age:</Col>
                  <Col span={18}>
                    <span className="content">{currentUser.Age}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Gender:</Col>
                  <Col span={18}>
                    <span className="content">
                      {currentUser.Gender ? 'Male' : 'Female'}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> TimeIn:</Col>
                  <Col span={18}>
                    <span className="content">
                      {' '}
                      {
                        <Moment format="yyyy-MM-DD HH:mm">
                          {currentUser.TimeIn}
                        </Moment>
                      }
                    </span>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col align="center" span={24} className="content">
                    <b>Relative of student</b>
                  </Col>
                </Row>
                <p></p>
                <Row>
                  <Col span={6}> Name:</Col>
                  <Col span={18}>
                    <span className="content">{currentUser.StudentName}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Code:</Col>
                  <Col span={18}>
                    <span className="content">{currentUser.StudentCode}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}> Room:</Col>
                  <Col span={18}>
                    <span className="content">{currentUser.StudentRoom}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          )
        ) : (
          <Row>
            <Col span={24}>
              <img
                alt="this is the loading"
                src={environment.loading_image}
                width={200}
                height={200}
              />
            </Col>
          </Row>
        )}
      </div>
      <Modal
        title="The information of this case"
        centered
        visible={visibleModal}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              alertNewCase(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={() => setVisibleModal(false)}
        width={1000}
        okText="Alert"
      >
        <Row>
          {camera ? (
            <Col span={12}>
              <img alt="this is the evidence" src={imageModal} width={'100%'} />
            </Col>
          ) : (
            <img
              alt="this is the loading"
              src={environment.loading_image}
              width={'100%'}
            />
          )}

          <Col span={12} className={'contents'}>
            <Form
              name="complex-form"
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item label="Date" name="CreatedAt">
                {/* <span className="content">
                    <Moment format="yyyy-MM-DD HH:mm">{new Date()}</Moment>
                  </span>{' '} */}
                <DatePicker
                  showTime
                  format="DD-MM-YYYY HH:mm:ss"
                  disabled={true}
                />
              </Form.Item>
              {camera ? (
                <div>
                  <Form.Item label="Camera" name="CreatedBy">
                    <Input disabled={true} />
                  </Form.Item>
                  <Form.Item
                    style={{ display: 'none' }}
                    label="Building"
                    name="BuildingId"
                  >
                    <Input disabled={true} />
                  </Form.Item>
                  <Form.Item
                    style={{ display: 'none' }}
                    label="CreatedByCamera"
                    name="CreatedByCamera"
                  >
                    <Input disabled={true} />
                  </Form.Item>
                  <Form.Item label="Building" name="BuildingCode">
                    <Input disabled={true} />
                  </Form.Item>
                </div>
              ) : (
                <p></p>
              )}
              <Form.Item
                name="Description"
                wrapperCol={{ span: 24 }}
                rules={[{ required: false, message: 'Province is required' }]}
              >
                <Input.TextArea
                  style={{ height: 160 }}
                  placeholder="Please input description"
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>

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

export default StandardStreamPage;
