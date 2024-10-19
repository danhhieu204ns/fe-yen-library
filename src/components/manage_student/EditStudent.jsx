import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, DatePicker, Result } from 'antd';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useStudentApi } from 'src/services/studentService';

function EditStudent({
    open,
    onCancel,
    reload,
    record,
    selections
}){
    const [disabled, setDisabled] = useState(true);

    const [studentCode, setStudentCode] = useState(0);
    const [studentClass, setStudentClass] = useState(null);
    const [studentName, setStudentName] = useState(null);
    const [studentCohort, setStudentCohort] = useState(null);
    const [studentGender, setStudentGender] = useState(null);
    const [studentDob, setStudentDob] = useState(null);
    const [studentPhoneNumber, setStudentPhoneNumber] = useState(null);
    const [studentEmail, setStudentEmail] = useState(null);
    const [studentStatus, setStudentStatus] = useState(null);

    const [classList, setClassList] = useState([])

    const [apiStatus, setApiStatus] = useState("");

    const [modal, contextHolder] = Modal.useModal();

    const studentService = useStudentApi();

    let studentID = useRef(null); // ID to call API

    // Set to disable when close or open
    useEffect(() => {
        setDisabled(true);
    }, [open])

    useEffect(() => {
        setStudentCode(record?.student_code);
        setStudentName(record?.full_name);
        setStudentClass(record?.student_class_id[0]);
        setStudentCohort(record?.student_cohort_id); // Null?
        setStudentGender(record?.sex);
        setStudentDob(dayjs(record?.date_of_birth, "YYYY-MM-DD").format("DD/MM/YYYY"));
        setStudentPhoneNumber(record?.phone_number ? record?.phone_number : "");
        setStudentEmail(record?.email ? record?.email : "");
        setStudentStatus(record?.status);

        setClassList(selections?.class_list);

        studentID.current = record?.id;
        console.log(studentID.current)
    }, [open])

    const updateStudentInfo = async (cancel) => {
        if (disabled) {
            console.log("Editing is disabled. Not update")
            cancel()
            return
        }
        console.log("Update student info")
        const body = {
            student_code: studentCode,
            full_name: studentName,
            student_class_id: studentClass,
            phone_number: studentPhoneNumber,
            email: studentEmail,
            sex: studentGender,
            date_of_birth: dayjs(studentDob, "DD/MM/YYYY").format("YYYY-MM-DD").toString(),
            status: studentStatus
        }
        let status = await studentService.updateStudentById(studentID.current, body);
        setApiStatus(status);
        status?success(cancel):error();
    }

    const error = async () => {
        let config = {
          title: 'Cập nhật thất bại',
          content: 'Đã có lỗi xảy ra! Vui lòng thử lại',
        };
        await modal.error(config)
      };

      const success = (cancel) => {
        let config = {
            title: 'Cập nhật thành công',
            content: 'Thông tin của sinh viên đã được cập nhật thành công!',
            onOk() {
                cancel()
                if (reload != null) reload()
            }
        };
        modal.success(config)
      };

    return (
        <Modal title="Chỉnh sửa thông tin" open={open} onCancel={onCancel} onOk={() => updateStudentInfo(onCancel)}>
            <Checkbox className='my-2' onChange={(e) => setDisabled(!e.target.checked)} checked={!disabled}>Sửa</Checkbox>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Mã sinh viên</Typography>
                    <Input disabled={disabled} value={studentCode} onChange={(e) => {
                        setStudentCode(e.target.value);
                    }}/>                    
                </Col>
                <Col span={12}>
                    <Typography>Họ tên</Typography>
                    <Input disabled={disabled} value={studentName} onChange={(e) => {
                        setStudentName(e.target.value);
                    }} />
                </Col>
                <Col span={12}>
                    <Typography>Lớp</Typography>
                    <Select showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={disabled} 
                            value={studentClass}
                            onChange={(value) => {
                                setStudentClass(value);
                            }}
                            options={classList}
                            style={{width: '100%'}}/>
                </Col>
                <Col span={12}>
                    <Typography>Khoá</Typography>
                    <Select showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={true} 
                            value={record?.student_cohort_id[1]} 
                            options={[{
                                value: record?.student_cohort_id[0],
                                label: record?.student_cohort_id[1]
                            }]}
                            style={{width: '100%'}}/>
                </Col>
                <Col span={12}>
                    <Typography>Giới tính</Typography>
                    <Select showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={disabled} 
                            value={studentGender} 
                            onChange={(value) => {
                                setStudentGender(value);
                            }}
                            options={[
                                {
                                    value: "male",
                                    label: "Nam"
                                },
                                {
                                    value: "female",
                                    label: "Nữ"
                                }
                            ]}
                            style={{width: '100%'}}/>
                </Col>
                <Col span={12}>
                    <Typography>Ngày sinh</Typography>
                    <DatePicker disabled={disabled} 
                                value={dayjs(studentDob, "DD/MM/YYYY")} // Value need to be dayjs object!
                                format="DD/MM/YYYY" 
                                onChange={(date, dateString) => setStudentDob(dateString)}
                                style={{width: '100%'}} />
                </Col>
                <Col span={12}>
                    <Typography>Số điện thoại</Typography>
                    <Input disabled={disabled} value={studentPhoneNumber} onChange={(e) => {setStudentPhoneNumber(e.target.value)}}/>
                </Col>
                <Col span={12}>
                    <Typography>Email</Typography>
                    <Input disabled={disabled} value={studentEmail} onChange={(e) => {setStudentEmail(e.target.value)}}/>
                </Col>
                <Col span={12}>
                    <Typography>Trạng thái</Typography>
                    <Select showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={disabled} 
                            value={studentStatus}
                            onChange={(value) => {
                                setStudentStatus(value);
                            }} 
                            options={[
                                {
                                    value: "Đang học",
                                    label: "Đang học"
                                },
                                {
                                    value: "Đã tốt nghiệp",
                                    label: "Đã tốt nghiệp"
                                },
                                {
                                    label: 'Chuyển ngành',
                                    value: 'Chuyển ngành'
                                },
                                {
                                    label: 'Thôi học',
                                    value: 'Thôi học'
                                }
                            ]}
                            style={{width: '100%'}}/>
                </Col>
            </Row>    
            {contextHolder}
        </Modal>
    )
}

export default EditStudent;