import React from "react";
import {
  Layout,
  Breadcrumb,
  Col,
  Row,
  Tooltip,
  Card,
  Statistic,
  Radio,
  Button,
} from "antd";
import { Bar, Pie } from "react-chartjs-2";
import moment from "moment";
import {
  SendOutlined,
  ArrowDownOutlined,
  LikeOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import "ant-design-pro/dist/ant-design-pro.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getDangerousCaseGroupByPolicyByBuilding,
  getNumberOfDangerousCaseByMonthByBuilding,
  getRegisterStudentStatusByBuilding,
  getNumberOfStudentGroupByUniversityByBuilding
} from "../../services";
const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 20; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      "YYYY-MM-DD"
    ),
    y: Math.floor(Math.random() * 100) + 10,
  });
}
const defaultPieData = [
  {
    PolicyId: "stranger detected",
    y: 12,
  },
  {
    PolicyId: "prohibited item",
    y: 5,
  },
  {
    PolicyId: "weird time",
    y: 3,
  },
];
const defaultCaseByMonth = [];
for (let i = 0; i < 12; i += 1) {
  defaultCaseByMonth.push({
    x: `${i + 1} Month`,
    y: Math.floor(Math.random() * 200) + 200,
  });
}
const defaultStudentByUniversity = [];
for (let i = 0; i < 5; i += 1) {
  defaultStudentByUniversity.push({
    x: `${i + 1} University`,
    y: Math.floor(Math.random() * 1000) + 300,
  });
}
export function DashBoardPage() {
  const [pieData, setPieData] = React.useState(defaultPieData);
  const [caseByMonth, setCaseByMonth] = React.useState(defaultCaseByMonth);
  const buildingState = useSelector((state) => state.building.building);
  const [filterBy, setFilterBy] = React.useState(0);
  const [studentByUniversity, setStudentByUniversity] = React.useState(
    defaultStudentByUniversity
  ); 
  const [filterBy2, setFilterBy2] = React.useState(0);
  const [registedStatus, setRegisteredStatus] = React.useState({
    registeredStudent: 0,
    allStudent: 0,
  });

  React.useEffect(() => {
    if (buildingState) {
      getDangerousCaseGroupByPolicyByBuilding(buildingState.Id).then((res) =>
        setPieData(
          res.data.DangerousCaseGroupByPolicy.map((e) => {
            e.x = e.PolicyName.replace("detected", "");
            e.y = e.NumberOfCase;
            return e;
          })
        )
      );
      getNumberOfDangerousCaseByMonthByBuilding(buildingState.Id).then((res) =>
        setCaseByMonth(
          res.data.NumberOfDangerousCaseByMonth.map((e) => {
            e.x = e.Month;
            e.y = e.NumberOfCase;
            return e;
          })
        )
      );
      getRegisterStudentStatusByBuilding(buildingState.Id).then((res) => {
        setRegisteredStatus(res.data);
      });
      getNumberOfStudentGroupByUniversityByBuilding(buildingState.Id).then((res) =>
        setStudentByUniversity(
          res.data.NumberOfStudentGroupByUniversity.map((e) => {
            e.x = e.UniversityName;
            e.y = e.NumberOfStudent;
            return e;
          })
        )
      );
    }
  }, [buildingState]);

  const dangerousCaseTime = [];
  for (let i = 0; i < 12; i += 1) {
    dangerousCaseTime.push({
      x: `${i + 1} Month`,
      y: Math.floor(Math.random() * 200) + 200,
    });
  }

  const studentTime = [];
  for (let i = 0; i < 5; i += 1) {
    studentTime.push({
      x: `${i + 1} University`,
      y: Math.floor(Math.random() * 1000) + 300,
    });
  }

  const buildingTime = [];
  for (let i = 0; i < 12; i += 1) {
    buildingTime.push({
      x: `${i + 1} Building`,
      y: Math.floor(Math.random() * 1000) + 200,
    });
  }
  const options = [
    { label: "Year", value: 0 },
    { label: "Month", value: 1 },
    { label: "Day", value: 2 },
  ];
  const onChange1 = (e) => {
    getDangerousCaseGroupByPolicyByBuilding(buildingState.Id, {
      FilterBy: e.target.value,
    }).then((res) => {
      setPieData(
        res.data.DangerousCaseGroupByPolicy.map((e) => {
          e.x = e.PolicyName.replace("detected", "");
          e.y = e.NumberOfCase;
          return e;
        })
      );
      setFilterBy(e.target.value);
    });
  };
  const options2 = [
    { label: "Year", value: 0 },
    { label: "Month", value: 2 },
  ];
  const colors = [
    "#1A936F",
    "#CD4631",
    "#AAEFDF",
    "#564256",
    "#98B6B1",
    "#55286F",
    "#8BE8CB",
    "#F1FFE7",
    "#883955",
    "#2E5339",
    "#E1CA96",
  ];
  const getRandomColorHex = (number, index) => {
    if (number === 0) return "rgba(1,1,1,0)";
    return colors[index] + "80";
  };
  const onChange2 = (e) => {
    getNumberOfDangerousCaseByMonthByBuilding(buildingState.Id, {
      FilterBy: e.target.value,
    }).then((res) => {
      setCaseByMonth(
        res.data.NumberOfDangerousCaseByMonth.map((e) => {
          e.x = e.Month;
          e.y = e.NumberOfCase;
          return e;
        })
      );
      setFilterBy2(e.target.value);
    });
  };
  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Building Guard</Breadcrumb.Item>
        <Breadcrumb.Item>Dash board</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={24} type="flex">
        <Col span={8}>
          <Card>
            <Statistic
              title="Building Management"
              value={
                buildingState
                  ? `You are the manger of: ${buildingState.Code}  Building`
                  : "You are not manager any building now"
              }
              precision={2}
              valueStyle={{ color: "#4B5267" }}
              prefix={<HomeOutlined />}
              suffix=""
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Registered face of student"
              value={`${registedStatus.registeredStudent}/${registedStatus.allStudent}`}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<UsergroupAddOutlined />}
              suffix="students"
            />
          </Card>
        </Col>
        <Col span={4} align="center">
          <img
            width={"80%"}
            style={{
              borderRadius: 10,
              boxShadow: " 0px 0px 11px 11px #cecece",
            }}
            height={150}
            src={
              buildingState &&
              buildingState.ImageUrl &&
              buildingState.ImageUrl.length > 0
                ? buildingState.ImageUrl
                : "https://vanhoadoanhnghiepvn.vn/wp-content/uploads/2020/08/112815953-stock-vector-no-image-available-icon-flat-vector.jpg"
            }
            alt="building"
          />
        </Col>
        <Col span={4}>
          <Card>
            {buildingState ? (
              <a
                style={{ marginTop: 10 }}
                target="_blank"
                href={`https://www.google.com/maps/?q=${buildingState.Longitude},${buildingState.Latitude}`}
              >
                <Button icon={<SendOutlined />}>Check location on map</Button>
              </a>
            ) : (
              <div></div>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={24} type="flex">
        <Col span={24}>
          <Row gutter={24} type="flex">
            <h4>Dangerous case by month in {new Date().getFullYear()}</h4>
          </Row>
          <Row justify="center" gutter={24} type="flex">
            <Radio.Group
              options={options2}
              onChange={onChange2}
              value={filterBy2}
              optionType="button"
            />
          </Row>
          <Bar
            height={80}
            data={{
              labels: caseByMonth.map((e) => e.x),
              datasets: [
                {
                  label: "Total",
                  backgroundColor: "rgba(255,99,132,0.2)",
                  borderColor: "rgba(255,99,132,1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(255,99,132,0.4)",
                  hoverBorderColor: "rgba(255,99,132,1)",
                  data: caseByMonth.map((e) => e.y),
                },
                {
                  label: "Total",
                  backgroundColor: "rgba(255,99,132,0)",
                  borderColor: "rgba(255,99,132,1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(255,99,132,0)",
                  hoverBorderColor: "rgba(255,99,132,1)",
                  data: caseByMonth.map((e) => e.y),
                  type: "line",
                },
                {
                  label: "Stranger",
                  backgroundColor: "#1A936F30",
                  borderColor: "#1A936F",
                  borderWidth: 1,
                  hoverBackgroundColor: "#1A936F5e",
                  hoverBorderColor: "#1A936F",
                  data: caseByMonth.map((e) => e.NumberOfStrangerCase),
                },
                {
                  label: "Prohibited Item",
                  backgroundColor: "#CD463130",
                  borderColor: "#CD4631",
                  borderWidth: 1,
                  hoverBackgroundColor: "#CD46315e",
                  hoverBorderColor: "#CD4631",
                  data: caseByMonth.map((e) => e.NumberOfItemCase),
                },
              ],
            }}
          />
        </Col>
        <Col span={8} xs={8}>
          <Row justify="center" gutter={24} type="flex">
            <h4>
              Dangerous case by policy in{" "}
              {filterBy === 0
                ? new Date().getFullYear()
                : filterBy === 1
                ? `${new Date().getMonth() + 1} / ${new Date().getFullYear()}`
                : `${new Date().getDate()} / ${
                    new Date().getMonth() + 1
                  } / ${new Date().getFullYear()}`}
            </h4>
            <Col span={24} align="center">
              <Radio.Group
                options={options}
                onChange={onChange1}
                value={filterBy}
                optionType="button"
              />
            </Col>
          </Row>
          <Pie
            options={{
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                    var total = meta.total;
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = parseFloat(
                      ((currentValue / total) * 100).toFixed(1)
                    );
                    return currentValue + " (" + percentage + "%)";
                  },
                  title: function (tooltipItem, data) {
                    return data.labels[tooltipItem[0].index];
                  },
                },
              },
            }}
            data={{
              labels: pieData.map((e) => e.x),
              datasets: [
                {
                  data: pieData.map((e) => e.y),
                  backgroundColor: pieData.map(
                    (e, i) => `${getRandomColorHex(e.y, i)}`
                  ),
                },
              ],
            }}
            valueFormat={(val) => (
              <span dangerouslySetInnerHTML={{ __html: val }} />
            )}
            height={200}
          />
        </Col>
        <Col span={16}>
          <h4>Student By University</h4>
          <Bar
            height={120}
            title=""
            data={{
              labels: studentByUniversity.map((e) => e.x),
              datasets: [
                {
                  label: "Total",
                  backgroundColor: "rgba(1,99,132,0.2)",
                  borderColor: "rgba(1,99,132,1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(1,99,132,0.4)",
                  hoverBorderColor: "rgba(1,99,132,1)",
                  data: studentByUniversity.map((e) => e.y),
                },
              ],
            }}
          />
        </Col>
      </Row>
    </Layout>
  );
}

export default DashBoardPage;
