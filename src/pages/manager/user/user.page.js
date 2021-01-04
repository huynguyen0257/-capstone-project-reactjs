import React from 'react';
import {
  Layout,
  Breadcrumb,
  Table,
  Space,
  Row,
  Col,
  Input,
  Button,
  Skeleton,
  Alert,
  Spin,
  Typography,
  Tag,
  Select,
  Popover,
} from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { getUsers, toggleActive as fetchToggleActive } from '../../../services';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from '../../../redux';
const { Search } = Input;
const { Content } = Layout;
const { Column } = Table;
const { Option } = Select;

function UserPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);
  const [params, setParams] = React.useState({ Status: 1 });
  const [showPopover, setShowPopover] = React.useState([]);
  const history = useHistory();

  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const [users, setUsers] = React.useState([]);
  const roleState = useSelector((state) => state.role);
  const { Text } = Typography;

  React.useEffect(() => {
    // console.log("effect on");
    fetchUsers(true, { ...params, ...pagination }).then((res) => {
      console.log(res);
      setPagination({ ...pagination, total: res.data.info.total });
    });
  }, []);

  const fetchUsers = (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    setIsLoadingBtn(true);
    return getUsers(params).then((res) => {
      setUsers(res.data.results);
      setIsLoading(false);
      setIsLoadingBtn(false);
      let p = [];
      res.data.results.forEach((e) => p.push(false));
      setShowPopover(p);
      return res;
    });
  };

  const searchByUsername = (username) => {
    fetchUsers(false, {
      ...pagination,
      current: 1,
      ...params,
      Username: username,
    }).then((res) => {
      setParams({ ...params, Username: username });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByFullname = (fullname) => {
    fetchUsers(false, {
      ...pagination,
      current: 1,
      ...params,
      Fullname: fullname,
    }).then((res) => {
      setParams({ ...params, Fullname: fullname });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByRole = (RoleId) => {
    fetchUsers(false, {
      ...pagination,
      current: 1,
      ...params,
      RoleId: RoleId,
    }).then((res) => {
      setParams({ ...params, RoleId: RoleId });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByStatus = (Status) => {
    fetchUsers(false, {
      ...pagination,
      current: 1,
      ...params,
      Status: Status,
    }).then((res) => {
      setParams({ ...params, Status: Status });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const toggleActive = (Id) => {
    let userUpdate = users.filter(user => user.Id === Id);
    if(roleState.roles.filter(role => role.Id ===userUpdate[0].RoleId)[0].Name.toLowerCase() === 'student' && !userUpdate[0].IsActive){
      history.push(`/manager/user/${Id}?Edit=true`);
    }else{
      setIsLoadingBtn(true);
      fetchToggleActive(Id)
        .then(() => {
          fetchUsers(false, { ...params, ...pagination });
        })
        .catch(() => {
          setIsLoadingBtn(false);
        });
    }
  };
  const handleTableChange = (pagination, filter, sorter) => {
    // console.log(sorter)
    // console.log(sorter.column.dataIndex, sorter.order)
    delete pagination.defaultPageSize
    delete pagination.showSizeChanger
    delete pagination.pageSizeOptions
    delete pagination.showQuickJumper
    const _params = { ...params, ...pagination };
    if (sorter.column) {
      _params['OrderBy'] = sorter.column.dataIndex;
      _params['OrderType'] = sorter.order === 'ascend' ? 'ASC' : 'DESC';
    }
    fetchUsers(false, _params).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>List of user</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: '90vh',
        }}
      >
        <Row loading={isLoadingBtn}>
          <Col span={6}>
            <Search
              placeholder="Input username"
              onSearch={(value) => searchByUsername(value)}
              style={{ width: '80%' }}
              enterButton
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Input full name"
              onSearch={(value) => searchByFullname(value)}
              style={{ width: '80%' }}
              enterButton
            />
          </Col>
          <Col span={6}>
            <Select
              onChange={(value) => searchByRole(value)}
              style={{ width: '80%' }}
              placeholder="Search by role"
            >
              <Option value={null} key={-1}>
                All of roles
              </Option>
              {roleState.roles.map((role) => (
                <Option value={role.Id} key={role.Id}>
                  {role.Name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              defaultValue={1}
              onChange={(value) => searchByStatus(value)}
              style={{ width: '80%' }}
              placeholder="Search by status"
            >
              <Option value={null} key={-1}>
                All of status
              </Option>
              <Option value={1} key={1}>
                Available
              </Option>
              <Option value={0} key={0}>
                Not Available
              </Option>
            </Select>
          </Col>
          <Col span={2}>
            <Link to={'/manager/user/create'}>
              <Button type="primary" style={{ margin: 0 }}>
                {' '}
                + Create{' '}
              </Button>
            </Link>
          </Col>
        </Row>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <Table
              dataSource={users}
              rowKey="Id"
              pagination={{
                ...pagination,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '40', '60'],
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} records`,
              }}
              loading={isLoadingBtn}
              onChange={handleTableChange}
            >
              <Column
                title="No"
                dataIndex="Id"
                key="id"
                render={(id, record, index) => <Text>{index + 1}</Text>}
              />
              <Column
                title="Username"
                dataIndex="Username"
                key="username"
                align="left"
                sorter={true}
              />
              <Column
                title="Full name"
                dataIndex="FullName"
                key="fullName"
                align="left"
                sorter={true}
              />
              <Column
                title="Gender"
                dataIndex="Gender"
                key="Gender"
                align="left"
                render={(Gender) =>
                  Gender === true ? <span>Male</span> : <span>Female</span>
                }
              />
              {roleState.roles.length > 0 ? (
                <Column
                  title="Role"
                  key="RoleId"
                  dataIndex="RoleId"
                  align="left"
                  render={(RoleId) =>
                    roleState.roles.filter((r) => r.Id === RoleId)[0].Name
                  }
                />
              ) : (
                <Column />
              )}
              <Column
                title="Active"
                key="IsActive"
                dataIndex="IsActive"
                align="center"
                render={(IsActive) =>
                  IsActive === true ? (
                    <Tag style={{ width: 120 }} color="green">
                      Available
                    </Tag>
                  ) : (
                    <Tag style={{ width: 120 }} color="volcano">
                      Not Available
                    </Tag>
                  )
                }
              />
              <Column
                title="Action"
                key="Id"
                align="center"
                render={(Text, Record, index) => (
                  <Space size="middle">
                    <Link to={`/manager/user/${Record.Id}`}>
                      <Button type="dashed" style={{ margin: 0 }}>
                        View detail
                      </Button>
                    </Link>
                    {Record.Username !== 'admin@gmail.com' ? (
                      Record.IsActive ? (
                        <Spin spinning={isLoadingBtn}>
                          <Popover
                            visible={showPopover[index]}
                            onVisibleChange={(visible) => {
                              setShowPopover((oldArr) =>
                                oldArr.map((e, i) => {
                                  if (i === index) e = visible;
                                  return e;
                                })
                              );
                            }}
                            content={
                              <div>
                                <Button
                                  danger
                                  onClick={() => toggleActive(Record.Id)}
                                >
                                  Yes
                                </Button>
                                <Button
                                  onClick={() => {
                                    setShowPopover((oldArr) =>
                                      oldArr.map((e, i) => {
                                        if (i === index) e = false;
                                        return e;
                                      })
                                    );
                                  }}
                                >
                                  No
                                </Button>
                              </div>
                            }
                            title="Are use sure ?"
                            trigger="click"
                          >
                            <Button danger style={{ width: 120, margin: 0 }}>
                              Deactivate
                            </Button>
                          </Popover>
                        </Spin>
                      ) : (
                        <Spin spinning={isLoadingBtn}>
                          <Button
                            type="primary"
                            style={{ width: 120, margin: 0 }}
                            onClick={() => toggleActive(Record.Id)}
                          >
                            Active
                          </Button>
                        </Spin>
                      )
                    ) : (
                      <></>
                    )}
                  </Space>
                )}
              />
            </Table>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default UserPage;
