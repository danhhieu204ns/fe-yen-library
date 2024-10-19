import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, DatePicker, Result } from 'antd';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useStudentApi } from 'src/services/studentService';

function CreateStudent({
    open,
    onCancel,
    reload,
    selections
}){
    const disabled = false;

    const [studentCode, setStudentCode] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentCohort, setStudentCohort] = useState("");
    const [studentGender, setStudentGender] = useState("");
    const [studentDob, setStudentDob] = useState(dayjs().format("DD/MM/YYYY"));
    const [studentPhoneNumber, setStudentPhoneNumber] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [studentStatus, setStudentStatus] = useState("");

    const [apiStatus, setApiStatus] = useState("");

    const [modal, contextHolder] = Modal.useModal();

    const studentService = useStudentApi();

    const createStudent = async (cancel) => {
        console.log("Create student")
        const body = {
            student_code: studentCode,
            full_name: studentName,
            student_class_id: Number(studentClass),
            phone_number: studentPhoneNumber,
            email: studentEmail,
            sex: studentGender,
            date_of_birth: dayjs(studentDob, "DD/MM/YYYY").format("YYYY-MM-DD").toString(),
            status: studentStatus
        }
        let status = await studentService.createStudent(body);
        setApiStatus(status);
        status?success(cancel):error();
    }

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
        <Modal title="Thêm sinh viên" open={open} onCancel={onCancel} onOk={() => createStudent(onCancel)}>
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
                            options={selections?.class_list}
                            style={{width: '100%'}}/>
                </Col>
                <Col span={12}>
                    <Typography>Khoá</Typography>
                    <Select 
                            disabled={true} 
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

export default CreateStudent;