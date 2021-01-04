import React from "react";
import { Layout, Menu, Breadcrumb, Row, Spin } from "antd";
import { Form, Input, Button, Typography } from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import { checkCode, resetCode } from "./../../services";
import { useSelector, useDispatch } from "react-redux";
import {
  submitCodeReq,
  submitCodeOK,
  submitCodeFailed,
  submitMailReq,
  submitMailOK,
  submitMailFailed,
} from "./../../redux";

const { Header, Content, Footer } = Layout;
const { Text, Link } = Typography;

function CodeForm() {
  const [form] = Form.useForm();
  const [err, setErr] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('We sent the code to ');
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const resend = () => {
    console.log("resend");
    dispatch(submitMailReq(authState.mail));
    resetCode(authState.mail)
      .then((res) => {
        console.log(res);
        dispatch(submitMailOK());
      })
      .catch((err) => {
        setErr(true);
        dispatch(submitMailFailed(err.Message));
      });
  };
  const onFinish = (values) => {
    console.log(values);
    dispatch(submitCodeReq(values));
    checkCode(authState.mail, values.Code)
      .then((res) => {
        console.log(res);
        dispatch(submitCodeOK(values.Code));
      })
      .catch((err) => {
        setErr(true);
        dispatch(submitCodeFailed(err.Message));
      });
  };

  const onFinishFailed = (errorInfo) => {
    setErr(true);
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 12,
    },
  };
  const layout = {
    labelCol: {
      offset: 4,
      span: 4,
    },
    wrapperCol: {
      span: 12,
    },
  };
  return (
    <div>
      <Row justify="center">
        <Text code> {message} {authState.mail} </Text>
      </Row>
      <Form
        {...layout}
        form={form}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Code"
          name="Code"
          rules={[{ required: true, message: "Please input your Code!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Spin spinning={authState.loading}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Spin>
        </Form.Item>
        <SweetAlert
          show={err}
          error
          title="Invalid Code"
          onConfirm={() => setErr(false)}
        />
      </Form>
      <Row justify="center">
        <Text type="secondary">Don't receive code? &nbsp;</Text>
        <Typography.Link>
          <Spin spinning={authState.loading}>
            <Button onClick={() =>{
               resend()
               setMessage('We re-sent the code to ')
            }}>Resend</Button>
          </Spin>
        </Typography.Link>
      </Row>
    </div>
  );
}

export default CodeForm;
