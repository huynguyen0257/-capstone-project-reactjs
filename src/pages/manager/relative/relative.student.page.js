import React from "react";
import { getRelatives, checkOut } from "../../../services";
import { Link, useParams } from "react-router-dom";
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
  Spin

} from "antd";
import { setRelativeRegisterStep } from '../../../redux'
import SweetAlert from "react-bootstrap-sweetalert";
import { environment } from "../../../environment/env";
import Moment from "react-moment";
const { Column } = Table;
const { Text } = Typography;


function RelativeStudentPage(props) {
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);
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
    fetchRelativeStudents();
  }, []);
  const fetchRelativeStudents = (renderLoading = true) => {
    setIsLoading(renderLoading);
    dispatch(setRelativeRegisterStep(0))
    getRelatives({StudentId: id,...pagination})
      .then((relatives) => {
        setRelatives(relatives.data.results);
        setRelativeDisplay(relatives.data.results)
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setErr(err.message)
      });
  };
  const toggleCheckOut = (Id) => {
    setIsLoadingBtn(true);
    checkOut(Id)
      .then(() => {
        fetchRelativeStudents(false);
        setIsLoadingBtn(false);
        setDone("Update successfully!!!");
      })
      .catch((err) => {
        setIsLoadingBtn(false);
        setErr(err.message)
      });
  };
  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Link to={`${id}/relative/create`}>
          <Button type="primary"> + Create </Button>
        </Link>
      </div>
      <div>
        {isLoading ? (
          <Skeleton active />
        ) : (
            <Table dataSource={relativeDisplay} rowKey="Id">
              <Column
                title="No"
                // dataIndex="id"
                // key="id"
                render={(id, record, index) => <p>{index + 1}</p>}
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
                render={(image) =>
                  <img alt='avatar' src={image ? image : environment.default_avatar_image} width={200} height={200} />
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
                        <Button danger onClick={() => toggleCheckOut(Record.Id)} disabled={true}>
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
      </div>
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
    </div>
  );
}

export default RelativeStudentPage;
