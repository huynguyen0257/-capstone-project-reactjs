import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  MinusCircleOutlined,
  NotificationOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Layout,
  message,
  Row,
  Select,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Timeline,
  Typography,
  Upload,
  Spin,
} from "antd";
import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FrameDrawComponent } from "../../../components";
import { environment } from "../../../environment";
import {
  getDangerousCaseById,
  getUsername,
  updateStep,
  uploadFileCase,
} from "../../../services";
import "./dangerous.case.css";
import {
  Document,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  Media,
  Packer,
  Paragraph,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
  HeadingLevel,
  AlignmentType,
  TextRun,
  TabStopType,
  TabStopPosition,
} from "docx";
import { saveAs } from "file-saver";
import { useHistory } from "react-router-dom";

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

function DangerousCaseDetailPage() {
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingCase, setIsLoadingCase] = React.useState(true);
  const [isUpdateCase, setIsUpdateCase] = React.useState(false);
  const [fileUploads, setFileUploads] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("1");
  const [haveParent, setHaveParent] = React.useState(true);
  const [dangerousCase, setDangerousCase] = React.useState(null);
  // const [autoComplete, setAutoComplete] = React.useState('');
  // const [radioValue, setRadioValue] = React.useState(null);
  // const [previewImage, setPreviewImage] = React.useState(null);
  // const [previewVisible, setPreviewVisible] = React.useState(null);
  // const [previewTitle, setPreviewTitle] = React.useState(null);
  const caseState = useSelector((state) => state.case);
  const policyState = useSelector((state) => state.policy);
  const [form] = Form.useForm();
  let { id } = useParams();
  const history = useHistory();
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not validate email!",
      number: "${label} is not a validate number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  const downloadFileWord = async () => {
    setIsLoading(true);
    const doc = new Document();
    const imageLines = [];
    for (let e of dangerousCase.CaseImages) {
      console.log(e);
      const blob = await fetch(
        `${environment.endpoint}/api/Dangerouscase/Image/${e.Id}`
      ).then((r) => r.blob());
      imageLines.push(Media.addImage(doc, blob));
      imageLines.push(new TextRun("  "));
    }
    let para1 = null;
    try {
      para1 = new TextRun({
        text: `Hôm nay vào lúc: ${dangerousCase.CreatedAt.getHours()} giờ,  ${dangerousCase.CreatedAt.getMinutes()} phút, ngày ${dangerousCase.CreatedAt.getDate()} tháng ${
          dangerousCase.CreatedAt.getMonth() + 1
        } năm  ${dangerousCase.CreatedAt.getFullYear()} tại hành lang ${dangerousCase.Location.toLowerCase()
          .split("camera")[1]
          .replace(
            ".",
            ""
          )}, tòa nhà ${dangerousCase.Location.toLowerCase()
          .split("camera")[0]
          .replace("building:", "")
          .replace(
            ".",
            ""
          )}, ký túc xá khu B đại học quốc gia Thành phố Hồ Chí Minh.`,
        size: 24, // 24 la 12 that
      });
    } catch (e) {
      para1 = new TextRun({
        text: `Hôm nay vào lúc: ${dangerousCase.CreatedAt.getHours()} giờ,  ${dangerousCase.CreatedAt.getMinutes()} phút, ngày ${dangerousCase.CreatedAt.getDate()} tháng ${
          dangerousCase.CreatedAt.getMonth() + 1
        } năm  ${dangerousCase.CreatedAt.getFullYear()} tại tại khu vực khuôn viên ......................................., ký túc xá khu B đại học quốc gia Thành phố Hồ Chí Minh.`,
        size: 24, // 24 la 12 that
      });
    }
    const studentLines = dangerousCase.Students.map(
      (e, i) =>
        new Paragraph({
          spacing: {
            before: i ===0 ? 200: 0,
          },
          children: [
            new TextRun({
              text: `           0${i + 1}/  ${e.Name}.`,
              size: 24, // 24 la 12 that
            }),
          ],
        })
    );
    doc.addSection({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",
              size: 28,
              allCaps: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Độc lập - Tự do - Hạnh phúc",
              size: 26,
              allCaps: true,
            }),
          ],
        }),
        new Paragraph({
          text: "**********",
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "BIÊN BẢN XỬ PHẠT SINH VIÊN VI PHẠM QUY ĐỊNH QUẢN LÝ KÝ TÚC XÁ",
              size: 32,
              allCaps: true,
            }),
          ],
        }),
        new Paragraph(""),
        new Paragraph(""),
        new Paragraph({
          children: [para1],
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: "Chúng tôi gồm có:",
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text:
                "           01/ Ông: .............................................................. Chức vụ: ........................",
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text:
                "           02/ Ông: .............................................................. Chức vụ: ........................",
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text:
                "           03/ Ông: .............................................................. Chức vụ: ........................",
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text:
                "Tiến hành lập biên bản xử lý các sinh viên có tên sau đây đã vi phạm Quy định quản lý Ký túc xá:",
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        ...studentLines,
        new Paragraph({
          children: [
            new TextRun({
              text: `           0${
                studentLines.length + 1
              }/  ..........................................................................................`,
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `           0${
                studentLines.length + 2
              }/  ..........................................................................................`,
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `           0${
                studentLines.length + 3
              }/  ..........................................................................................`,
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: `Nội dung vi phạm: ${dangerousCase.PolicyFine} ..................................................................................................................................... ..............................................................................................................................................................................................................................................................................................................................`,
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: "Hình ảnh vi phạm:",
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: imageLines,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: `Hình thức xử lý:  ............................................................................................................................................................................................................................................................................................................`,
              size: 24, // 24 la 12 that
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: `thành phố Hồ Chí Minh, ngày ${new Date().getDate()} tháng ${
                new Date().getMonth() + 1
              } năm ${new Date().getFullYear()}`,
              size: 24, // 24 la 12 that
            }),
          ],
          alignment: AlignmentType.END,
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: `Người lập biên bản              `,
              size: 24, // 24 la 12 that
              bold: true,
            }),
          ],
          alignment: AlignmentType.END,
        }),
        new Paragraph(""),
        new Paragraph(""),
        new Paragraph(""),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: `Ý kiến của phòng CTSV`,
              size: 24, // 24 la 12 that
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          spacing: {
            before: 200,
          },
          children: [
            new TextRun({
              text: `............................................................................................................................................................................................................................................................................................................`,
              size: 24, // 24 la 12 that
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    });
    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, "BIEN_BAN.docx");
      console.log("Document created successfully");
    });
    setIsLoading(false);
  };
  const getColorByName = (name) => {
    switch (name.toLowerCase()) {
      case environment.process_step.pending.name:
        return environment.process_step.pending.color_timeline;

      case environment.process_step.processing.name:
      case environment.process_step.considering.name:
        return environment.process_step.considering.color_timeline;

      case environment.process_step.skipping.name:
        return environment.process_step.skipping.color_timeline;

      case environment.process_step.rejection.name:
        return environment.process_step.rejection.color_timeline;

      case environment.process_step.close.name:
        return environment.process_step.close.color_timeline;

      case environment.process_step.saving.name:
        return environment.process_step.saving.color_timeline;
      default:
        return "red";
    }
  };

  const getButtonByName = (name, id) => {
    switch (name.toLowerCase()) {
      case environment.process_step.pending.name:
        return (
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {environment.process_step.pending.before_action}
          </Button>
        );
      case environment.process_step.processing.name:
      case environment.process_step.considering.name:
        return (
          <Button
            type={environment.process_step.processing.before_action_type}
            loading={isLoading}
            onClick={() =>
              onUpdateStep(environment.process_step.processing.name)
            }
          >
            {environment.process_step.processing.before_action}
          </Button>
        );
      case environment.process_step.skipping.name:
        return (
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {environment.process_step.skipping.before_action}
          </Button>
        );
      case environment.process_step.rejection.name:
        return (
          <Button
            type={environment.process_step.rejection.before_action_type}
            loading={isLoading}
            onClick={() =>
              onUpdateStep(environment.process_step.rejection.name)
            }
          >
            {environment.process_step.rejection.before_action}
          </Button>
        );
      case environment.process_step.close.name:
        return (
          <Button
            type={environment.process_step.close.before_action_type}
            loading={isLoading}
            onClick={() => onUpdateStep(environment.process_step.close.name)}
          >
            {environment.process_step.close.before_action}
          </Button>
        );
      case environment.process_step.saving.name:
        return (
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {environment.process_step.saving.before_action}
          </Button>
        );
      default:
        return <></>;
    }
  };

  const handleSelectChange = (value) => {
    // let a = [{value: "Approve new case type "+policyState.policies.filter(policy => policy.Id === value)[0].Name}];
    // setAutoComplete(a);
    let a =
      "Approve new case type " +
      policyState.policies.filter((policy) => policy.Id === value)[0].Name;
    form.setFieldsValue({ Subject: a });
  };

  const onUpdateStep = async (statusName) => {
    let valid = true;
    setActiveTab("2");
    setIsLoading(true);
    let publishFileUrls = [];
    console.log('fileUploads');
    console.log(fileUploads);
    if (fileUploads && fileUploads.length > 0) {
      if (
        fileUploads.filter((file) =>
          file.status.toLowerCase().includes("error")
        ).length > 0
      ) {
        valid = false;
        setIsLoading(false);
        setErr("Have file upload failed");
      }
      for (const fileUpload of fileUploads) {
        const fd = new FormData();
        fd.append("fileCase", fileUpload.originFileObj, fileUpload.name);
        await uploadFileCase(fd, id)
          .then((res) => {
            publishFileUrls.push(res.data);
          })
          .catch((err) => {
            console.error(err.message);
          });
      }
    }
    if (valid) {
      let value = {};
      value.CaseId = id;
      value.Content = form.getFieldsValue().Content;
      value.Subject = form.getFieldsValue().Subject;
      value.PolicyId = form.getFieldsValue().PolicyId;
      value.StatusId = caseState.caseHistoryStatus.filter(
        (e) => e.Name.toLowerCase() === statusName.toLowerCase()
      )[0].Id;
      value.FileUrls = publishFileUrls;
      // console.log(statusName);
      switch (statusName.toLowerCase()) {
        case "rejection":
          setIsLoading(false);
          value.Subject = "Deny process this case";
          break;
        case "processing":
          if (!value.Subject) {
            setErr("Subject is required");
            setIsLoading(false);
            return;
          }
          if (!value.PolicyId) {
            setErr("Policy is required");
            setIsLoading(false);
            return;
          }
          break;
        case "close":
          if (!value.Subject) {
            setErr("Subject is required");
            setIsLoading(false);
            return;
          }
          break;
        default:
          return;
      }

      updateStep(value)
        .then((res) => {
          // console.log(res);
          setIsUpdateCase(true);
          // res.CaseHistoryId
          form.resetFields();
          if (statusName.toLowerCase().includes("processing")){
            form.setFieldsValue({ Subject: "Upload reports" });
            console.log(policyState.policies.filter(policy => policy.Id === value.PolicyId)[0]);
            dangerousCase.PolicyName = policyState.policies.filter(policy => policy.Id === value.PolicyId)[0].Name;
            dangerousCase.PolicyColor = policyState.policies.filter(policy => policy.Id === value.PolicyId)[0].Color;
          }
          let caseStatus = caseState.caseHistoryStatus.filter(
            (e) => e.Id === value.StatusId
          )[0];
          dangerousCase.CaseHistories.unshift({
            Content: value.Content,
            CreatedBy: getUsername(),
            CreatedAt: new Date(),
            StatusName: caseStatus.Name,
            Subject: value.Subject,
            StatusOrder: caseStatus.Order,
            StatusId: caseStatus.Id,
            FileUrls: res.data.FileUrls ? res.data.FileUrls : undefined,
          });
          dangerousCase.StatusId = caseStatus.Id;
          setDangerousCase(dangerousCase);
          if (
            caseState.caseHistoryStatus &&
            caseState.caseHistoryStatus.length > 0 &&
            dangerousCase &&
            dangerousCase.CaseHistories
          ) {
            let havePa =
              caseState.caseHistoryStatus.filter(
                (step) => step.Id === dangerousCase.CaseHistories[0].StatusId
              )[0].ParentId.length > 0;
            setHaveParent(havePa);

            let parentId = caseState.caseHistoryStatus.filter(
              (step) => step.Id === dangerousCase.CaseHistories[0].StatusId
            )[0].ParentId[0];
            console.log(`parentId: ${parentId}`);

            // setRadioValue(parentId);
            setIsLoading(false);
            setIsUpdateCase(false);
          }
          console.log(dangerousCase);
          setDone("Update Step Completed");
        })
        .catch((err) => {
          setIsLoading(false);
          setErr("Error: " + err.message);
        });
    }
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  React.useEffect(() => {
    if (policyState.policies.length > 0) {
      fetchDangerousCase(true);
    }
  }, [id, policyState.policies]);
  React.useEffect(() => {
    if (
      caseState.caseHistoryStatus &&
      caseState.caseHistoryStatus.length > 0 &&
      dangerousCase &&
      dangerousCase.CaseHistories
    ) {
      let havePa =
        caseState.caseHistoryStatus.filter(
          (step) => step.Id === dangerousCase.CaseHistories[0].StatusId
        )[0].ParentId.length > 0;
      setHaveParent(havePa);

      let parentId = caseState.caseHistoryStatus.filter(
        (step) => step.Id === dangerousCase.CaseHistories[0].StatusId
      )[0].ParentId[0];
      console.log(`parentId: ${parentId}`);
      // setRadioValue(parentId);
    }
  }, [isLoadingCase]);

  const fetchDangerousCase = (pageLoad = true) => {
    setIsLoading(true);
    setIsLoadingCase(pageLoad);
    getDangerousCaseById(id)
      .then((res) => {
        console.log(res.data);
        res.data.CreatedAt = new Date(res.data.CreatedAt);
        setDangerousCase(res.data);
        let a = "Approve new case type " + res.data.PolicyName;
        if (
          !res.data.CaseHistories[0].StatusName.toLowerCase().includes(
            "pending"
          )
        ) {
          a = "Upload reports";
        }

        let b = policyState.policies.filter(
          (policy) =>
            policy.Name.toLowerCase() === res.data.PolicyName.toLowerCase()
        )[0].Id;
        form.setFieldsValue({ Subject: a, PolicyId: b });
        setIsLoading(false);
        setIsLoadingCase(false);
    })
      .catch((error) => {
        console.log("Error: " + error.message);
        setIsLoadingCase(false);
        history.push('/manager/404');
      });
  };

  // const onChange = (e) => {
  //   setRadioValue(e.target.value);
  // };

  return isLoadingCase ||
    isUpdateCase ||
    !caseState.caseHistoryStatus ||
    caseState.caseHistoryStatus.length === 0 ||
    !dangerousCase ||
    dangerousCase.CaseHistories.length === 0 ? (
    // || !currentCaseHistory
    <Skeleton active />
  ) : (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Manager</Breadcrumb.Item>
        <Breadcrumb.Item>Dangerous case </Breadcrumb.Item>
        <Breadcrumb.Item>Detail</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Tabs defaultActiveKey={activeTab} className={"box"}>
          <div
            className={`ribbon ribbon-top-right ${dangerousCase.CaseHistories[0].StatusName.toLowerCase()}`}
          >
            <span>{dangerousCase.CaseHistories[0].StatusName}</span>
          </div>
          <TabPane
            tab={
              <span>
                <NotificationOutlined />
                Information
              </span>
            }
            key="1"
          >
            <Descriptions bordered size="default" font-weight="bold">
              <Descriptions.Item label="Code">
                {dangerousCase.Code}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                <Moment format="DD/MM/YYYY">{dangerousCase.CreatedAt}</Moment>
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                <Moment format="hh : mm A">{dangerousCase.CreatedAt}</Moment>
              </Descriptions.Item>
              <Descriptions.Item label="Level of warning">
                <Tag
                  color={`${dangerousCase.LevelColor}`}
                  key={dangerousCase.LevelName}
                >
                  {dangerousCase.LevelName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag
                  color={`${dangerousCase.PolicyColor}`}
                  key={dangerousCase.PolicyName}
                >
                  {dangerousCase.PolicyName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Prohibited Item">
                {dangerousCase.ProhibitedItemNames.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Student" span={2}>
                {dangerousCase.Students.map((student) => (
                  <div key={student.Code}>
                    <p>
                      <Text strong mark style={{ marginRight: 10 }}>
                        {student.Name}
                      </Text>
                      <Link to={`/manager/student/${student.Id}?tabPane=2`}>
                        View detail
                      </Link>
                    </p>
                    <p>
                      <Text strong>Code: </Text>
                      {student.Code}
                    </p>
                    <p>
                      <Text strong>Room: </Text>
                      {student.RoomCode}
                    </p>
                    <p>
                      <Text strong>University: </Text>
                      {student.UniversityName}
                    </p>
                  </div>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Report By" span={1}>
                {dangerousCase.CreatedBy}
              </Descriptions.Item>
              <Descriptions.Item label="Location" span={3}>
                {dangerousCase.Location}
              </Descriptions.Item>
              <Descriptions.Item label="Evidence Images" span={3} s>
                <Space direction="vertical">
                  <Row gutter={[24, 24]}>
                    {dangerousCase.CaseImages.map((image, index) => (
                      <Col span={12} key={index}>
                        {/* <img src={`${image.ImageUrl}`} width='100%' /> */}
                        <FrameDrawComponent
                          src={image.ImageUrl}
                          FaceData={JSON.parse(
                            image.FaceData
                          )}
                          ProhibitedItemData={JSON.parse(
                            image.ProhibitedItemData
                          )}
                          BodyData={JSON.parse(
                            image.BodyData
                          )}
                        />
                      </Col>
                    ))}
                  </Row>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                History Steps
              </span>
            }
            key="2"
          >
            <Row>
              <Col span={haveParent ? 14 : 22}>
                <Timeline mode="left">
                  {dangerousCase.CaseHistories.map((caseHistory, index) => (
                    <Timeline.Item
                      key={index}
                      color={getColorByName(caseHistory.StatusName)}
                      label={
                        <Text strong>
                          <Moment format="HH:mm DD/MM/YYYY">
                            {caseHistory.CreatedAt}
                          </Moment>
                        </Text>
                      }
                    >
                      <div>
                        <Text
                          strong
                          color={getColorByName(caseHistory.StatusName)}
                        >
                          {caseHistory.StatusName}
                        </Text>
                      </div>
                      <div>
                        <Card
                          size="small"
                          title={caseHistory.Subject}
                          // style={{ width: 300 }}
                        >
                          <Text>
                            <pre style={{ minHeight: 150, minWidth: 200 }}>
                              {" "}
                              {caseHistory.Content}{" "}
                            </pre>
                            {caseHistory &&
                            caseHistory.FileUrls &&
                            caseHistory.FileUrls.length > 0 ? (
                              caseHistory.FileUrls.map((file, index) => (
                                <a target="_blank" href={file.fileUrl}>
                                  <li>
                                    [FILE]{" "}
                                    {file.fileUrl
                                      .match(/Z\w*.\w*/g)[0]
                                      .substring(1)}
                                  </li>
                                </a>
                                // <p>{file.fileUrl}</p>
                              ))
                            ) : (
                              <pre></pre>
                            )}
                            <Row>
                              <Col span={8}>Created By:</Col>
                              <Col span={16}>{caseHistory.CreatedBy}</Col>
                            </Row>
                          </Text>
                        </Card>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Col>
              {haveParent ? (
                <Col align="center" span={10}>
                  <Form
                    {...layout}
                    form={form}
                    name="nest-messages"
                    onFinish={onUpdateStep}
                    validateMessages={validateMessages}
                  >
                    <Text strong>New steps</Text>
                    {policyState.policies.length > 0 &&
                    dangerousCase.CaseHistories[0].StatusName.toLowerCase().includes(
                      "pending"
                    ) ? (
                      <Form.Item
                        name="PolicyId"
                        label="Type of case"
                        hasFeedback
                      >
                        <Select onChange={(value) => handleSelectChange(value)}>
                          {policyState.policies.map((p) => (
                            // <Option value={p.Id}><Tag color={p.Color}>{p.Name}</Tag></Option>
                            <Option value={p.Id}>{p.Name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : (
                      <></>
                    )}

                    <Form.Item
                      name={["Subject"]}
                      label="Subject"
                      rules={[
                        { required: true, message: "Subject is required!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name={["Content"]} label="Content">
                      <Input.TextArea style={{ minHeight: 160 }} />
                    </Form.Item>
                    {dangerousCase.CaseHistories[0].StatusName.toLowerCase().includes(
                      "processing"
                    ) ? (
                      <div>
                        <div>
                          Download file word{" "}
                          <Spin spinning={isLoading}>
                            <a
                              style={{ color: "blue" }}
                              onClick={downloadFileWord}
                            >
                              here
                            </a>
                          </Spin>
                        </div>
                        <Form.Item
                          name={["sanctioningDecisionFile"]}
                          label="(pdf,word)"
                        >
                          {" "}
                          <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            accept=".pdf,.doc,.docx"
                            fileList={fileUploads}
                            onRemove={(file) =>
                              setFileUploads((files) =>
                                files.filter(function (value, index, arr) {
                                  return value != file;
                                })
                              )
                            }
                            beforeUpload={(file) => {
                              // console.log("beforeUpload");
                              // console.log(file);
                              // setFileUploads((files) => [...files, file]);
                              setIsLoading(true);
                            }}
                            onChange={(info) => {
                              // if (info.file.status === 'uploading') {
                              //   console.log('info');
                              //   console.log(info);
                              //   console.log('info.fileList[info.fileList.length-1]');
                              //   console.log(info.fileList[0]);
                              // }
                              if (info.file.status === 'done') {
                                message.success(`${info.file.name} file uploaded successfully`);
                                setFileUploads((files) => [...files, info.file]);
                                setIsLoading(false);
                              } else if (info.file.status === 'error') {
                                message.error(`${info.file.name} file upload failed.`);
                                setIsLoading(false);
                              }
                            }}
                          >
                            {fileUploads.length >= 4 ? null : (
                              <Button icon={<UploadOutlined />}>
                                Upload files
                              </Button>
                            )}
                          </Upload>
                        </Form.Item>
                      </div>
                    ) : (
                      <></>
                    )}
                    <Form.Item {...tailLayout}>
                      {caseState.caseHistoryStatus
                        .filter(
                          (step) =>
                            step.Id === dangerousCase.CaseHistories[0].StatusId
                        )[0]
                        .ParentId.map((nextStepId, index) =>
                          getButtonByName(
                            caseState.caseHistoryStatus.filter(
                              (step) => step.Id === nextStepId
                            )[0].Name
                          )
                        )}
                    </Form.Item>
                  </Form>
                  {/* </Row> */}
                  {/* <Row justify="center">
                    <Image
                      className="image__enhance"
                      src={
                        caseState.caseHistoryStatus.filter(
                          (step) =>
                            step.Id === dangerousCase.CaseHistories[0].StatusId
                        )[0].Image
                      }
                      alt="alt"
                      width="40%"
                      maxheight="250"
                    />
                  </Row> */}
                  {/* <Modal
                      visible={previewVisible}
                      title={previewTitle}
                      footer={null}
                      onCancel={() => setPreviewVisible(false)}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                      />
                    </Modal> */}
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </TabPane>
        </Tabs>
      </Content>
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
    </Layout>
  );
}

export default DangerousCaseDetailPage;
