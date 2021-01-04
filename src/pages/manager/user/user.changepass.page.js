import React from "react";
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Button,
  Spin,
} from "antd";
import { changePassword } from "../../../services";
import SweetAlert from "react-bootstrap-sweetalert";

const { Content } = Layout;

function UserChangePasswordPage() {
  const [err, setErr] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = (values) => {
    if (values.RetypePassword !== values.NewPassword) onFinishFailed();
    setIsLoading(true);
    changePassword(values.OldPassword, values.NewPassword)
      .then(() => {
        setIsLoading(false);
        setDone(true);
      })
      .catch((err) => {
        setIsLoading(false);
        setErr(true);
        console.error(err.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{ padding: 24, margin: 0, minHeight: 280 }}
      >
        <Row>
          <Col span={3} />
          <Col span={8}>
            <img style={{ width: "100%" }} src="/banner.jpg" />
          </Col>
          <Col span={9}>
            <Form
              initialValues={{
                OldPassword: "",
                NewPassword: "",
                RetypePassword: "",
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              {...{ labelCol: { span: 12 }, wrapperCol: { span: 18 } }}
            >
              <Form.Item
                label="Old password"
                name="OldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your old password!",
                  },
                  {
                    min: 6,
                    message: "Password must at least 6 characters",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New password"
                name="NewPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                  {
                    min: 6,
                    message: "Password must at least 6 characters",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Retype password"
                name="RetypePassword"
                rules={[
                  {
                    required: true,
                    message: "Please retype your new password!",
                  },
                  {
                    min: 6,
                    message: "Password must at least 6 characters",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('NewPassword') === value) {
                        return Promise.resolve();
                      }
        
                      return Promise.reject('The two passwords that you entered do not match!');
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                {...{
                  wrapperCol: {
                    offset: 12,
                    span: 12,
                  },
                }}
              >
                <Spin spinning={isLoading}>
                  <Button type="primary" htmlType="submit">
                    Save Change
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
        title="Change password success"
        onConfirm={() => setDone(false)}
      />
      <SweetAlert
        show={err}
        error
        title="Change password failed"
        onConfirm={() => setErr(false)}
      />
    </Layout>
  );
}

export default UserChangePasswordPage;
