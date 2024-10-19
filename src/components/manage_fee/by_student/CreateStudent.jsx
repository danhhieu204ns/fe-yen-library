import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, DatePicker, Result } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useFeeApi } from 'src/services/feeService';
import { InputSearchStudent } from 'src/utils/InputSearchStudent';

function CreateStudent({
    open,
    onCancel,
    reload,
    selections
}) {
    const disabled = false;

    const [studentID, setStudentID] = useState(null)
    const [studentCode, setStudentCode] = useState(null);
    const [studentDisplayName, setStudentDisplayName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [semester, setSemester] = useState("");
    const [feeStatus, setFeeStatus] = useState("");

    const [semesterList, setSemesterList] = useState([]);

    const [apiStatus, setApiStatus] = useState('');

    const [modal, contextHolder] = Modal.useModal();

    const feeService = useFeeApi();

    useEffect(() => {
        setSemesterList(selections?.semester_list);
    }, [open]);

    const createStudentFee = async (cancel) => {
        console.log('Create fee info');
        const body = {
            student_id: Number(studentID),
            semester_id: Number(semester),
            status: feeStatus
        };
        let status = await feeService.createStudentFee(body);
        setApiStatus(status);
        status ? success(cancel) : error();
    };

    const updateInfoOnSearch = (data) => {
        setStudentName(data?.full_name);
        setStudentCode(data?.student_code);
        setStudentClass(data?.student_class_id);
        setStudentID(data?.student_id);
    };

    const error = async () => {
        let config = {
            title: 'Thêm mới thất bại',
            content: 'Đã có lỗi xảy ra! Vui lòng thử lại',
        };
        await modal.error(config);
    };

    const success = (cancel) => {
        let config = {
            title: 'Thêm mới thành công',
            content: 'Thông tin học phí đã được cập nhật thành công!',
            onOk() {
                cancel();
                if (reload != null) reload();
            },
        };
        modal.success(config);
    };

    return (
        <Modal
            title="Thêm học phí"
            open={open}
            onCancel={onCancel}
            onOk={() => createStudentFee(onCancel)}
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
                <Col span={12}>
                    <Typography>Mã sinh viên</Typography>
                    <Input
                        disabled
                        value={studentCode}
                        onChange={(e) => {
                            setStudentCode(e.target.value);
                        }}
                    />
                </Col>
                <Col span={12}>
                    <Typography>Họ tên</Typography>
                    <Input
                        disabled
                        value={studentName}
                        onChange={(e) => {
                            setStudentName(e.target.value);
                        }}
                    />
                </Col>
                <Col span={12}>
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
                <Col span={12}>
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
                <Col span={12}>
                    <Typography>Trạng thái học phí</Typography>
                    <Select
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={disabled}
                        value={feeStatus}
                        onChange={(value) => {
                            setFeeStatus(value);
                        }}
                        options={[
                            {
                                label: 'Đã đóng',
                                value: true
                            },
                            {
                                label: "Chưa đóng",
                                value: false
                            }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>
            {contextHolder}
        </Modal>
    );
}

export default CreateStudent;
