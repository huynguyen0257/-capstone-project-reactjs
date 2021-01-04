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
  Select,
  Upload,
  Modal,
  Tag,
  Typography,
  Switch,
  Popover,
} from 'antd';
import TableCellEdit, {
  EditableRow,
} from '../student/component/table.cell.edit';

import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router-dom';
import {
  getSecurityGuard,
  createListSecurityGuard,
  toggleOnline as fetchToggleOnline,
  toggleActive,
  removeFaceImage as removeFaceImageService,
} from '../../../services';
import Moment from 'react-moment';
import { useSelector, useDispatch } from 'react-redux';
import { environment } from '../../../environment/env';
import XLSX from 'xlsx';
import { setUserRegisterFace } from '../../../redux';
const { Search } = Input;
const { Content } = Layout;
const { Column } = Table;
const { Option } = Select;
var security_guard_data = [];

function SecurityManListPage() {
  const [isLoadingTable, setIsLoadingTable] = React.useState(false);
  const [params, setParams] = React.useState({});
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const [done, setDone] = React.useState('');
  const [err, setErr] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [securityMan, setSecurityMan] = React.useState([]);
  const [fileUpload, setFileUpload] = React.useState(null);
  const [securityGuardData, setSecurityGuardData] = React.useState([]);
  const [showPopover, setShowPopover] = React.useState([]);
  const [modelVisible, setModelVisible] = React.useState(false);
  const { Text } = Typography;
  const dispatch = useDispatch();
  const roleState = useSelector((state) => state.role);

  React.useEffect(() => {
    fetchSecurityMan(true, { ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  }, []);
  const validateData = (data, totalData, index) => {
    for (let i = 0; i < data.length; i++) {
      const guard = data[i];
      guard.valid = [];
      if(!guard.Code || typeof guard.Code !== typeof "" || !guard.Code.match(/^[A-Za-z0-9-]{3,20}$/)) {
        guard.valid.push({
          title: 'Code',
          message: `The code is invalid`,
        });
      }
      if(!guard.FullName || typeof guard.FullName !== typeof "" || guard.FullName.length < 5 ||guard.FullName.length > 100) {
        guard.valid.push({
          title: 'FullName',
          message: `The Full Name is invalid`,
        });
      }
      if (
        !guard.BirthDate ||
        typeof guard.BirthDate !== typeof new Date() ||
        guard.BirthDate.getFullYear() < 1950 ||
        guard.BirthDate.getFullYear() > new Date().getFullYear() - 16
      ) {
        guard.valid.push({
          title: 'BirthDate',
          message: `Birth date must between 1950 and ${
            new Date().getFullYear() - 16
          }`,
        });
      }
      if (
        !guard.Email ||
        typeof guard.Email !== typeof '' ||
        !guard.Email.includes('@')
      ) {
        guard.valid.push({ title: 'Email', message: 'email is invalid' });
      }
      if (
        !guard.Gender ||
        typeof guard.Gender !== typeof '' ||
        !['nam', 'nữ'].includes(guard.Gender.toLowerCase())
      ) {
        guard.valid.push({
          title: 'Gender',
          message: `Gender must be 'nam' or 'nữ'`,
        });
      }
      if (
        !guard.Phone ||
        !/^\d+$/.test(guard.Phone) ||
        typeof guard.Phone !== typeof '' ||
        guard.Phone.length != 10
      ) {
        guard.valid.push({
          title: 'Phone',
          message: `Phone can not contain text and must be 10 characters`,
        });
      }
      if (
        !guard.RoleName ||
        typeof guard.RoleName !== typeof '' ||
        !['area guard', 'building guard', 'manager'].includes(
          guard.RoleName.toLowerCase()
        )
      ) {
        guard.valid.push({
          title: 'RoleName',
          message:
            "Role Name is invalid. Role name valid is 'area guard','building guard','manager'",
        });
      }
      if (totalData) {
        for (let i = 0; i < totalData.length; i++) {
          const b = totalData[i];
          if (i === index) continue;
          if (
            typeof b.Email === typeof '' &&
            b.Email.toLowerCase() === guard.Email.toLowerCase()
          ) {
            guard.valid.push({
              title: 'Email',
              message: `Email is duplicated again`,
            });
            break;
          }
        }
      } else {
        for (var j = i - 1; j >= 0; j--) {
          const b = data[j];
          if (
            typeof b.Email === typeof '' &&
            b.Email.toLowerCase() === guard.Email.toLowerCase()
          ) {
            guard.valid.push({
              title: 'Email',
              message: `Email is duplicated`,
            });
            b.valid.push({ title: 'Email', message: `Email is duplicated` });
          }
        }
      }
    }
  };
  const showDataInFile = () => {
    if (fileUpload) {
      /* Boilerplate to set up FileReader */
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {
          type: rABS ? 'binary' : 'array',
          bookVBA: true,
          cellDates: true,
          dateNF: 'dd/mm/yyyy;@',
        });
        /* Get first worksheet */
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        /* Convert array of arrays */
        security_guard_data = XLSX.utils.sheet_to_json(ws, { range: 2 });
        validateData(security_guard_data);
        setSecurityGuardData(
          security_guard_data.sort((a, b) => -(a.valid.length - b.valid.length))
        );
      };
      if (rABS) {
        reader.readAsBinaryString(fileUpload);
        setModelVisible(true);
      } else {
        reader.readAsArrayBuffer(fileUpload);
      }
    }
  };

  const uploadFile = () => {
    validateData(securityGuardData);
    if (fileUpload) {
      /* Update state */
      setIsLoadingTable(true);
      createListSecurityGuard({ SecurityGuards: securityGuardData })
        .then((result) => {
          setModelVisible(false);
          setDone(result.data.message);
          setIsLoadingTable(false);
        })
        .catch((res) => {
          setErr(res.response.data.message);
          setIsLoadingTable(false);
          setSecurityGuardData(
            res.response.data.data.map((e) => {
              e.BirthDate = new Date(e.BirthDate);
              return e;
            })
          );
        });
      setFileUpload(null);
    }
  };

  const fetchSecurityMan = (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    setIsLoadingTable(true);
    return getSecurityGuard(params).then((res) => {
      setSecurityMan(res.data.results);
      setIsLoading(false);
      setIsLoadingTable(false);
      let p = [];
      res.data.results.forEach((e) => p.push(false));
      setShowPopover(p);
      return res;
    });
  };

  const searchByFullName = (fullname) => {
    if (!fullname || fullname.length === 0) fullname = null;

    fetchSecurityMan(false, {
      ...pagination,
      current: 1,
      ...params,
      Fullname: fullname,
    }).then((res) => {
      setParams({ ...params, Fullname: fullname });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByRole = (roleId) => {
    fetchSecurityMan(false, {
      ...pagination,
      current: 1,
      ...params,
      RoleId: roleId,
    }).then((res) => {
      setParams({ ...params, RoleId: roleId });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByCode = (code) => {
    if (!code || code.length === 0) code = null;
    fetchSecurityMan(false, {
      ...pagination,
      current: 1,
      ...params,
      Code: code,
    }).then((res) => {
      setParams({ ...params, Code: code });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const handleTableChange = (pagination, filter, sorter) => {
    const _params = { ...params, ...pagination };
    if (sorter.column) {
      _params['OrderBy'] = sorter.column.dataIndex;
      _params['OrderType'] = sorter.order === 'ascend' ? 'ASC' : 'DESC';
    }
    fetchSecurityMan(false, _params).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };

  const toggleOnline = (id, online) => {
    fetchToggleOnline(id, !online).then((e) => {
      fetchSecurityMan(false, { ...params, ...pagination });
    });
  };

  const editable = (record, index) => {
    validateData([record], securityGuardData, index);
    setSecurityGuardData((arr) =>
      arr.map((e, i) => {
        if (i === index) return record;
        return e;
      })
    );
  };
  const checkout = (id, index) => {
    // update DB
    toggleActive(id, null);
    // update UI
    setSecurityMan((list) =>
      list.map((guard) => {
        if (guard.Id === id) guard.IsActive = false;
        return guard;
      })
    );
    setShowPopover((oldArr) =>
      oldArr.map((e, i) => {
        if (i === index) e = false;
        return e;
      })
    );
  };
  const removeFaceImage = (userId) => {
    setIsLoading(true);
    removeFaceImageService({Id: userId})
    .then(()=>{
      // update UI
      setSecurityMan((list) =>
      list.map((guard) => {
        if (guard.Id === userId) guard.IsRegisterFace = 0;
        return guard;
      })
      );
      setDone("Remove successfully");
      setIsLoading(false);
    })
    .catch(res => {
      setErr("Remove fail");
      setIsLoading(false);
    });
    
  };

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Modal
        className={'full__size'}
        title="Preview security guard information from excel"
        visible={modelVisible}
        footer={[
          <Button key="back" onClick={() => setModelVisible(false)}>
            Return
          </Button>,
          <Button
            disabled={
              securityGuardData.filter((e) => e.valid && e.valid.length > 0)
                .length > 0
            }
            loading={isLoadingTable}
            key="submit"
            type="primary"
            onClick={uploadFile}
          >
            Submit
          </Button>,
        ]}
        onCancel={() => setModelVisible(false)}
      >
        <div>
          Error:
          <span
            className={
              securityGuardData.filter((e) => e.valid && e.valid.length > 0)
                .length > 0
                ? 'error__message'
                : 'validate__message'
            }
          >
            {
              securityGuardData.filter((e) => e.valid && e.valid.length > 0)
                .length
            }{' '}
            / {securityGuardData.length} Records
          </span>
        </div>
        <Table
          loading={isLoadingTable}
          rowClassName={(record, index) =>
            record.valid.length > 0
              ? `error ${record.valid
                  .map((v) => v.title.toLowerCase())
                  .join(' ')}`
              : 'validated'
          }
          bordered
          dataSource={securityGuardData}
          rowKey="Code"
          align="center"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '40', '60'],
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          components={{ body: { row: EditableRow, cell: TableCellEdit } }}
        >
          <Column
            title="CODE"
            className={'code'}
            dataIndex="Code"
            key="Code"
            align="center"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'Code',
              title: 'CODE',
              handleSave: editable,
            })}
          />
          <Column
            className={'fullname'}
            title="FULL NAME"
            dataIndex="FullName"
            key="FullName"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'FullName',
              title: 'FULL NAME',
              handleSave: editable,
            })}
          />
          <Column
            className={'email'}
            title="EMAIL"
            dataIndex="Email"
            key="Email"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'Email',
              title: 'EMAIL',
              handleSave: editable,
            })}
          />
          <Column
            className={'phone'}
            title="PHONE"
            dataIndex="Phone"
            key="Phone"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'Phone',
              title: 'PHONE',
              handleSave: editable,
            })}
          />
          <Column
            className={'gender'}
            title="GENDER"
            dataIndex="Gender"
            key="Gender"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'Gender',
              title: 'GENDER',
              handleSave: editable,
            })}
          />
          <Column
            className={'rolename'}
            title="ROLE"
            dataIndex="RoleName"
            key="RoleName"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'RoleName',
              title: 'ROLE',
              handleSave: editable,
            })}
          />
          <Column
            className={'birthdate'}
            title="DATE OF BIRTH"
            dataIndex="BirthDate"
            key="BirthDate"
            align="center"
            render={(date) => (
              // <div>{date}</div>
              <Moment format="DD/MM/YYYY">{date}</Moment>
            )}
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'BirthDate',
              inputType: 'date',
              title: 'DATE OF BIRTH',
              handleSave: editable,
            })}
          />
        </Table>
      </Modal>

      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>List of guard</Breadcrumb.Item>
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
              placeholder="Input code"
              onSearch={(value) => searchByCode(value)}
              style={{ width: '90%' }}
              enterButton
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Input full name"
              onSearch={(value) => searchByFullName(value)}
              style={{ width: '90%' }}
              enterButton
            />
          </Col>
          <Col span={4}>
            <Select
              onChange={(value) => searchByRole(value)}
              style={{ width: '90%' }}
              placeholder="Filter by role"
            >
              <Option value={null} key={-1}>
                All of roles
              </Option>
              {roleState.roles
                .filter((e) => e.Name !== 'Student')
                .map((role) => (
                  <Option value={role.Id} key={role.Id}>
                    {role.Name}
                  </Option>
                ))}
            </Select>
          </Col>

          <Col span={2}>
            <Link to={'/manager/user/create'}>
              <Button type="primary"> + Create </Button>
            </Link>
          </Col>
          <Col span={6}>
            <Upload
              accept={environment.SheetJSFT}
              onRemove={() => setFileUpload(null)}
              beforeUpload={(file) => setFileUpload(file)}
              fileUpload
            >
              <Button type="primary">+ Import data from file excel</Button>
            </Upload>
            <Button
              type="primary"
              onClick={showDataInFile}
              disabled={fileUpload == null}
              loading={isLoading}
              style={{ marginTop: 16 }}
            >
              {isLoading ? 'Uploading' : 'Start Upload'}
            </Button>
          </Col>
        </Row>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <Table
              dataSource={securityMan}
              pagination={{
                ...pagination,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '40', '60'],
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} records`,
              }}
              loading={isLoadingTable}
              onChange={handleTableChange}
              rowKey="Id"
            >
              <Column
                title="No"
                dataIndex="Id"
                key="id"
                render={(id, record, index) => <Text>{index + 1}</Text>}
              />
              <Column title="Code" dataIndex="Code" key="Code" sorter={true} />
              <Column title="Full name" dataIndex="FullName" key="fullName" />
              <Column title="User name" dataIndex="Username" key="userName" />
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
                title="Online"
                key="IsOnline"
                dataIndex="IsOnline"
                align="center"
                render={(IsOnline, record) => (
                  <Switch
                    disabled={record.IsActive == false}
                    checked={IsOnline}
                    onClick={() => {
                      toggleOnline(record.Id, IsOnline);
                    }}
                  />
                )}
              />
              <Column
                title="Action"
                key="Id"
                align="left"
                render={(Text, record, index) => (
                  <Space size="middle">
                    <Link to={`/manager/user/${record.Id}`}>
                      <Button style={{ margin: 0 }} type="dashed">
                        View detail
                      </Button>
                    </Link>
                    {record.IsRegisterFace === 0 ? (
                      <Link
                        to={`/manager/user-register-face/${record.Id}?User=Guard`}
                      >
                        <Button
                          onClick={() => {
                            dispatch(setUserRegisterFace(record));
                          }}
                          style={{ width: 120, margin: 0 }}
                          type="primary"
                          disabled={!record.IsActive}
                        >
                          Register face
                        </Button>
                        <Button
                          danger
                          disabled={true}
                          outline
                          style={{ width: 180, margin: 0, marginLeft: 10 }}
                        >
                          Remove face register
                        </Button>
                      </Link>
                    ) : (
                      <div>
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
                                onClick={() => checkout(record.UserId, index)}
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
                          <Button
                            style={{ width: 120, margin: 0 }}
                            type="danger"
                            disabled={!record.IsActive}
                          >
                            Check out
                          </Button>
                        </Popover>
                        <Button
                          danger
                          disabled={!record.IsActive}
                          outline
                          onClick={() => removeFaceImage(record.UserId)}
                          style={{ width: 180, margin: 0, marginLeft: 10 }}
                        >
                          Reove face registemr
                        </Button>
                      </div>
                    )}
                  </Space>
                )}
              />
            </Table>
          </div>
        )}
      </Content>
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
    </Layout>
  );
}

export default SecurityManListPage;
