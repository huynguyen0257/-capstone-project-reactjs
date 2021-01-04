import React from "react";
import {
  Layout,
  Select,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Button,
  DatePicker,
  Spin,
  Skeleton,
} from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import { getUniversityById, updateUniversity } from "../../../services";
import { useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

const { Content } = Layout;
function UniversityDetailPage() {
  const [err, setErr] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isView, setView] = React.useState(true);
  const [university, setUniversity] = React.useState(null);
  const universityState = useSelector((state) => state.university);

  const onUpdate = (values) => {
    setIsLoading(true);
    updateUniversity(values)
      .then(() => {
        setView(true);
        setIsLoading(false);
        setDone(true);
      })
      .catch((err) => {
        setErr(true);
      });
  };
  let { id } = useParams();
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  React.useEffect(() => {
    setIsLoading(true);
    getUniversityById(id).then((res) => {
        setUniversity(res.data);
      setIsLoading(false);
    });
  }, []);

  return !university ? (
    <Skeleton active />
  ) : (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>University Detail</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{ padding: 24, margin: 0, minHeight: 280 }}
      >
        <Row>
          <Col span={3} />
          <Col span={10}>
            <Form
              initialValues={university}
              onFinish={onUpdate}
              onFinishFailed={onFinishFailed}
              {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
            >
              <Form.Item name="Id" style={{ display: "none" }}>
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="Name"
                name="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input name of university!",
                  },
                ]}
              >
                <Input disabled={isView} />
              </Form.Item>
        
              <Form.Item
                {...{
                  wrapperCol: {
                    offset: 8,
                    span: 16,
                  },
                }}
              >
                {!isView ? (
                  <Spin spinning={isLoading}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Spin>
                ) : (
                  ""
                )}
                {isView ? (
                  <Button
                    danger
                    htmlType="button"
                    onClick={() => setView(false)}
                  >
                    Edit
                  </Button>
                ) : (
                  ""
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
      <SweetAlert
        show={done}
        success
        title="Update success"
        onConfirm={() => setDone(false)}
      />
      <SweetAlert
        show={err}
        error
        title="Update failed"
        onConfirm={() => setErr(false)}
      />
    </Layout>
  );
}

export default UniversityDetailPage;
