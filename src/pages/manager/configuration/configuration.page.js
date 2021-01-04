import React from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  Form,
  Row,
  Col,
  Button,
  Skeleton,
  InputNumber,
  Spin,
  Select,
  Card,
} from "antd";
import {
  getConfiguration,
  updateConfiguration,
  disableCamera,
} from "../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector } from "react-redux";
import { environment } from '../../../environment/env'
const { Content } = Layout;
const { Column } = Table;
const { Option } = Select;

function ConfigurationPage() {
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [weirdHourConfig, setWeirdHourConfig] = React.useState(null);

  React.useEffect(() => {
    getConfiguration(environment.key.weirdHour).then((res) => {
      setWeirdHourConfig(res.data.Value);
    });
  }, []);

  const onSubmit = (values) => {
    setIsLoading(true);
    updateConfiguration({ Key: environment.key.weirdHour, Value: values })
      .then((res) => {
        setIsLoading(false);
        setDone("Update weird time successful");
      })
      .catch((err) => {
        setIsLoading(false);
        setErr("Update weird time failure");
      });
  };
  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Configuration</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: '90vh',
        }}
      >
        <Row>
          <Col span={12}>
            {weirdHourConfig ? (
              <Card title="Weird Time Configuration" bordered={true}>
                <Form
                  onFinish={onSubmit}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={weirdHourConfig}
                >
                  <Form.Item name="startHour" label="Start Hour">
                    <InputNumber min={0} max={23} />
                  </Form.Item>
                  <Form.Item name="endHour" label="End Hour">
                    <InputNumber min={0} max={23} />
                  </Form.Item>
                  <Spin spinning={isLoading}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Spin>
                </Form>
              </Card>
            ) : (
                <Skeleton />
              )}
          </Col>
        </Row>
      </Content>
      <SweetAlert
        show={done.length > 0}
        success
        title={done}
        onConfirm={() => setDone("")}
      />
      <SweetAlert
        show={err.length > 0}
        error
        title={err}
        onConfirm={() => setErr("")}
      />
    </Layout>
  );
}

export default ConfigurationPage;
