import React from "react";
import { Layout, Menu, Breadcrumb, Row, Spin, Steps, Col } from "antd";
import { Form, Input, Button, Checkbox } from "antd";
import { MailForm, CodeForm, ChangePasswordForm } from "../../components";
import SweetAlert from "react-bootstrap-sweetalert";
import { Redirect, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const { Header, Content, Footer } = Layout;
const { Step } = Steps;

function ForgetPasswordPage() {
  const authState = useSelector((state) => state.auth);
  const timeOut = 120;
  const [timeLeft, setTimeLeft] = React.useState(timeOut);

  if (authState.step === 1) {
  }
  React.useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      if (authState.step === 1) setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, authState.step]);

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout">
      <Content style={{ padding: "0 50px", minHeight: "100%" }}>
        <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
        <div className="site-layout-content" style={{ minHeight: "100%" }}>
          <Row justify="center">
            <Col span={18}>
              <Steps current={authState.step}>
                <Step
                  title="Submit your email"
                  description="Fill your email and click submit button"
                />
                <Step
                  title="Enter your code"
                  subTitle={`Left 0${Math.floor(timeLeft/60)}:${timeLeft % 60}`  }
                  description="Please check your email"
                />
                <Step title="Change your password" />
              </Steps>
            </Col>
          </Row>
          <Row type="flex" align="middle">
            <img
              alt="logo"
              style={{ verticalAlign: "middle", margin: "auto" }}
              src="./forget.png"
            />
          </Row>
          {authState.step === 0 ? (
            <MailForm />
          ) : authState.step === 1 ? (
            <CodeForm />
          ) : authState.step === 2 ? (
            <ChangePasswordForm />
          ) : (
            <Redirect to={`/login`} />
          )}
          <Row justify="center">
            <p>You have an account &nbsp;</p>
            <Link to="/login">Login now</Link>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>SDMS Team Developer</Footer>
    </Layout>
  );
}

export default ForgetPasswordPage;
