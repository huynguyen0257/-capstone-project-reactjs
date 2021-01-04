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
} from "antd";
import SweetAlert from "react-bootstrap-sweetalert";
import { createUniversity } from "../../../services";
const { Content } = Layout;
function UniversityCreatePage() {
  const [err, setErr] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [form] = Form.useForm();

  console.log()
  
  const onFinish = (values) => {
    setIsLoading(true);
    createUniversity(values)
      .then(() => {
        setDone(true);
        setIsLoading(false);
      })
      .catch(() => {
        setErr(true);
        setIsLoading(false);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>University</Breadcrumb.Item>
        <Breadcrumb.Item>Create</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{ padding: 24, margin: 0, minHeight: 280 }}
      >
        <Row>
          <Col span={16}>
            <Form
              form={form}
              initialValues={{}}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              {...{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
            >
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
                <Input />
              </Form.Item>
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
        title="Create university success"
        onConfirm={() => setDone(false)}
      />
      <SweetAlert
        show={err}
        error
        title="Create university failed"
        onConfirm={() => setErr(false)}
      />
    </Layout>
  );
}

export default UniversityCreatePage;
