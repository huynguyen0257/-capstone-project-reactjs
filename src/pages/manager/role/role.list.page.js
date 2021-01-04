import React from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  Space,
  Input,
  Row,
  Col,
  Button,
} from "antd";
import { Link } from "react-router-dom";

import {
  getRoles as fetchRoles,
} from "../../../services";
const { Column } = Table;
const { Content } = Layout;
const { Search } = Input;
function RoleListPage() {
  const [roleDisplay, setRoleDisplay] = React.useState([]);
  const [listRole, setListRole] = React.useState([])
  // initial | constructor
  React.useEffect(() => {
    fetchRoles().then((res) => {
      setListRole(res.data)
      setRoleDisplay(res.data)

    });
  }, []);

  const search = (event) => {
    let input = event.target.value
    let roleSearch = listRole.filter((role) =>
      role.Name.toLowerCase().includes(input)
    );
    setRoleDisplay(roleSearch)
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Role list</Breadcrumb.Item>
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
          <Col span={8}>
            <Search
              placeholder="Search role"
              onChange={(value) => search(value)}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
          <Col span={2}>

          </Col>
          <Col span={7}>
          </Col>
          <Col span={3}>

          </Col>
        </Row>

        <div>
          <Table dataSource={roleDisplay} rowKey="Id">
            <Column title="Name" dataIndex="Name" key="Name" />
          </Table>
        </div>
      </Content>
    </Layout>
  );
}

export default RoleListPage;
