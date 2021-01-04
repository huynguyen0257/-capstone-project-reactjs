import React from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  Space,
  Button,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Skeleton,
  DatePicker,
} from "antd";
import { Link } from "react-router-dom";
import { getDangerousCases } from "../../services";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import {
  SyncOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { environment } from "../../environment";
const { Content } = Layout;
const { Column } = Table;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

function DangerousCaseListPage() {
  const [params, setParams] = React.useState({});
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
  });
  const [isLoadingTable, setIsLoadingTable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dangerousCases, setListDangerousCase] = React.useState([]);
  const policyLevelStates = useSelector((state) => state.policy.policyLevels);
  const policyStates = useSelector((state) => state.policy.policies);
  const historyStatusStates = useSelector(
    (state) => state.case.caseHistoryStatus
  );
  const buildingState = useSelector((state) => state.building.building);

  React.useEffect(() => {
    if (buildingState) {
      fetchDangerousCase(true, { ...pagination }).then((res) => {
        setPagination({ ...pagination, total: res.data.info.total });
      });
    }
  }, [buildingState]);

  const fetchDangerousCase = (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    setIsLoadingTable(true);
    return getDangerousCases({ ...params, BuildingId: buildingState.Id }).then(
      (res) => {
        setListDangerousCase(res.data.results);
        setIsLoading(false);
        setIsLoadingTable(false);
        return res;
      }
    );
  };

  const searchByCode = async (input) => {
    fetchDangerousCase(false, {
      ...pagination,
      current: 1,
      ...params,
      Code: input,
    }).then((res) => {
      setParams({ ...params, Code: input });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByStatusProcess = async (process) => {
    fetchDangerousCase(false, {
      ...pagination,
      current: 1,
      ...params,
      CaseHistoryStatusId: process,
    }).then((res) => {
      setParams({ ...params, CaseHistoryStatusId: process });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByPolicy = async (policyId) => {
    fetchDangerousCase(false, {
      ...pagination,
      current: 1,
      ...params,
      PolicyId: policyId,
    }).then((res) => {
      setParams({ ...params, PolicyId: policyId });
      setPagination({ ...pagination, current: 1, total: res.data.info.total });
    });
  };

  const searchByDate = async (value, dateString, info) => {
    if (info.range === "end") {
      let fromDate = dateString[0];
      let toDate = dateString[1];
      if (!toDate) {
        fetchDangerousCase(false, {
          ...pagination,
          current: 1,
          ...params,
          FromDate: null,
          ToDate: null,
        }).then((res) => {
          setParams({ ...params, FromDate: null, ToDate: null });
          setPagination({
            ...pagination,
            current: 1,
            total: res.data.info.total,
          });
        });
      } else {
        fetchDangerousCase(false, {
          ...pagination,
          current: 1,
          ...params,
          FromDate: fromDate,
          ToDate: toDate,
        }).then((res) => {
          setParams({ ...params, FromDate: fromDate, ToDate: toDate });
          setPagination({
            ...pagination,
            current: 1,
            total: res.data.info.total,
          });
        });
      }
    }
  };

  const getTagByName = (name) => {
    switch (name.toLowerCase()) {
      case environment.process_step.pending.name:
        return (
          <Tag
            icon={<ClockCircleOutlined style={{ verticalAlign: "0.125em" }} />}
            color={environment.process_step.pending.color_tag}
          >
            {name}
          </Tag>
        );
      case environment.process_step.processing.name:
      case environment.process_step.considering.name:
        return (
          <Tag
            icon={<SyncOutlined spin style={{ verticalAlign: "0.125em" }} />}
            color={environment.process_step.considering.color_tag}
          >
            {" "}
            {name}{" "}
          </Tag>
        );
      case environment.process_step.skipping.name:
        return (
          <Tag
            icon={<MinusCircleOutlined style={{ verticalAlign: "0.125em" }} />}
            color={environment.process_step.skipping.color_tag}
          >
            {" "}
            {name}{" "}
          </Tag>
        );
      case environment.process_step.rejection.name:
        return (
          <Tag
            icon={<MinusCircleOutlined style={{ verticalAlign: "0.125em" }} />}
            color={environment.process_step.rejection.color_tag}
          >
            {" "}
            {name}{" "}
          </Tag>
        );
      case environment.process_step.close.name:
        return (
          <Tag
            icon={<MinusCircleOutlined style={{ verticalAlign: "0.125em" }} />}
            color={environment.process_step.close.color_tag}
          >
            {" "}
            {name}{" "}
          </Tag>
        );
      case environment.process_step.saving.name:
        return (
          <Tag
            icon={<CheckCircleOutlined style={{ verticalAlign: "0.125em" }} />}
            color={environment.process_step.saving.color_tag}
          >
            {" "}
            {name}{" "}
          </Tag>
        );
      default:
        return (
          <Tag
            icon={<CloseCircleOutlined style={{ verticalAlign: "0.125em" }} />}
            color="error"
          >
            {" "}
            {name}{" "}
          </Tag>
        );
    }
  };

  const handleTableChange = (pagination, sorter) => {
    fetchDangerousCase(false, { ...params, ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };

  var process_step_list = [];
  if (environment.process_step) {
    for (const key in environment.process_step) {
      if (environment.process_step.hasOwnProperty(key)) {
        process_step_list.push(key);
      }
    }
  }

  return !dangerousCases || !historyStatusStates ? (
    <Skeleton active />
  ) : (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Building Guard</Breadcrumb.Item>
        <Breadcrumb.Item>Dangerous cases</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Row>
          <Col span={6}>
            <Search
              placeholder="Input dangerous case code"
              onSearch={(value) => searchByCode(value)}
              style={{ width: 300 }}
              enterButton
            />
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: "80%" }}
              onCalendarChange={searchByDate}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: "80%" }}
              placeholder="Search by status process"
              onChange={searchByStatusProcess}
            >
              <Option value={null}>All of status process</Option>
              {historyStatusStates.length > 0 ? (
                historyStatusStates.map((p) => (
                  <Option value={p.Id}>{getTagByName(p.Name)}</Option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              style={{ width: "80%" }}
              placeholder="Search by policy"
              onChange={searchByPolicy}
            >
              <Option value={null}>All</Option>
              {policyStates.map((p) => (
                <Option key={p.Id}>{p.Name}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <Table
              loading={isLoadingTable}
              dataSource={dangerousCases}
              rowKey="Id"
              pagination={{
                ...pagination,
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "40", "60"],
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} cases`,
                position: ["topRight", "bottomRight"],
              }}
              onChange={handleTableChange}
            >
              <Column
                title="Code"
                dataIndex="Code"
                key="code"
                align="center"
                render={(code, record) => (
                  <Tag style={{ width: 120 }} color={`${record.PolicyLevel.Color}`}>{code}</Tag>
                )}
              />
              <Column
                title="Time"
                dataIndex="CreatedAt"
                key="time"
                align="center"
                render={(time) => <Moment format="hh : mm A">{time}</Moment>}
              />
              <Column
                title="Date"
                dataIndex="CreatedAt"
                key="date"
                align="center"
                render={(date) => <Moment format="DD/MM/YYYY">{date}</Moment>}
              />

              {historyStatusStates.length > 0 ? (
                <Column
                  title="Status"
                  key="status"
                  dataIndex="StatusId"
                  align="center"
                  render={(StatusId) => (
                    <>
                      {getTagByName(
                        historyStatusStates.filter(
                          (status) => status.Id === StatusId
                        )[0].Name
                      )}
                    </>
                  )}
                />
              ) : (
                <div></div>
              )}

              <Column
                title="Policy"
                key="policy"
                dataIndex="policy"
                align="center"
                render={(text, record) => (
                  <Tag color={`${record.PolicyColor}`}>{record.PolicyName}</Tag>
                )}
              />

              <Column
                title="Action"
                key="action"
                dataIndex="Id"
                align="center"
                render={(id) => (
                  <Link to={`/building-guard/dangerous-case/${id}`}>
                    <Button style={{ margin: 0 }} type="dashed">
                      View detail
                    </Button>
                  </Link>
                )}
              />
              <Column
                title="Evidence"
                key="image"
                dataIndex="CaseImage"
                align="center"
                render={(image) =>
                  image ? (
                    <img
                      alt="evidence"
                      src={`${image}`}
                      width={200}
                      style={{ height: 200 }}
                    />
                  ) : (
                    <img
                      alt="evidence"
                      src={
                        "https://vanhoadoanhnghiepvn.vn/wp-content/uploads/2020/08/112815953-stock-vector-no-image-available-icon-flat-vector.jpg"
                      }
                      width={200}
                      style={{ height: 200 }}
                    />
                  )
                }
              />
            </Table>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default DangerousCaseListPage;
