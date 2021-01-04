import React from "react";
import { Layout, Menu, Breadcrumb, Row, Spin } from "antd";
import { Form, Input, Button, Checkbox } from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import { resetCode } from "./../../services";
import { useSelector, useDispatch } from "react-redux";
import { submitMailReq, submitMailOK, submitMailFailed } from "./../../redux";

const { Header, Content, Footer } = Layout;

function MailForm() {
  const [form] = Form.useForm();
  const [err, setErr] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    form.setFieldsValue({ Email: "xhunter1412@gmail.com" });
  }, []);
  const onFinish = (values) => {
    console.log(values);
    dispatch(submitMailReq(values.Email));
    resetCode(values.Email)
      .then((res) => {
        console.log(res)
        dispatch(submitMailOK());
      })
      .catch((err) => {
        setErr(true);
        dispatch(submitMailFailed(err.Message));
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
    <Form
      {...layout}
      form={form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Email"
        name="Email"
        rules={[
          { required: true, message: "Please input your Email!" },
          { type: "email", message: "Email in invalid format!" },
        ]}
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
        title="Invalid Email"
        onConfirm={() => setErr(false)}
      />
    </Form>
  );
}

export default MailForm;
