import { Modal, Row, Col, Input, Select, Typography, Checkbox } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';

import { useScheduleApi } from 'src/services/manageScheduleService';
import LecturerListTable from './LecturerListTable';

function EditSchedule({
    open,
    onCancel,
    reload,
    record,
    selections
}) {
    const [disabled, setDisabled] = useState(false);

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

    const scheduleID = useRef();

    const scheduleService = useScheduleApi();

    // Set to disable when close or open
    useEffect(() => {
        setDisabled(true);
    }, [open]);


    useEffect(() => {
        setClassID(record?.student_class_id[0]);
        setCohort(record?.student_cohort_id[1]);
        setSubjectID(record?.subject_id[0]);
        setSemester(record?.semester_id[0]);
        setRoom(record?.room?record?.room:"");
        setSession(record?.teaching_session);
        
        setSubjectList(selections?.subject_list);
        setSemesterList(selections?.semester_list);
        setClassList(selections?.class_list);

        scheduleID.current = record?.id;
        console.log(scheduleID.current);
    }, [open]);


    const updateSchedule = async (cancel) => {
        if(disabled){
            console.log("Editing is disabled. Not update");
            cancel();
            return;
        } 
        console.log('Create student info');
        const body = {
            student_class_id: classID,
            semester_id: semester,
            subject_id: subjectID,
            room: room,
            teaching_session: session,
            lecturer_ids: lecturerIDs
        };
        let status = await scheduleService.updateSchedule(scheduleID.current, body);
        setApiStatus(status);
        status ? success(cancel) : error();
    };

    const onLecturerTableChange = (data) => {
        console.log(data)
        setLecturerIDs(data?.map((entry) => entry.id));
    };

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
            content: 'Thông tin lịch giảng dạy đã được cập nhật thành công!',
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
            title="Chỉnh sửa thông tin"
            open={open}
            onCancel={onCancel}
            onOk={() => updateSchedule(onCancel)}
            width='60%'
        >
            <Checkbox className="my-2" onChange={(e) => setDisabled(!e.target.checked)} checked={!disabled}>
                Sửa
            </Checkbox>
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
                    <LecturerListTable disabled={disabled} callback={onLecturerTableChange} data={record?.lecturer_ids}/>
                </Col>
            </Row>
            {contextHolder}
        </Modal>
    );
}

export default EditSchedule;
