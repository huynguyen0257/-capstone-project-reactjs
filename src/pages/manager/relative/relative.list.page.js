import React from 'react';
import { getRelatives, checkOut } from '../../../services';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Layout,
  Breadcrumb,
  Table,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Button,
  PageHeader,
  Typography,
  Skeleton,
  Spin,
} from 'antd';
import { setRelativeRegisterStep } from '../../../redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { environment } from '../../../environment/env';
import Moment from "react-moment";
const { Column } = Table;
const { Text } = Typography;
const { Content } = Layout;
const { Search } = Input;

function RelativeListPage(props) {
  const [err, setErr] = React.useState('');
  const [done, setDone] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingTable, setIsLoadingTable] = React.useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);
  const [params, setParams] = React.useState({});
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const [relatives, setRelatives] = React.useState([]);
  const [relativeDisplay, setRelativeDisplay] = React.useState([]);
  let { id } = useParams();
  const dispatch = useDispatch();

  React.useEffect(() => {
//     var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();

// today = mm + '/' + dd + '/' + yyyy;
    fetchRelatives(true, { ...pagination, TimeIn: new Date()  }).then((res) => {
      setParams({ ...params, TimeIn: new Date() });
      setPagination({ ...pagination, total: res.data.info.total });
    });
  }, []);
  const fetchRelatives = (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    setIsLoadingTable(true);
    return getRelatives(params)
      .then((relatives) => {
        setRelatives(relatives.data.results);
        setRelativeDisplay(relatives.data.results);
        setIsLoading(false);
        setIsLoadingTable(false);
        return relatives;
      })
      .catch((err) => {
        setIsLoading(false);
        setIsLoadingTable(false);
        setErr(err.message);
      });
  };
  const searchByName = async (input) => {
    fetchRelatives(false, {
      ...pagination,
      current: 1,
      ...params,
      Name: input,
    }).then((res) => {
      setParams({ ...params, Name: input });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const searchByIdentityCardNumber = async (input) => {
    fetchRelatives(false, {
      ...pagination,
      current: 1,
      ...params,
      IdentityCardNumber: input,
    }).then((res) => {
      setParams({ ...params, IdentityCardNumber: input });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const toggleCheckOut = (Id) => {
    setIsLoadingBtn(true);
    checkOut(Id)
      .then(() => {
        fetchRelatives(false, {
          ...pagination,
          ...params,
        });
        setIsLoadingBtn(false);
        setDone('Update successfully!!!');
      })
      .catch((err) => {
        setIsLoadingBtn(false);
        setErr(err.message);
      });
  };
  const handleTableChange = (pagination, sorter) => {
    delete pagination.defaultPageSize
    delete pagination.showSizeChanger
    delete pagination.pageSizeOptions
    delete pagination.showQuickJumper
    fetchRelatives(false, { ...params, ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Relatives</Breadcrumb.Item>
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
          <Col span={6}>
            <Search
              placeholder="Input relative name"
              onSearch={(value) => searchByName(value)}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Input relative identity card number"
              onSearch={(value) => searchByIdentityCardNumber(value)}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
        </Row>

        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table
            dataSource={relativeDisplay}
            rowKey="Id"
            loading={isLoadingTable}
            onChange={handleTableChange}
            pagination={{
              ...pagination,
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "40", "60"],
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} relatives`,
              position: ["topRight", "bottomRight"],
            }}
          >
            <Column
              title="No"
              // dataIndex="id"
              // key="Id"
              render={(id, record, index) => <Text>{index + 1}</Text>}
            />
            <Column title="Name" dataIndex="Name" key="Name" />
            <Column title="Age" dataIndex="Age" key="Age" align="center" />
            <Column
              title="Gender"
              dataIndex="Gender"
              key="Gender"
              align="center"
              render={(Gender) =>
                Gender === true ? <span>Male</span> : <span>Female</span>
              }
            />
            <Column
              title="Identity Card"
              dataIndex="IdentityCardNumber"
              key="IdentityCardNumber"
              align="center"
            />
            <Column
              title="Time In"
              dataIndex="TimeIn"
              key="TimeIn"
              align="center"
              render={(TimeIn) => <Moment format="DD/MM/YYYY - hh:mm:ss">{TimeIn}</Moment>}

            />
            <Column
              title="Avatar"
              dataIndex="Avatar"
              align="center"
              key="image"
              render={(image) => (
                <img
                  alt="avatar"
                  src={image ? image : environment.default_avatar_image}
                  width={200}
                  height={200}
                />
              )}
            />
            <Column
              title="Student"
              dataIndex="StudentId"
              key="StudentId"
              align="center"
              render={(StudentId,record) =>
                <Link to={`/manager/student/${StudentId}`}>
                      <span>{record.StudentName} - ({record.StudentCode})</span>
                    </Link>
              }
            />
            <Column
              title="Checkout"
              key="IsCheckout"
              dataIndex="IsCheckout"
              align="center"
              render={(IsCheckout) =>
                IsCheckout === true ? (
                  <Tag color="volcano">DONE</Tag>
                ) : (
                  <Tag color="green">NOT YET</Tag>
                )
              }
            />
            <Column
              title="Action"
              key="Id"
              align="center"
              render={(Text, Record) => (
                <Space size="middle">
                  {Record.IsCheckout ? (
                    <Spin spinning={isLoadingBtn}>
                      <Button
                        danger
                        onClick={() => toggleCheckOut(Record.Id)}
                        disabled={true}
                      >
                        Check out
                      </Button>
                    </Spin>
                  ) : (
                    <Spin spinning={isLoadingBtn}>
                      <Button danger onClick={() => toggleCheckOut(Record.Id)}>
                        Check out
                      </Button>
                    </Spin>
                  )}
                </Space>
              )}
            />
          </Table>
        )}
        <SweetAlert
          show={done.length > 0}
          success
          title={done}
          onConfirm={() => setDone('')}
        />
        <SweetAlert
          show={err.length > 0}
          error
          title={err}
          onConfirm={() => setErr('')}
        />
      </Content>
    </Layout>
  );
}

export default RelativeListPage;
