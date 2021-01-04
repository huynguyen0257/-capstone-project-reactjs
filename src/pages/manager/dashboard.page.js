import React from "react";
import {
  Layout,
  Breadcrumb,
  Col,
  Row,
  DatePicker,
  Card,
  Statistic,
  Radio,
  Select,
  Button,
} from "antd";
import { Bar, Pie, Chart } from "react-chartjs-2";
import moment from "moment";
import {
  checkToken,
  getDangerousCaseGroupByPolicy,
  getNumberOfDangerousCaseByMonth,
  getNumberOfStudentGroupByBuilding,
  getNumberOfStudentGroupByUniversity,
  getRegisterStudentStatus,
  getRegisterGuardStatus,
  getNumberOfCaseGroupByBuilding,
} from "./../../services";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import "ant-design-pro/dist/ant-design-pro.css";

const visitData = [];
const beginDay = new Date().getTime();
const { Option } = Select;

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
const defaultStudentByBuilding = [];
for (let i = 0; i < 12; i += 1) {
  defaultStudentByBuilding.push({
    x: `${i + 1} Building`,
    y: Math.floor(Math.random() * 1000) + 200,
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
  const [filterBy, setFilterBy] = React.useState(0);
  const [filterYearBy2, setFilterYearBy2] = React.useState(
    new Date().getFullYear()
  );
  const [filterBy3, setFilterBy3] = React.useState(0);
  const [filterBy2, setFilterBy2] = React.useState(0);
  const [caseByMonth, setCaseByMonth] = React.useState(defaultCaseByMonth);
  const [studentByBuilding, setStudentByBuilding] = React.useState(
    defaultStudentByBuilding
  );
  const [caseByBuilding, setCaseByBuilding] = React.useState(
    defaultStudentByBuilding
  );
  const [studentByUniversity, setStudentByUniversity] = React.useState(
    defaultStudentByUniversity
  );
  const [registedStatus, setRegisteredStatus] = React.useState({
    registeredStudent: 0,
    allStudent: 0,
  });
  const [registedGuardStatus, setRegisteredGuardStatus] = React.useState({
    registeredGuard: 0,
    allGuard: 0,
  });
  React.useEffect(() => {
    checkToken()
      .then((res) => {
        console.log("token ok");
      })
      .catch((e) => console.log("invalid token"));
    getDangerousCaseGroupByPolicy().then((res) =>
      setPieData(
        res.data.DangerousCaseGroupByPolicy.map((e) => {
          e.x = e.PolicyName.replace("detected", "");
          e.y = e.NumberOfCase;
          return e;
        })
      )
    );
    getNumberOfDangerousCaseByMonth().then((res) =>
      setCaseByMonth(
        res.data.NumberOfDangerousCaseByMonth.map((e) => {
          e.x = e.Month;
          e.y = e.NumberOfCase;
          return e;
        })
      )
    );

    getNumberOfStudentGroupByBuilding().then((res) =>
      setStudentByBuilding(
        res.data.NumberOfStudentGroupByBuilding.map((e) => {
          e.x = e.BuildingCode;
          e.y = e.NumberOfStudent;
          return e;
        })
      )
    );

    getNumberOfStudentGroupByUniversity().then((res) =>
      setStudentByUniversity(
        res.data.NumberOfStudentGroupByUniversity.map((e) => {
          e.x = e.UniversityName;
          e.y = e.NumberOfStudent;
          return e;
        })
      )
    );

    getRegisterStudentStatus().then((res) => {
      setRegisteredStatus(res.data);
    });
    getRegisterGuardStatus().then((res) => {
      setRegisteredGuardStatus(res.data);
    });
    getNumberOfCaseGroupByBuilding().then((res) => {
      setCaseByBuilding(
        res.data.DangerousCaseGroupByPolicy.map((e) => {
          e.x = e.BuildingCode;
          e.y = e.NumberOfCase;
          return e;
        })
      );
    });
  }, []);
  const options = [
    { label: "Year", value: 0 },
    { label: "Month", value: 1 },
    { label: "Day", value: 2 },
  ];
  const options2 = [
    { label: "Year", value: 0 },
    { label: "Month", value: 2 },
  ];
  const onChange1 = (e) => {
    getDangerousCaseGroupByPolicy({
      FilterBy: e.target.value,
      Year: filterYearBy2,
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
  const handleChangeYear = (e) => {
    getNumberOfDangerousCaseByMonth({ FilterBy: filterBy2, Year: e }).then(
      (res) => {
        setCaseByMonth(
          res.data.NumberOfDangerousCaseByMonth.map((e) => {
            e.x = e.Month;
            e.y = e.NumberOfCase;
            return e;
          })
        );
        setFilterYearBy2(e);
      }
    );
  };

  const onChange3 = (e) => {
    getNumberOfCaseGroupByBuilding({ FilterBy: e.target.value }).then((res) => {
      setCaseByBuilding(
        res.data.DangerousCaseGroupByPolicy.map((e) => {
          e.x = e.BuildingCode;
          e.y = e.NumberOfCase;
          return e;
        })
      );
      setFilterBy3(e.target.value);
    });
  };

  const onChange2 = (e) => {
    getNumberOfDangerousCaseByMonth({
      FilterBy: e.target.value,
      Year: filterYearBy2,
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
  const playSound = () => {
    const audio = new Audio("http://localhost:3000/tinh.mp3");
    audio.play();
  };
  return (
    <Layout style={{ padding: "0 24px 24px", overflow: "hidden" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Dash board</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col span={24}>
          <Row gutter={24} type="flex">
            <h4>
              Dangerous case in
              <Select
                defaultValue={filterYearBy2}
                style={{ margin: 10, width: 120, fontSize: 20 }}
                onChange={handleChangeYear}
              >
                {[0, 1, 2, 3].map((e) => (
                  <Option value={new Date().getFullYear() - e}>
                    {new Date().getFullYear() - e}
                  </Option>
                ))}
              </Select>
            </h4>
          </Row>
          <Row justify="center" gutter={24} type="flex">
            <Radio.Group
              options={options2}
              onChange={onChange2}
              value={filterBy2}
              optionType="button"
            />
          </Row>
          <Row gutter={24} type="flex" align="center">
            <Col span={24} xs={24}>
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
                    {
                      label: "Total in line",
                      backgroundColor: "rgba(255,99,132,0)",
                      borderColor: "rgba(255,99,132,1)",
                      borderWidth: 1,
                      hoverBackgroundColor: "rgba(255,99,132,0)",
                      hoverBorderColor: "rgba(255,99,132,1)",
                      data: caseByMonth.map((e) => e.y),
                      type: "line",
                    },
                  ],
                }}
                options={{
                  scales: {
                    yAxes: [
                      {
                        scaleLabel: {
                          display: true,
                          labelString: "cases",
                        },
                      },
                    ],
                  },
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ height: 20 }}></div>
      <Row>
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
          </Row>
          <Row justify="center">
            <Radio.Group
              options={options}
              onChange={onChange1}
              value={filterBy}
              optionType="button"
            />
          </Row>
          <Pie
            options={{
              animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {
                  var ctx = this.chart.ctx;
                  ctx.font = Chart.helpers.fontString(
                    Chart.defaults.global.defaultFontFamily,
                    "normal",
                    Chart.defaults.global.defaultFontFamily
                  );
                  ctx.textAlign = "center";
                  ctx.textBaseline = "bottom";

                  this.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                      var model =
                          dataset._meta[Object.keys(dataset._meta)[0]].data[i]
                            ._model,
                        total =
                          dataset._meta[Object.keys(dataset._meta)[0]].total,
                        mid_radius =
                          model.innerRadius +
                          (model.outerRadius - model.innerRadius) / 2,
                        start_angle = model.startAngle,
                        end_angle = model.endAngle,
                        mid_angle = start_angle + (end_angle - start_angle) / 2;

                      var x = mid_radius * Math.cos(mid_angle);
                      var y = mid_radius * Math.sin(mid_angle);

                      ctx.fillStyle = "#444";
                      var val = dataset.data[i];
                      var realPercent = Math.round((val / total) * 100)
                      var percent =
                        String(Math.round((val / total) * 100)) + "%";
                      if(realPercent <10) return

                      if (val != 0) {
                        ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                        // Display percent in another line, line break doesn't work for fillText
                        ctx.fillText(percent, model.x + x, model.y + y + 15);
                      }
                    }
                  });
                },
              },
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
        <Col span={8}>
          <h4>Case in building</h4>
          <Row justify="center">
            <Radio.Group
              options={options}
              onChange={onChange3}
              value={filterBy3}
              optionType="button"
            />
          </Row>
          <Pie
            options={{
              animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {
                  var ctx = this.chart.ctx;
                  ctx.font = Chart.helpers.fontString(
                    Chart.defaults.global.defaultFontFamily,
                    "normal",
                    Chart.defaults.global.defaultFontFamily
                  );
                  ctx.textAlign = "center";
                  ctx.textBaseline = "bottom";

                  this.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                      var model =
                          dataset._meta[Object.keys(dataset._meta)[0]].data[i]
                            ._model,
                        total =
                          dataset._meta[Object.keys(dataset._meta)[0]].total,
                        mid_radius =
                          model.innerRadius +
                          (model.outerRadius - model.innerRadius) / 2,
                        start_angle = model.startAngle,
                        end_angle = model.endAngle,
                        mid_angle = start_angle + (end_angle - start_angle) / 2;

                      var x = mid_radius * Math.cos(mid_angle);
                      var y = mid_radius * Math.sin(mid_angle);

                      ctx.fillStyle = "#444";
                      var val = dataset.data[i];
                      var realPercent = Math.round((val / total) * 100)
                      var percent =
                        String(Math.round((val / total) * 100)) + "%";
                      if(realPercent <10) return
                      if (val != 0) { 
                        ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                        // Display percent in another line, line break doesn't work for fillText
                        ctx.fillText(percent, model.x + x, model.y + y + 15);
                      }
                    }
                  });
                },
              },
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
            height={200}
            data={{
              labels: caseByBuilding.map((e) => e.x),
              datasets: [
                {
                  data: caseByBuilding.map((e) => e.y),
                  backgroundColor: caseByBuilding.map(
                    (e, i) => `${getRandomColorHex(e.y, i)}`
                  ),
                },
              ],
            }}
          />
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Registered face of student"
              value={
                registedStatus.allStudent !== 0
                  ? registedStatus.registeredStudent / registedStatus.allStudent
                  : 0
              }
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="%"
            />
          </Card>
          <Card>
            <Statistic
              title="Registered face of body guard"
              value={
                registedGuardStatus.registeredGuard /
                registedGuardStatus.allGuard
              }
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Registered face of student"
              value={`${registedStatus.registeredStudent}/${registedStatus.allStudent}`}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
          <Card>
            <Statistic
              title="Registered face of body guard"
              value={`${registedGuardStatus.registeredGuard} / ${registedGuardStatus.allGuard}`}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <h4>Student in building</h4>
          <Bar
            height={120}
            options={{
              scales: {
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "students",
                    },
                  },
                ],
              },
            }}
            data={{
              labels: studentByBuilding.map((e) => e.x),
              datasets: [
                {
                  label: "Total",
                  backgroundColor: "rgba(1,99,100,0.2)",
                  borderColor: "rgba(1,99,100,1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(1,99,100,0.4)",
                  hoverBorderColor: "rgba(1,99,100,1)",
                  data: studentByBuilding.map((e) => e.y),
                },
              ],
            }}
          />
        </Col>
        <Col span={8}>
          <h4>Student By University</h4>
          <Bar
            height={240}
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
            options={{
              scales: {
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "student",
                    },
                  },
                ],
              },
            }}
          />
        </Col>
      </Row>
    </Layout>
  );
}

export default DashBoardPage;
