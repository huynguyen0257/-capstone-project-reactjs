import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Layout,
  Select,
  InputNumber,
  Row,
  Col,
  Form,
  Input,
  Button,
  DatePicker,
  Spin,
  Modal,
  Upload,
} from "antd";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { useLocation } from "react-router-dom";
import { setRelative } from "../../../../redux";
import Webcam from "react-webcam";
import { useSelector, useDispatch } from "react-redux";
import { environment } from "../../../../environment";

const { Content } = Layout;
const { Option } = Select;
const style = {
  width: 250,
  height: 180,
  padding: "8px 8px",
};
const divStyleWarning = {
  width: 250,
  height: 180,
  border: "red solid",
};

function RelativeInfoForm() {
  const [err, setErr] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openCam, setOpenCam] = React.useState(false);
  const [frontImage, setFrontImage] = React.useState(null);
  const [isFront, setIsFront] = React.useState(true);
  const [backImage, setBackImage] = React.useState(null);
  const [age, setAge] = React.useState({});
  const studentState = useSelector((state) => state.student);
  const webcamRef = React.useRef(null);

  const [form] = Form.useForm();
  let { id } = useParams();
  const dispatch = useDispatch();

  React.useEffect(() => {}, []);
  const onFinish = (value) => {
    setAge({ ...validateAge(18), value: 18 });
    if (frontImage == null || backImage == null) {
      setErr(true);
    } else {
      value.FrontIdentityCardImage = frontImage.replace(
        "data:image/jpeg;base64,",
        ""
      );
      value.BackIdentityCardImage = backImage.replace(
        "data:image/jpeg;base64,",
        ""
      );
      dispatch(setRelative(value));
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onNumberChange = (value) => {
    setAge({ ...validateAge(value), value: value });
  };
  function validateAge(number) {
    // if (number >= 18 && number <=25) {
    if (number >= 5 && number <= 100) {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
    return {
      validateStatus: "error",
      errorMsg: "The age must between 5 and 100  years old",
    };
  }

  const capture = () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (isFront) {
        setFrontImage(imageSrc);
      } else {
        setBackImage(imageSrc);
      }
      setOpenCam(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Col span={24}>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{ StudentId: id, TimeIn: moment(new Date()) }}
        onFinishFailed={onFinishFailed}
        {...{ labelCol: { span: 8 }, wrapperCol: { span: 8 } }}
      >
        <Form.Item name="StudentId" style={{ display: "none" }}>
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="Name"
          rules={[
            {
              required: true,
              message: "Please input name!",
            },
            {
              min: 6,
              message: "Full name must at least 6 characters",
            },
            {
              max: 100,
              message: "Full name must not exceed 100 characters",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Age"
          name="Age"
          validateStatus={age.validateStatus}
          help={age.errorMsg}
          rules={[
            {
              required: true,
              message: "Please input age!",
            },
          ]}
        >
          <InputNumber
            min={18}
            max={120}
            value={age.value}
            onChange={onNumberChange}
          />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="Gender"
          rules={[
            {
              required: true,
              message: "Please input your gender!",
            },
          ]}
        >
          <Select style={{ width: 380 }}>
            <Option value={true}>Male</Option>
            <Option value={false}>Female</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Day in"
          name="TimeIn"
          rules={[
            {
              required: true,
              message: "Please input day in!",
            },
          ]}
        >
          <DatePicker
            disabled={true}
            style={{ width: 380 }}
            defaultValue={moment(new Date())}
          />
        </Form.Item>
        <Form.Item
          label="Identity card number"
          name="IdentityCardNumber"
          rules={[
            {
              required: true,
              message: "Please input identity card number",
            },
            {
              pattern: /^\d{9,12}$/,
              message:
                "The identity card number must have length between 9-12 and only contain digits",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Identity card image (front)"
          name="IdentityCardImageFront"
        >
          <div style={frontImage == null ? divStyleWarning : null}>
            <img
              alt={frontImage ? frontImage : environment.default_image}
              src={frontImage ? frontImage : environment.default_image}
              style={style}
              onClick={() => {
                setOpenCam(true);
                setIsFront(true);
              }}
            />
          </div>
        </Form.Item>
        <Form.Item
          label="Identity card image (back)"
          name="IdentityCardImageBack"
        >
          <div style={backImage == null ? divStyleWarning : null}>
            <img
              alt={backImage ? backImage : environment.default_image}
              src={backImage ? backImage : environment.default_image}
              onClick={() => {
                setOpenCam(true);
                setIsFront(false);
              }}
              style={style}
            />
          </div>
        </Form.Item>
        <Form.Item
          {...{
            wrapperCol: {
              offset: 8,
              span: 8,
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
      <SweetAlert
        show={done}
        success
        title="Create relative success"
        onConfirm={() => setDone(false)}
      />
      <SweetAlert
        show={err}
        error
        title="Create relative failed"
        onConfirm={() => setErr(false)}
      />

      <Modal
        title="Title"
        visible={openCam}
        onOk={capture}
        onCancel={() => setOpenCam(false)}
        okText="Capture"
        width={700}
      >
        {openCam ? (
          <div>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              audio={false}
              // height={200}
              // width={200}
              // style={{ 'transform': 'scaleX(-1)' }}
            />
          </div>
        ) : (
          <Button onClick={() => setOpenCam(true)}>Open camera</Button>
        )}
      </Modal>
    </Col>

    // </Layout>
  );
}

export default RelativeInfoForm;
