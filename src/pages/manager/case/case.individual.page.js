import React from "react";
import {
  Layout,
  Breadcrumb,
  Table,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Skeleton,
  Typography,
  Button,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { getDangerousCasesByStudentId } from "../../../services";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import {
  SyncOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { environment } from '../../../environment';
const { Content } = Layout;
const { Text } = Typography;
const { Column } = Table;

function DangerousCaseIndividual() {
  let { id: studentId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [params, setParams] = React.useState({});
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 200,
    StudentId: studentId,
  });
  const [listDangerousCase, setListDangerousCase] = React.useState([]);
  const [dangerousCasesDisplay, setDangerousCaseDisplays] = React.useState([]);
  const policyLevelStates = useSelector((state) => state.policy.policyLevels);
  const historyStatusStates = useSelector(
    (state) => state.case.caseHistoryStatus
  );

  React.useEffect(() => {
    fetchDangerousCase(true, { ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  }, []);

  const fetchDangerousCase = async (renderLoading = true, params) => {
    setIsLoading(renderLoading);
    return getDangerousCasesByStudentId(params).then((res) => {
      console.log(res.data.results);
      setListDangerousCase(res.data.results);
      setDangerousCaseDisplays(res.data.results);
      setIsLoading(false);
      return res;
    });
  };

  const getTagByName = (name) => {
    switch (name.toLowerCase()) {
      case environment.process_step.pending.name:
        return (
          <Tag
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
            style={{ width: 120 }}
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
    delete pagination.defaultPageSize
    delete pagination.showSizeChanger
    delete pagination.pageSizeOptions
    delete pagination.showQuickJumper
    delete pagination.position
    fetchDangerousCase(false, { ...params, ...pagination }).then((res) => {
      setPagination({ ...pagination, total: res.data.info.total });
    });
  };

  return !listDangerousCase || !historyStatusStates ? (
    <Skeleton active />
  ) : (
    <div>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div>
          {listDangerousCase.length === 0 ? (
            <Text strong>Student do not have any dangerous case</Text>
          ) : (
            <Table
              dataSource={dangerousCasesDisplay}
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
                  <Tag
                    style={{ width: 120 }}
                    color={`${record.PolicyLevel.Color}`}
                  >
                    {code}
                  </Tag>
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
              {/*               
              <Column
                title="Level"
                dataIndex="PolicyLevel"
                key="policyLevel"
                render={(policyLevel) =>
                  policyLevel ? (
                    <Tag style={{width:120}}  color={`${policyLevel.Color}`} key={policyLevel.Name}>
                      {policyLevel.Name}
                    </Tag>
                  ) : (
                    <Tag style={{width:120}}  color="gray">Not set</Tag>
                  )
                }
              /> */}

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
                      {/* {historyStatusStates.map(status => status.Id)}
                    <p></p>
                    {StatusId} */}
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
                  <Tag style={{ width: 160 }} color={`${record.PolicyColor}`}>
                    {record.PolicyName}
                  </Tag>
                )}
              />

              <Column
                title="Action"
                key="action"
                dataIndex="Id"
                align="center"
                render={(id) => (
                  <Link to={`/manager/dangerous-case/${id}`}>
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
                render={(image) => <img src={`${image}`} width={200} />}
              />
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

export default DangerousCaseIndividual;
