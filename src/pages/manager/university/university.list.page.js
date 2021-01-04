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
  getUniversities as fetchUniversities,
} from "../../../services";
const { Column } = Table;
const { Content } = Layout;
const { Search } = Input;
function UniversityListPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [universityDisplay, setUniversityDisplay] = React.useState([]);
  const [listUniversity, setListUniversity] = React.useState([])
  // initial | constructor
  React.useEffect(() => {
    setIsLoading(true);
    fetchUniversities().then((res) => {
      setListUniversity(res.data)
      setUniversityDisplay(res.data)
      setIsLoading(false);


    });
  }, []);

  const search = (event) => {
    let input = event.target.value
    let universitySearch = listUniversity.filter((university) =>
      university.Name.toLowerCase().includes(input.toLowerCase())
    );
    setUniversityDisplay(universitySearch)
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>University list</Breadcrumb.Item>
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
              placeholder="Search university"
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
          <Table dataSource={universityDisplay} rowKey="Id">
            <Column title="Name" dataIndex="Name" key="Name" />
          </Table>
        </div>
      </Content>
    </Layout>
  );
}

export default UniversityListPage;
