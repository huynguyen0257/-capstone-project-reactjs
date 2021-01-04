import React from 'react';
import {
  Layout,
  Breadcrumb,
  Space,
  Descriptions,
  Button,
  Spin,
  Form,
  Row,
  Col,
  Divider,
  Image,
} from 'antd';
import SweetAlert from 'react-bootstrap-sweetalert';
import { VideoCameraOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Link, useParams, Redirect } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useSelector, useDispatch } from 'react-redux';
import { pushImage, resetImage, setRelativeRegisterStep } from '../../../../redux';
import { environment } from '../../../../environment';
import { submitRelative, setFrame } from '../../../../redux';
import { FrameComponent } from '../../../../components';
import {
  checkYPR,
  registerRelativeFace,
  createRelative,
  getCroppedImg,
  getCameras,
} from '../../../../services';
const style = {
  width: '11.1%',
  height: 150,
  padding: '8px 8px',
  transform: 'scaleX(-1)',
};
const { Content } = Layout;

const face_point = [
  [-27, 0, 0], // giữ nguyên đầu nghiên phải
  [27, 0, 0], // giữ nguyên đầu nghiên trái
  [-18, 8, 0], // nhìn lên bên phải
  [18, 8, 0], // nhìn lên bên trái
  [0, -10, 0], // nhìn thẳng lên
  [0, 15, 0], // nhìn thẳng xuống
  [-27, -9, 0], // nhìn xuống phải
  [27, -9, 0], // nhìn xuống trái
  [0, 0, 0], // nhìn thẳng
];

function RelativeFaceRegisterForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [openCam, setOpenCam] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [isDoneWebcam, setIsDoneWebcam] = React.useState(false);
  const [openRecord, setOpenRecord] = React.useState(false);
  const [imageEnhances, setImageEnhances] = React.useState([]);
  const [cameras, setCameras] = React.useState([]);
  const [process, setProcess] = React.useState(0);
  const socketState = useSelector((state) => state.socket);
  const faceState = useSelector((state) => state.face);
  const studentState = useSelector((state) => state.student);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const webcamRef = React.useRef(null);

  const capture = () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        checkYPR(imageSrc.replace('data:image/jpeg;base64,', ''))
          .then(async (res) => {
            const headpose = res.data.headpose;
            const faceData = {
              x: res.data.info.left,
              y: res.data.info.top,
              width: res.data.info.right - res.data.info.left,
              height: res.data.info.bottom - res.data.info.top,
            };
            //yaw pitch roll
            for (var i = 0; i < face_point.length; i++) {
              if (
                Math.abs(parseFloat(headpose[0]) - face_point[i][0]) <
                  environment.constant_data.error_of_face_angle &&
                Math.abs(parseFloat(headpose[1]) - face_point[i][1]) <
                  environment.constant_data.error_of_face_angle
              ) {
                let newimage = await getCroppedImg(imageSrc, faceData);
                // dispatch(pushImage("data:image/jpeg;base64," + newimage, i));
                dispatch(pushImage(imageSrc, i, false));
              }
            }
          })
          .catch((e) => console.error(e));
      }
    } catch (e) {
      // console.error(e)
    }
  };

  React.useEffect(() => {
    const frame_ = faceState.images.filter((image_obj) => image_obj.isFake).length;

    console.log('numberOfFaceImg: ', frame_);
    if (frame_ === 0) {
      setOpenCam(false);
    }
  }, [faceState.images]);

  React.useEffect(() => {
    fetchCameras();
    setInterval(capture, 300);
  }, []);

  React.useEffect(() => {
    const socket = socketState.socket;
    if (socket) {
      if (!socket.hasListeners('takeFaceEnhanceImage')) {
        socket.on('takeFaceEnhanceImage', (image, code) => {
          console.log('take image');
          dispatch(
            setFrame(`enhance${code}`, false, 'data:image/jpg;base64,' + image)
          );
        });
        socket.on('takeImageEnhance', async (images) => {
          console.log('takeImageEnhance');
          let realImages = [];
          for (let image of images) {
            let newimage = await getCroppedImg(
              'data:image/jpg;base64,' + image.image,
              {
                x: image.info.left,
                y: image.info.top,
                width: image.info.right - image.info.left,
                height: image.info.bottom - image.info.top,
              }
            );
            realImages.push(newimage);
          }
          // console.log(images);
          // if (images && images.length === 0) {
          //   realImages.push(environment.default_avatar_image);
          // }
          setImageEnhances(realImages);
        });
      }
      if (!socket.hasListeners('registerFaceStatus')) {
        socket.on('registerFaceStatus', (countDone, countTotal) => {
          setProcess(Math.floor((countDone / countTotal) * 100));
        });
      }
    }
    return () => {
      if (socketState.socket) {
        socketState.socket.removeAllListeners();
      }
    };
  }, [socketState.socket]);

  const fetchCameras = () => {
    return getCameras({ Type: 1 }).then((res) => {
      setCameras(res.data.results);
      setIsLoading(false);
    });
  };

  const saveImage = () => {
    if (
      faceState.images.filter(
        (image_obj) => image_obj.image === environment.default_avatar_image
      ).length > 0
    ) {
      setErr('ERROR: please take fully 9 images!!!!');
    } else {
      dispatch(setRelativeRegisterStep(3));
      let FaceImages = faceState.images.map((image_obj) =>
        image_obj.image.replace('data:image/jpeg;base64,', '')
      );
      let FaceImagesEnhance = imageEnhances.map((image) =>
        image.replace('data:image/jpg;base64,', '')
      );
      FaceImages = FaceImages.concat(FaceImagesEnhance);
      console.log('Relative register');
      setIsLoading(true);
      createRelative(studentState.relative)
        .then((res) => {
          console.log('createRelative.then');
          console.log(res);
          registerRelativeFace({
            FaceImages: FaceImages,
            Id: res.data.Id,
          })
            .then(() => {
              console.log('registerRelativeFace.then');
              dispatch(resetImage());
              dispatch(submitRelative());
              setIsLoading(false);
              setDone(true);
            })
            .catch(() => {
              setIsLoading(false);
              setErr(true);
            });
        })
        .catch(() => {
          setErr(true);
          setIsLoading(false);
        });
    }
  };
  const onReset = async () => {
    dispatch(resetImage());
  };

  let startRecord = () => {
    const socket = socketState.socket;
    socket.emit('openStreamEnhance', () => {
      setOpenRecord(true);
    });
  };
  let stopRecord = () => {
    const socket = socketState.socket;
    socket.emit('closeStreamEnhance', () => {
      setOpenRecord(false);
    });
  };
  let confirmEnhance = () => {
    dispatch(setRelativeRegisterStep(2))
  };
  const onCreate = async () => {
    saveImage();
  };

  const removeImageEnhance = (index, element) => {
    const socket = socketState.socket;
    socket.emit('removeImageEnhance', index, () => {
      console.log(index);
      setImageEnhances((oldArr) => oldArr.filter((e) => element != e));
    });
  };

  return (
    <div>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        {studentState.relativeRegisterStep === 1 ? (
          <Row style={{ minHeight: 300 }} justify="center">
            {openRecord ? (
              <Row justify="center">
                <Col align="center" span={24}>
                  <Button
                    type="danger"
                    icon={<VideoCameraOutlined className="Blink" />}
                    onClick={stopRecord}
                  >
                    Stop record
                  </Button>
                </Col>
                {cameras.map((camera) => (
                  <Col span={12}>
                    <FrameComponent
                      raw=""
                      camera_code={`enhance${camera.Code}`}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Button onClick={startRecord}>Start record</Button>
            )}

            <Col span={24}></Col>
            {imageEnhances.map((e, index) => (
              <Col className="image__enhance_group" align="center" span={4}>
                <CloseCircleOutlined
                  onClick={() => removeImageEnhance(index, e)}
                  className="image__enhance_delete"
                />
                <Image
                  className="image__enhance"
                  src={`data:image/jpg;base64,${e}`}
                  // src={`${e}`}
                  alt="alt"
                />
                {/* <img src={`${e}`} alt="alt" width="100%" /> */}
              </Col>
            ))}
          </Row>
        ) : (
          <Row></Row>
        )}
        <Row justify="center">
          {studentState.relativeRegisterStep === 1 && imageEnhances.length > 0 ? (
            <Button type="primary" htmlType="submit" onClick={confirmEnhance}>
              Confirm
            </Button>
          ) : (
            <></>
          )}
        </Row>

        {studentState.relativeRegisterStep === 2 ? (
          <Row justify="center">
            {openCam ? (
              <Row justify="center">
                <Col span={24}>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    audio={false}
                    style={{ transform: 'scaleX(-1)' }}
                  />
                </Col>
                <Col>
                  <Button
                    type="danger"
                    onClick={() => {
                      setOpenCam(false);
                    }}
                  >
                    Stop
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row justify="center" style={{ minHeight: 300 }}>
                <Button onClick={() => setOpenCam(true)}>Open camera</Button>
                <Button
                  type="reset"
                  onClick={() => {
                    dispatch(resetImage());
                  }}
                >
                  Reset
                </Button>
              </Row>
            )}
          </Row>
        ) : (
          <Row></Row>
        )}
        <Row>
          {faceState.images.map((image_obj, i) => (
            <img key={i} src={image_obj.image} style={style} />
          ))}
        </Row>
        {studentState.relativeRegisterStep === 1 ? (
          <></>
        ) : (
          <Row justify="center">
            <Spin spinning={isLoading}>
              <Button onClick={onCreate} type="primary" htmlType="submit">
                Create
              </Button>
            </Spin>
            <Col span={24}></Col>
            {imageEnhances.map((e, index) => (
              <Col className="image__enhance_group" align="center" span={4}>
                <CloseCircleOutlined
                  onClick={() => removeImageEnhance(index, e)}
                  className="image__enhance_delete"
                />
                <Image
                  className="image__enhance"
                  src={`data:image/jpg;base64,${e}`}
                  alt="alt"
                />
                {/* <img src={`${e}`} alt="alt" width="100%" /> */}
              </Col>
            ))}
          </Row>
        )}
        {/* 
        <Row style={{ minHeight: '300px' }} justify="center">
          {openCam ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              audio={false}
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            <Button onClick={() => setOpenCam(true)}>Open camera</Button>
          )}
        </Row>
        <Row style={{ minHeight: '300px' }} justify="center">
          {faceState.images.map((image_obj, i) => (
            <img key={i} src={image_obj.image} style={style} />
          ))}
        </Row>
        <Row justify="center">
          <Button
            type="danger"
            onClick={() => {
              setOpenCam(false);
            }}
          >
            Stop
          </Button>
          <Button type="reset" onClick={onReset}>
            Reset
          </Button>
          <Col span={8}>
            <Form form={form} onFinish={onUpdate}>
              <Form.Item
                {...{
                  wrapperCol: {
                    offset: 8,
                    span: 16,
                  },
                }}
              >
                <Spin spinning={isLoading}>
                  <Button type="primary" htmlType="submit">
                    Create
                  </Button>
                </Spin>
              </Form.Item>
            </Form>
          </Col>
        </Row> */}
      </Content>

      <SweetAlert
        show={done}
        success
        title="Create user success"
        onConfirm={() => setDone(false)}
      />

      <SweetAlert
        show={err.length > 0}
        error
        title={err}
        onConfirm={() => setErr('')}
      />
    {/* </Layout> */}
    </div>
  );
}
export default RelativeFaceRegisterForm;
