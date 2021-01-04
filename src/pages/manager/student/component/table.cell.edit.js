import React from "react";
import { Input, Form, DatePicker } from "antd";
import moment from "moment";
function TableCellEdit(props) {
  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    index,
    inputType,
    ...restProps
  } = props;
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef();
  const form = React.useContext(EditableContext);
  React.useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    if (
      inputType &&
      typeof inputType === typeof "" &&
      inputType.toLowerCase() === "date"
    ) {
      form.setFieldsValue({
        [dataIndex]: moment(record[dataIndex]),
      });
    } else {
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    }
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();

      if (
        inputType &&
        typeof inputType === typeof "" &&
        inputType.toLowerCase() === "date"
      ) {
        let newRecord = { ...record };
        newRecord[dataIndex] = values[dataIndex].toDate();
        handleSave(newRecord, index);
      } else {
        handleSave({ ...record, ...values }, index);
      }
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {inputType &&
        typeof inputType === typeof "" &&
        inputType.toLowerCase() === "date" ? (
          <DatePicker ref={inputRef} onPressEnter={save} onBlur={save} />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
}
const EditableContext = React.createContext();

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export default TableCellEdit;
