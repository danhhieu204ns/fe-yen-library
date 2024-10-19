import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, DatePicker, InputNumber } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useAbsentApi } from 'src/services/absentService';
import { InputSearchStudent } from 'src/utils/InputSearchStudent';

function EditStudent({
    open,
    onCancel,
    reload,
    record,
    selections
}) {
    const [disabled, setDisabled] = useState(true);

    const [studentCode, setStudentCode] = useState(null);
    const [studentDisplayName, setStudentDisplayName] = useState(null);
    const [studentName, setStudentName] = useState(null);
    const [studentClass, setStudentClass] = useState(null);
    const [absentNumber, setAbsentNumber] = useState(null);
    const [absentDate, setAbsentDate] = useState(null);
    const [absentSubject, setAbsentSubject] = useState(null);
    const [semester, setSemester] = useState(null);
    const [absentReason, setAbsentReason] = useState(null);

    const [classList, setClassList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);

    const [apiStatus, setApiStatus] = useState('');

    const [modal, contextHolder] = Modal.useModal();

    const absentService = useAbsentApi();

    let studentID = useRef(null); // ID to call API

    // Set to disable when close or open
    useEffect(() => {
        setDisabled(true);
    }, [open]);

    useEffect(() => {
        setStudentCode(record?.student_code);
        setStudentDisplayName(record?.display_name);
        setStudentName(record?.full_name);
        setStudentClass(record?.student_class_id[1]);
        setAbsentNumber(record?.number_lesson_absent);
        setAbsentDate(dayjs(record?.date_absent, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        setAbsentSubject(record?.subject_id[0]);
        setSemester(record?.semester_id[0]);
        setAbsentReason(record?.reason?record?.reason:"");

        setSubjectList(selections?.subject_list);
        setSemesterList(selections?.semester_list);

        studentID.current = record?.id;
        console.log(studentID.current);
    }, [open]);

    const updateAbsentStudentInfo = async (cancel) => {
        if (disabled) {
            console.log('Editing is disabled. Not update');
            cancel();
            return;
        }
        console.log('Update student info');
        const body = {
            subject_id: Number(absentSubject),
            number_lesson_absent: absentNumber,
            reason: absentReason,
        };
        let status = await absentService.updateAbsentStudentById(studentID.current, body);
        setApiStatus(status);
        status ? success(cancel) : error();
    };

    const updateInfoOnSearch = (data) => {
        setStudentName(data?.full_name);
        setStudentCode(data?.student_code);
        setStudentClass(data?.student_class_id)
    };

    const error = async () => {
        let config = {
            title: 'Cập nhật thất bại',
            content: 'Đã có lỗi xảy ra! Vui lòng thử lại',
        };
        await modal.error(config);
    };

    const success = (cancel) => {
        let config = {
            title: 'Cập nhật thành công',
            content: 'Thông tin của sinh viên đã được cập nhật thành công!',
            onOk() {
                cancel();
                if (reload != null) reload();
            },
        };
        modal.success(config);
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin"
            open={open}
            onCancel={onCancel}
            onOk={() => updateAbsentStudentInfo(onCancel)}
            width='50%'
        >   
            <Checkbox className="my-2" onChange={(e) => setDisabled(!e.target.checked)} checked={!disabled}>
                Sửa
            </Checkbox>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Sinh viên</Typography>
                    <InputSearchStudent
                        disabled={true}
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
                        disabled={true}
                        value={dayjs(absentDate, 'DD/MM/YYYY')} // Value need to be dayjs object!
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
                        disabled={true}
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

export default EditStudent;
