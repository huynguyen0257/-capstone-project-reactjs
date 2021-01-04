import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  Popover,
  DatePicker,
} from 'antd';
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import XLSX from 'xlsx';
import { environment } from '../../../environment/env';
import { setSelectedStudent } from '../../../redux';
import moment from 'moment';
import {
  createListStudent,
  getStudents,
  toggleActive,
  removeFaceImage as removeFaceImageService,
} from '../../../services';
import TableCellEdit, { EditableRow } from './component/table.cell.edit';
import './student.css';
const { Column } = Table;
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

function StudentDormListPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingTable, setIsLoadingTable] = React.useState(false);
  const [params, setParams] = React.useState({});
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const [done, setDone] = React.useState('');
  const [err, setErr] = React.useState('');
  const [students, setStudents] = React.useState([]);
  const [fileUpload, setFileUpload] = React.useState([]);
  const [studentData, setStudentData] = React.useState([]);
  const [modelVisible, setModelVisible] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState([]);
  const [dayOut, setDayOut] = React.useState(moment(new Date(), 'DD/MM/YYYY'));

  const universityState = useSelector((state) => state.university);
  const dispatch = useDispatch();
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
        let student_data = XLSX.utils.sheet_to_json(ws, { range: 2 });
        console.log(student_data);
        //VALIDATION
        validateData(student_data);
        setStudentData(
          student_data.sort((a, b) => -(a.valid.length - b.valid.length))
        );
      };
      if (rABS) {
        reader.readAsBinaryString(fileUpload[0]);
        setModelVisible(true);
      } else {
        reader.readAsArrayBuffer(fileUpload[0]);
      }
    }
  };
  const validateData = (data, totalData, index) => {
    for (let i = 0; i < data.length; i++) {
      const student = data[i];
      student.valid = [];
      if(!student.Code || typeof student.Code !== typeof "" || !student.Code.match(/^[A-Za-z0-9-]{3,20}$/)) {
        student.valid.push({
          title: 'Code',
          message: `The code is invalid`,
        });
      }
      if(!student.FullName || typeof student.FullName !== typeof "" || student.FullName.length < 5 ||student.FullName.length > 100) {
        student.valid.push({
          title: 'FullName',
          message: `The Full Name is invalid`,
        });
      }
      if (
        !student.Email ||
        typeof student.Email !== typeof '' ||
        !student.Email.includes('@')
      ) {
        student.valid.push({ title: 'Email', message: 'email is invalid' });
      }
      if (
        !student.Phone ||
        !/^\d+$/.test(student.Phone) ||
        typeof student.Phone !== typeof '' ||
        student.Phone.length != 10
      ) {
        student.valid.push({
          title: 'Phone',
          message: `Phone can not contain text and must be 10 characters`,
        });
      }
      if(!student.UniversityName || typeof student.UniversityName !== typeof "" || !student.UniversityName.match(/^[A-Z0-9]{3,}$/)) {
        student.valid.push({
          title: 'UniversityName',
          message: `The University Code is invalid`,
        });
      }
      if (
        !student.Gender ||
        typeof student.Gender !== typeof '' ||
        !['nam', 'nữ'].includes(student.Gender.toLowerCase())
      ) {
        student.valid.push({
          title: 'Gender',
          message: `Gender must be 'nam' or 'nữ'`,
        });
      }
      if (
        !student.BirthDate ||
        typeof student.BirthDate !== typeof new Date() ||
        student.BirthDate.getFullYear() < 1950 ||
        student.BirthDate.getFullYear() > new Date().getFullYear() - 16
      ) {
        student.valid.push({
          title: 'BirthDate',
          message: `Birth date must between 1950 and ${
            new Date().getFullYear() - 16
          }`,
        });
      }
      if (
        !student.DayIn ||
        typeof student.DayIn !== typeof new Date() ||
        student.DayIn.getFullYear() < new Date().getFullYear() - 5 ||
        student.DayIn.getFullYear() > new Date().getFullYear() + 1
      ) {
        student.valid.push({
          title: 'DayIn',
          message: `Year of day in must between ${
            new Date().getFullYear() - 5
          } and ${new Date().getFullYear()}`,
        });
      }
      if (
        !student.DayOut ||
        typeof student.DayOut !== typeof new Date() ||
        student.DayOut.getFullYear() < new Date().getFullYear() ||
        student.DayOut < student.DayIn
      ) {
        student.valid.push({
          title: 'DayOut',
          message: `Year of day out must grater than equal ${new Date().getFullYear()} and Day In`,
        });
      }
      
      if (totalData) {
        for (let i = 0; i < totalData.length; i++) {
          const b = totalData[i];
          if (i === index) continue;
          if (
            typeof b.Email === typeof '' &&
            b.Email.toLowerCase() === student.Email.toLowerCase()
          ) {
            student.valid.push({
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
            b.Email.toLowerCase() === student.Email.toLowerCase()
          ) {
            student.valid.push({
              title: 'Email',
              message: `Email is duplicated`,
            });
            b.valid.push({ title: 'Email', message: `Email is duplicated` });
          }
        }
      }
    }
  };

  const uploadFile = () => {
    validateData(studentData);
    if (studentData.filter((e) => e.valid && e.valid.length > 0).length > 0) {
      setErr('Invalid data');
      return;
    }
    if (fileUpload.length > 0) {
      setIsLoadingTable(true);
      /* Update state */
      createListStudent({ Students: studentData })
        .then((result) => {
          setModelVisible(false);
          setDone(result.data.message);
        })
        .catch((res) => {
          // setFileUpload([]);
          setErr(res.response.data.message);
          setIsLoadingTable(false);
          setStudentData(
            res.response.data.data.map((e) => {
              e.BirthDate = new Date(e.BirthDate);
              e.DayIn = new Date(e.DayIn);
              e.DayOut = new Date(e.DayOut);
              return e;
            })
          );
        });
    }
  };

  const checkout = (userId, index) => {
    if (!dayOut) {
      setErr('Select day out');
    } else {
      // update DB
      toggleActive(userId, { DayOut: dayOut });
      // update UI
      setStudents((list) =>
        list.map((student) => {
          if (student.UserId === userId) student.IsActive = false;
          return student;
        })
      );
      setShowPopover((oldArr) =>
        oldArr.map((e, i) => {
          if (i === index) e = false;
          return e;
        })
      );
    }
  };

  const fetchStudents = (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    setIsLoadingTable(true);
    return getStudents(params).then((res) => {
      setStudents(res.data.results);
      setIsLoading(false);
      setIsLoadingTable(false);
      let p = [];
      res.data.results.forEach((e) => p.push(false));
      setShowPopover(p);
      return res;
    });
  };

  // initial | constructor
  React.useEffect(() => {
    fetchStudents(true, { ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  }, []);

  const searchByName = (fullname) => {
    if (!fullname || fullname.length === 0) fullname = null;

    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      Fullname: fullname,
    }).then((res) => {
      setParams({ ...params, Fullname: fullname });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const searchByCode = (code) => {
    if (!code || code.length === 0) code = null;
    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      Code: code,
    }).then((res) => {
      setParams({ ...params, Code: code });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const searchByRoomCode = (code) => {
    if (!code || code.length === 0) code = null;
    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      RoomCode: code,
    }).then((res) => {
      setParams({ ...params, RoomCode: code });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };
  const searchByUniversity = (universityId) => {
    fetchStudents(false, {
      ...pagination,
      current: 1,
      ...params,
      UniversityId: universityId,
    }).then((res) => {
      setParams({ ...params, UniversityId: universityId });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const handleTableChange = (pagination, filter, sorter) => {
    delete pagination.defaultPageSize;
    delete pagination.showSizeChanger;
    delete pagination.pageSizeOptions;
    delete pagination.showQuickJumper;
    const _params = { ...params, ...pagination };
    if (sorter.column) {
      _params['OrderBy'] = sorter.column.dataIndex;
      _params['OrderType'] = sorter.order === 'ascend' ? 'ASC' : 'DESC';
    }
    fetchStudents(false, _params).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };
  const handleOnCalendarChange = async (value, dateString, info) => {
    setDayOut(value != null ? value.toDate() : null);
  };

  const editable = (record, index) => {
    validateData([record], studentData, index);
    setStudentData((arr) =>
      arr.map((e, i) => {
        if (i === index) return record;
        return e;
      })
    );
  };

  const removeFaceImage = (userId) => {
    setIsLoading(true);
    removeFaceImageService({Id: userId})
    .then(()=>{
      // update UI
      setStudents((list) =>
        list.map((student) => {
          if (student.UserId === userId) student.IsRegisterFace = 0;
          return student;
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
        title="Preview student information from excel"
        visible={modelVisible}
        onCancel={() => setModelVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModelVisible(false)}>
            Return
          </Button>,
          <Button
            disabled={
              studentData.filter((e) => e.valid && e.valid.length > 0).length >
              0
            }
            loading={isLoadingTable}
            key="submit"
            type="primary"
            onClick={uploadFile}
          >
            Submit
          </Button>,
        ]}
      >
        <div>
          Error:
          <span
            className={
              studentData.filter((e) => e.valid && e.valid.length > 0).length >
              0
                ? 'error__message'
                : 'validate__message'
            }
          >
            {studentData.filter((e) => e.valid && e.valid.length > 0).length} /{' '}
            {studentData.length} Records
          </span>
        </div>
        <Table
          loading={isLoadingTable}
          bordered
          rowClassName={(record, index) =>
            record.valid.length > 0
              ? `error ${record.valid
                  .map((v) => v.title.toLowerCase())
                  .join(' ')}`
              : 'validated'
          }
          dataSource={studentData}
          rowKey="Code"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '40', '60'],
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          components={{ body: { row: EditableRow, cell: TableCellEdit } }}
        >
          <Column
            className={'code'}
            title="CODE"
            dataIndex="Code"
            key="Code"
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
            className={'room'}
            title="ROOM"
            dataIndex="RoomCode"
            key="RoomCode"
            align="center"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'RoomCode',
              title: 'ROOM',
              handleSave: editable,
            })}
          />
          <Column
            className={'university'}
            title="UNIVERSITY"
            dataIndex="UniversityName"
            key="UniversityName"
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'UniversityName',
              title: 'UNIVERSITY',
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
          <Column
            className={'dayin'}
            title="DAY IN"
            dataIndex="DayIn"
            key="DayIn"
            align="center"
            render={(date) => (
              // <div>{date}</div>
              <Moment format="DD/MM/YYYY">{date}</Moment>
            )}
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'DayIn',
              inputType: 'date',
              title: 'DAY IN',
              handleSave: editable,
            })}
          />
          <Column
            className={'dayout'}
            title="DAY OUT"
            dataIndex="DayOut"
            key="DayOut"
            align="center"
            render={(date) => (
              // <div>{date}</div>
              <Moment format="DD/MM/YYYY">{date}</Moment>
            )}
            onCell={(record, index) => ({
              record,
              index,
              editable: true,
              dataIndex: 'DayOut',
              inputType: 'date',
              title: 'DAY OUT',
              handleSave: editable,
            })}
          />
        </Table>
      </Modal>

      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>List of student</Breadcrumb.Item>
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
          <Col span={4}>
            <Search
              placeholder="Input Student Code"
              onSearch={(value) => searchByCode(value)}
              style={{ width: '90%' }}
              enterButton
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Input Name"
              onSearch={(value) => searchByName(value)}
              style={{ width: '90%' }}
              enterButton
            />
          </Col>
          <Col span={4}>
            <Search
              placeholder="Input Room Code"
              onSearch={(value) => searchByRoomCode(value)}
              style={{ width: '90%' }}
              enterButton
            />
          </Col>
          <Col span={4}>
            <Select
              onChange={(value) => searchByUniversity(value)}
              style={{ width: '90%' }}
              placeholder="Search by University"
            >
              <Option value={null} key={-1}>
                All of university
              </Option>
              {universityState.universities.map((u) => (
                <Option value={u.Id} key={u.Id}>
                  {u.Name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={2}>
            <Link to={'/manager/user/create?student=true'}>
              <Button> + Create </Button>{' '}
            </Link>
          </Col>
          <Col span={4}>
            {/* TODO: Remove list below button when fileUpload==null */}
            <Upload
              accept={environment.SheetJSFT}
              onRemove={() => setFileUpload([])}
              beforeUpload={(file) => setFileUpload([file])}
              fileUpload
            >
              <Button type="primary">+ Import data from file excel</Button>
            </Upload>
            <Button
              type="primary"
              onClick={showDataInFile}
              disabled={fileUpload.length === 0}
              loading={isLoading}
              style={{ marginTop: 16 }}
            >
              {isLoading ? 'Uploading' : 'Start Upload'}
            </Button>
          </Col>
        </Row>

        <div>
          {isLoading ? (
            <Skeleton active />
          ) : (
            <Table
              dataSource={students}
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
              <Column
                title="Code"
                dataIndex="Code"
                key="Code"
                align="center"
                sorter={true}
              />
              <Column
                title="Full name"
                align="left"
                dataIndex="FullName"
                key="FullName"
              />
              <Column
                title="Room"
                dataIndex="RoomCode"
                key="RoomCode"
                align="center"
              />

              <Column
                title="Gender"
                dataIndex="Gender"
                key="Gender"
                align="center"
                render={(Gender) =>
                  Gender === true ? <span>Male</span> : <span>Female</span>
                }
              />
              {universityState.universities.length > 0 ? (
                <Column
                  title="University"
                  key="UniversityId"
                  dataIndex="UniversityId"
                  align="left"
                  render={(UniversityId) =>
                    universityState.universities.filter(
                      (r) => r.Id === UniversityId
                    )[0].Name
                  }
                />
              ) : (
                <Column />
              )}
              <Column
                align="center"
                title="Active"
                key="IsActive"
                dataIndex="IsActive"
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
                align="left"
                dataIndex="Id"
                render={(text, record, index) => (
                  <Space size="middle">
                    <Link to={`/manager/student/${record.Id}`}>
                      <Button style={{ margin: 0 }} type="dashed">
                        View detail
                      </Button>
                    </Link>
                    {record.IsRegisterFace === 0 ? (
                      <Link
                        to={`/manager/user-register-face/${record.UserId}?User=Student`}
                      >
                        <Button
                          onClick={() => {
                            dispatch(setSelectedStudent(record));
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
                            <Col span={24}>
                              <Row style={{ width: 300, padding: 10 }}>
                                <Col span={6}> DayOut:</Col>
                                <Col span={18}>
                                  <DatePicker
                                    // style={{ width: "80%" }}
                                    defaultValue={dayOut}
                                    onChange={handleOnCalendarChange}
                                    format="DD/MM/YYYY"
                                  />
                                </Col>
                              </Row>
                              <Row align="center">
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
                              </Row>
                            </Col>
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
                          outline
                          disabled={!record.IsActive}
                          onClick={() => removeFaceImage(record.UserId)}
                          style={{ width: 180, margin: 0, marginLeft: 10 }}
                        >
                          Remove face register
                        </Button>
                      </div>
                    )}
                  </Space>
                )}
              />
            </Table>
          )}
        </div>
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

export default StudentDormListPage;
