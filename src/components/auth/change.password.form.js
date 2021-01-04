import React from "react";
import { Layout, Menu, Breadcrumb, Row, Spin } from "antd";
import { Form, Input, Button, Typography } from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import { submitPassword } from "./../../services";
import { useSelector, useDispatch } from "react-redux";
import {
  submitPasswordReq,
  submitPasswordOK,
  submitPasswordFailed,
} from "./../../redux";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function ChangePasswordForm() {
  const [form] = Form.useForm();
  const [err, setErr] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
 
  const onFinish = (values) => {
    console.log(values);
    if (values.Password != values.ConfirmPassword) {
      setErr(true);
      return;
    }
    dispatch(submitPasswordReq());
    submitPassword(values)
      .then((res) => {
        dispatch(submitPasswordOK());
      })
      .catch((err) => {
        setErr(true);
        dispatch(submitPasswordFailed(err.Message));
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
  React.useEffect(() => {
    form.setFieldsValue({ Email: authState.mail, Code: authState.code });
  }, []);
  return (
      <Form
        {...layout}
        form={form}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Email" name="Email" rules={[]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="Code" name="Code" rules={[]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="Password"
          rules={[
            { required: true, message: "Please input your Password!" },
            { min: 6, message: "Password must at least 6 characters!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="ConfirmPassword"
          rules={[
            { required: true, message: "Please input your ConfirmPassword!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Spin spinning={authState.loading}>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Spin>
        </Form.Item>
        <SweetAlert
          show={err}
          error
          title="Invalid new password"
          onConfirm={() => setErr(false)}
        />
      </Form>
      
  );
}

export default ChangePasswordForm;
