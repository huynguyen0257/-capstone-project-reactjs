import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Spin,
  Typography,
  Col,
} from "antd";
import { Redirect, Link } from "react-router-dom";
import { isAuth, fetchLogin, authenticate, checkToken } from "./../../services";
import { useSelector, useDispatch } from "react-redux";

// import SweetAlert from "sweetalert-react";
import SweetAlert from "react-bootstrap-sweetalert";
const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const layout = {
  labelCol: {
    offset: 3,
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 12,
  },
};
export function LoginPage(props) {
  const [form] = Form.useForm();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const authState = useSelector((state) => state.auth);

  const onFinish = (values) => {
    console.log(values);
    setLoading(true);
    fetchLogin(values)
      .then((res) => {
        authenticate(res, values.Username,res.Role, () => {
          setLoading(false);
          setRole(res.Role);
        });
      })
      .catch((e) => {
        setLoading(false);
        if (e.response.data.message === "The account is disabled") {
          setErr("The account is disabled");
        } else {
          setErr("Invalid username or password");
        }
      });
  };
  React.useEffect(() => {
    form.setFieldsValue({
      Username: authState.mail,
    });
    if (isAuth()) {
      checkToken().then((res) => {
        setRole(res.data.RoleName);
      });
    }
    return () => {};
  }, []);

  const onFinishFailed = (errorInfo) => {
    setErr("Invalid username or password");
  };

  return role ? (
    role === "Manager" ? (
      <Redirect to={`/manager`} />
    ) : role === "Building Guard" ? (
      <Redirect to={`/building-guard`} />
    ) : (
      <Redirect to={`/invalid-role`} />
    )
  ) : (
    <Layout style={{ minHeight: "100vh" }} className="layout">
      <Content style={{ padding: "100px 50px", minHeight: "100%" }}>
        <Row justify="center">
          <Col span={16}>
            <div
              className="site-layout-content"
              style={{
                minHeight: "100%",
                boxShadow: "inset rgb(108 131 165) 1px 1px 10px 2px",
                borderRadius: 5,
              }}
            >
              <Row type="flex" align="middle">
                <Col span={12} align="center">
                  <img
                    alt="logo"
                    style={{
                      verticalAlign: "middle",
                      margin: "auto",
                      width: "90%",
                    }}
                    src="./banner.jpg"
                  />
                </Col>
                <Col span={12} align="center">
                  <h1 style={{ fontFamily: "Permanent Marker, cursive" }}>
                    SDMS
                  </h1>
                  <Form
                    form={form}
                    {...layout}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    <Form.Item
                      label="Username"
                      name="Username"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                        { type: "email", message: "Email in invalid format!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name="Password"
                      rules={[
                        {
                          required: true,
                          message: "Password must be more than 6 characters!",
                          min: 6,
                        },
                        {
                          max: 128,
                          message: "Password must not exceed 128 characters",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                      <Spin spinning={loading}>
                        <Button type="primary" htmlType="submit">
                          Login
                        </Button>
                      </Spin>
                    </Form.Item>
                    <Row justify="center">
                      <Text type="secondary">
                        Don't remember your password? &nbsp;
                      </Text>
                      <Typography.Link>
                        <Link to="/forgetpassword">Reset password now</Link>
                      </Typography.Link>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: "center" }}>SDMS Team Developer</Footer>
      <SweetAlert
        show={err.length > 0}
        error
        title={err}
        onConfirm={() => setErr("")}
      />
    </Layout>
  );
}

export default LoginPage;
