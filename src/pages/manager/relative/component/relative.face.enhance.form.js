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
} from 'antd';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link, useParams, Redirect } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useSelector, useDispatch } from 'react-redux';
import { pushImage, resetImage } from '../../../../redux';
import {environment} from '../../../../environment'
import {submitRelative, setFrame} from '../../../../redux'
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

function RelativeFaceEnhanceForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState("");
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
              height: res.data.info.bottom - res.data.info.top
            };
            //yaw pitch roll
            for (var i = 0; i < face_point.length; i++) {
              if (
                Math.abs(parseFloat(headpose[0]) - face_point[i][0]) < environment.constant_data.error_of_face_angle &&
                Math.abs(parseFloat(headpose[1]) - face_point[i][1]) < environment.constant_data.error_of_face_angle
              ) {
                let newimage = await getCroppedImg(
                  imageSrc,
                  faceData
                );
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
      if (!socket.hasListeners("takeFaceEnhanceImage")) {
        socket.on("takeFaceEnhanceImage", (image, code) => {
          console.log("take image");
          dispatch(
            setFrame(`enhance${code}`, false, "data:image/jpg;base64," + image)
          );
        });
        socket.on("takeImageEnhance", async (images) => {
          console.log("takeImageEnhance");
          let realImages = []
          for(let image of images) {
            let newimage = await getCroppedImg(
              "data:image/jpg;base64," + image.image,
              {
                x: image.info.left,
                y: image.info.top,
                width: image.info.right - image.info.left,
                height: image.info.bottom - image.info.top
              }
            );
            realImages.push(newimage)
          }          
          setImageEnhances(realImages);
        });
      }
      if (!socket.hasListeners("registerFaceStatus")) {
        socket.on("registerFaceStatus", (countDone, countTotal) => {
          setProcess(Math.floor(countDone/ countTotal *100))
        })
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
        (image_obj) =>
        image_obj.image ===
          environment.default_avatar_image
      ).length > 0
    ) {
      setErr("ERROR: please take fully 9 images!!!!");
    } else {
      let FaceImages = faceState.images.map((image_obj) =>
        image_obj.image.replace('data:image/jpeg;base64,', '')
      );
      let FaceImagesEnhance = imageEnhances.map((image) => 
        image.replace("data:image/jpg;base64,", "")
      )
      FaceImages = FaceImages.concat(FaceImagesEnhance)
      console.log('Relative register');
      setIsLoading(true);
      createRelative(studentState.relative)
        .then((res) => {
          console.log("createRelative.then");
          console.log(res);
          registerRelativeFace({
            FaceImages: FaceImages,
            Id: res.data.Id,
          })
            .then(() => {
              console.log("registerRelativeFace.then");
              dispatch(resetImage());
              dispatch(submitRelative())
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
  const onUpdate = async (studentState) => {
    // setIsLoading(true);
    // if (values.DayIn) values.DayIn = values.DayIn.toDate();
    // if (values.DayOut) values.DayOut = values.DayOut.toDate();

    //save image
    saveImage();
  };
  const onReset = async () => {
    dispatch(resetImage());
  }

  let startRecord = () => {
    const socket = socketState.socket;
    socket.emit("openStreamEnhance", () => {
      setOpenRecord(true);
    });
  };
  let stopRecord = () => {
    const socket = socketState.socket;
    socket.emit("closeStreamEnhance", () => {
      setOpenRecord(false);
    });
  };
  let confirmEnhance = () => {
    setStep(1);
  };

  const removeImageEnhance = (index, element) => {
    const socket = socketState.socket;
    socket.emit("removeImageEnhance", index, () => {
      console.log(index);
      setImageEnhances((oldArr) => oldArr.filter((e) => element != e));
    });
  };

  return (
    
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Student</Breadcrumb.Item>
        <Breadcrumb.Item>Register to enter dorm</Breadcrumb.Item>
        <Breadcrumb.Item>Register face</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Row style={{ minHeight: '300px' }} justify="center">
          {openCam ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              audio={false}
              style={{'transform': 'scaleX(-1)'}}
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
          <Button
            type="reset"
            onClick={onReset}
          >
            Reset
          </Button>
          {/* <Link to={"/manager/student-dorm"}>
            <Button type="primary" onClick={() => onUpdate()}>Create</Button>{" "}
          </Link> */}
          <Col span={8}>
            <Form
              form={form}
              // initialValues={student}
              onFinish={onUpdate}
            >
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
        </Row>
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
        onConfirm={() => setErr("")}
      />
    </Layout>
  );
}
export default RelativeFaceEnhanceForm;
