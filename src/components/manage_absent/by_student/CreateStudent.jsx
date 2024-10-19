import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, DatePicker, Result, InputNumber } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useAbsentApi } from 'src/services/absentService';
import { InputSearchStudent } from 'src/utils/InputSearchStudent';

function CreateStudent({
    open,
    onCancel,
    reload,
    selections
}) {
    const disabled = false;

    const [studentCode, setStudentCode] = useState("");
    const [studentID, setStudentID] = useState("")
    const [studentDisplayName, setStudentDisplayName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [absentNumber, setAbsentNumber] = useState("");
    const [absentDate, setAbsentDate] = useState(dayjs());
    const [absentSubject, setAbsentSubject] = useState("");
    const [semester, setSemester] = useState("");
    const [absentReason, setAbsentReason] = useState("");

    const [classList, setClassList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);

    const [apiStatus, setApiStatus] = useState('');

    const [modal, contextHolder] = Modal.useModal();

    const absentService = useAbsentApi();

    useEffect(() => {
        setSubjectList(selections?.subject_list);
        setSemesterList(selections?.semester_list);

    }, [open]);


    const createAbsentStudent = async (cancel) => {
        console.log('Create student info');
        const body = {
            student_id: Number(studentID),
            subject_id: Number(absentSubject),
            semester_id: Number(semester),
            date_absent: dayjs(absentDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            number_lesson_absent: absentNumber,
            reason: absentReason,
        };
        let status = await absentService.createAbsentStudent(body);
        setApiStatus(status);
        status ? success(cancel) : error();
    };

    const updateInfoOnSearch = (data) => {
        console.log(data)
        setStudentID(data?.student_id);
        setStudentName(data?.full_name);
        setStudentCode(data?.student_code);
        setStudentClass(data?.student_class_id)
    };

    const error = async () => {
        let config = {
          title: 'Thêm mới thất bại',
          content: 'Đã có lỗi xảy ra! Vui lòng thử lại',
        };
        await modal.error(config)
      };

      const success = (cancel) => {
        let config = {
            title: 'Thêm mới thành công',
            content: 'Thông tin của sinh viên đã được thêm mới thành công!',
            onOk() {
                cancel()
                if (reload != null) reload()
            }
        };
        modal.success(config)
      };

    return (
        <Modal
            title="Thêm sinh viên vắng"
            open={open}
            onCancel={onCancel}
            onOk={() => createAbsentStudent(onCancel)}
            width='50%'
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Sinh viên</Typography>
                    <InputSearchStudent
                        disabled={disabled}
                        placeholder={studentDisplayName}
                        callback={updateInfoOnSearch}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Mã sinh viên</Typography>
                    <Input
                        disabled
                        value={studentCode}
                        onChange={(e) => {
                            setStudentCode(e.target.value);
                        }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Họ tên</Typography>
                    <Input
                        disabled
                        value={studentName}
                        onChange={(e) => {
                            setStudentName(e.target.value);
                        }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Lớp</Typography>
                    <Select
                        disabled
                        value={studentClass}
                        options={[
                            {
                                label: studentClass,
                                value: studentClass,
                            },
                        ]}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Số tiết học vắng mặt</Typography>
                    <InputNumber
                        disabled={disabled}
                        value={absentNumber}
                        min={1}
                        max={4}
                        onChange={(value) => {
                            setAbsentNumber(value);
                        }}
                        style={{width: '100%'}}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Ngày vắng</Typography>
                    <DatePicker
                        disabled={disabled}
                        value={absentDate} // Value need to be dayjs object!
                        format="DD/MM/YYYY"
                        onChange={(date, dateString) => setAbsentDate(dateString)}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Môn học</Typography>
                    <Select
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={disabled}
                        value={absentSubject}
                        onChange={(value) => {
                            setAbsentSubject(value);
                        }}
                        options={subjectList}
                        dropdownStyle={{width: 200}}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Kỳ học</Typography>
                    <Select
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={disabled}
                        value={semester}
                        onChange={(value) => {
                            setSemester(value);
                        }}
                        options={semesterList}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={16}>
                    <Typography>Lý do</Typography>
                    <Input
                        disabled={disabled}
                        value={absentReason}
                        onChange={(e) => {
                            setAbsentReason(e.target.value);
                        }}
                    />
                </Col>
            </Row>
            {contextHolder}
        </Modal>
    );
}

export default CreateStudent;
