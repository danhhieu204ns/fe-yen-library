import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, DatePicker, Result } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useFeeApi } from 'src/services/feeService';
import { InputSearchStudent } from 'src/utils/InputSearchStudent';

function EditStudent({
    open,
    onCancel,
    record,
    reload,
    selections
}) {
    const [disabled, setDisabled] = useState(true);

    const [studentID, setStudentID] = useState(null)
    const [studentCode, setStudentCode] = useState(null);
    const [studentDisplayName, setStudentDisplayName] = useState(null);
    const [studentName, setStudentName] = useState(null);
    const [studentClass, setStudentClass] = useState(null);
    const [semester, setSemester] = useState(null);
    const [feeStatus, setFeeStatus] = useState(null);

    const [semesterList, setSemesterList] = useState([]);

    const [apiStatus, setApiStatus] = useState('');

    const [modal, contextHolder] = Modal.useModal();

    const feeService = useFeeApi();

    let studentFeeID = useRef(null); // ID to call API

    // Set to disable when close or open
    useEffect(() => {
        setDisabled(true);
    }, [open]);

    useEffect(() => {
        setStudentID(record?.student_id[0]);
        setStudentCode(record?.student_code);
        setStudentDisplayName(record?.student_id[1]);
        setStudentName(record?.full_name);
        setStudentClass(record?.student_class_id[1]);
        setSemester(record?.semester_id[0]);
        setFeeStatus(record?.status);

        setSemesterList(selections?.semester_list);

        studentFeeID.current = record?.id;
    }, [open]);

    const updateStudentFee = async (cancel) => {
        if (disabled) {
            console.log('Editing is disabled. Not update');
            cancel();
            return;
        }
        console.log('Update fee info');
        const body = {
            status: feeStatus
        };
        let status = await feeService.updateStudentFeeById(studentFeeID.current, body);
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
            onOk={() => updateStudentFee(onCancel)}
        >
            <Checkbox className="my-2" onChange={(e) => setDisabled(!e.target.checked)} checked={!disabled}>
                Sửa
            </Checkbox>
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
                        disabled={true}
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

export default EditStudent;
