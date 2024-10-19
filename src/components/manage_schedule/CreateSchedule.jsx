import { Table, Modal, Row, Col, Input, Select, Typography, Button } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';

import { useScheduleApi } from 'src/services/manageScheduleService';
import LecturerListTable from './LecturerListTable';

function CreateSchedule({
    open,
    onCancel,
    reload,
    selections
}) {
    const disabled = false;

    const [classID, setClassID] = useState("")
    const [cohort, setCohort] = useState("");
    const [subjectID, setSubjectID] = useState("");
    const [semester, setSemester] = useState("");
    const [room, setRoom] = useState("");
    const [session, setSession] = useState("");
    const [lecturerIDs, setLecturerIDs] = useState([]);

    const [classList, setClassList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);

    const [apiStatus, setApiStatus] = useState('');

    const [modal, contextHolder] = Modal.useModal();

    const scheduleService = useScheduleApi();

    useEffect(() => {
        setSubjectList(selections?.subject_list);
        setSemesterList(selections?.semester_list);
        setClassList(selections?.class_list);

    }, [open]);


    const createSchedule = async (cancel) => {
        console.log('Create student info');
        const body = {
            student_class_id: classID,
            semester_id: semester,
            subject_id: subjectID,
            room: room,
            teaching_session: session,
            lecturer_ids: lecturerIDs
        };
        let status = await scheduleService.createSchedule(body);
        setApiStatus(status);
        status ? success(cancel) : error();
    };

    const onLecturerTableChange = (data) => {
        console.log(data)
        setLecturerIDs(data?.map((entry) => entry.id));
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
            content: 'Thông tin lịch giảng dạy đã được thêm mới thành công!',
            onOk() {
                cancel()
                if (reload != null) reload()
            }
        };
        modal.success(config)
      };

    return (
        <Modal
            destroyOnClose
            title="Thêm lịch giảng dạy"
            open={open}
            onCancel={onCancel}
            onOk={() => createSchedule(onCancel)}
            width='60%'
        >
            <Row gutter={[12, 12]}>
                <Col span={8}>
                    <Typography>Lớp</Typography>
                    <Select
                        showSearch={true}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={disabled}
                        value={classID}
                        onChange={(value) => {
                            setClassID(value);
                        }}
                        options={classList}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Khoá</Typography>
                    <Input
                        disabled
                        value={cohort}
                        onChange={(e) => {
                            setCohort(e.target.value);
                        }}
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
                        value={subjectID}
                        onChange={(value) => {
                            setSubjectID(value);
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
                <Col span={8}>
                    <Typography>Phòng học</Typography>
                    <Input
                        disabled={disabled}
                        value={room}
                        onChange={(e) => {
                            setRoom(e.target.value);
                        }}
                    />
                </Col>
                <Col span={8}>
                    <Typography>Buổi giảng dạy</Typography>
                    <Select
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={disabled}
                        value={session}
                        onChange={(value) => {
                            setSession(value);
                        }}
                        options={[
                            {label:'Sáng thứ 2', value:'Sáng thứ 2'},
                            {label:'Chiều thứ 2', value:'Chiều thứ 2'},
                            {label:'Sáng thứ 3', value:'Sáng thứ 3'},
                            {label:'Chiều thứ 3', value:'Chiều thứ 3'},
                            {label:'Sáng thứ 4', value:'Sáng thứ 4'},
                            {label:'Chiều thứ 4', value:'Chiều thứ 4'},
                            {label:'Sáng thứ 5', value:'Sáng thứ 5'},
                            {label:'Chiều thứ 5', value:'Chiều thứ 5'},
                            {label:'Sáng thứ 6', value:'Sáng thứ 6'},
                            {label:'Chiều thứ 6', value:'Chiều thứ 6'},
                            {label:'Sáng thứ 7', value:'Sáng thứ 7'},
                            {label:'Chiều thứ 7', value:'Chiều thứ 7'},
                        ]}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={24}>
                    <Typography className='font-semibold'>Danh sách giảng viên</Typography>
                    <LecturerListTable callback={onLecturerTableChange}/>
                </Col>
            </Row>
            {contextHolder}
        </Modal>
    );
}

export default CreateSchedule;
