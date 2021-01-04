import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Row, Spin, Steps, Col, Progress } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import SweetAlert from 'react-bootstrap-sweetalert';
import {setRelativeRegisterStep} from '../../../redux'

import { Redirect, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RelativeInfoForm from './component/relative.info.form';
import RelativeFaceRegisterForm from './component/relative.face.register.form';
import RelativeFaceEnhanceForm from './component/relative.face.enhance.form';
const { Header, Content, Footer } = Layout;
const { Step } = Steps;

function RelativeCreatePage() {
  const socketState = useSelector((state) => state.socket);
  const [process, setProcess] = React.useState(0);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const socket = socketState.socket;
    // dispatch(setRelativeRegisterStep(1))
    if (socket) {
      if (!socket.hasListeners("registerRelativeFaceStatus")) {
        socket.on("registerRelativeFaceStatus", (countDone, countTotal) => {
          setProcess(Math.floor(countDone/ countTotal *100))
        })
      }
    }
    return () => {
      console.log("Destroy RelativeCreatePage Component");
      if (socketState.socket) {
        socketState.socket.removeAllListeners();
      }
    };
  }, [socketState.socket]);
  const studentState = useSelector((state) => state.student);
  let { id } = useParams();
  return (
    studentState.relativeRegisterStep === 4 ? 
    <Redirect to={`/manager/student/${id}?tabPane=3`} /> :
    <Layout style={{ minHeight: '100vh' }} className="layout">
      <Content style={{ padding: '0 50px', minHeight: '100%' }}>
        <Breadcrumb style={{ margin: '16px 0' }}></Breadcrumb>
        <div className="site-layout-content" style={{ minHeight: '100%' }}>
        <Row>
          <Progress percent={process} />
        </Row>
          <Row justify="center">
            <Col span={20}>
              <Steps current={studentState.relativeRegisterStep}>
                <Step
                  title="Register relative information"
                  description="Fill relative information and click submit button"
                />
                <Step
                  title="Register relative enhance face"
                  description="The relative must go throughout the camera."
                />
                <Step
                  title="Register relative face"
                  description="Take 9 faces."
                />
                <Step
                  title="Register relative face"
                  description="We are training."
                />
              </Steps>
            </Col>
          </Row>
          {studentState.relativeRegisterStep === 0 ? (
            // <Row>
            <RelativeInfoForm />
          ) : // </Row>
          studentState.relativeRegisterStep === 1 ? (
            <RelativeFaceRegisterForm />
          ) : // </Row>
          studentState.relativeRegisterStep === 2 ? (
            <RelativeFaceRegisterForm />
          ) : // </Row>
          studentState.relativeRegisterStep === 3 ? (
            <RelativeFaceRegisterForm />
          ) : (
            <Redirect to={`/manager/student/${id}?tabPane=3`} />
          )}

          {/* <Row>
              </>
            </Row> */}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>SDMS Team Developer</Footer>
    </Layout>
  );
}

export default RelativeCreatePage;
