import { Space, Button, Modal, Typography, Input } from 'antd';
import {  DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { useScheduleApi } from 'src/services/manageScheduleService';
import { useFilterApi } from 'src/services/filterService';
import ScheduleTable from './ScheduleTable';
import exportExcelFromJson from 'src/utils/exportExcel';
import ImportModal from './ImportModal';
import CreateSchedule from './CreateSchedule';

function ManageSchedule(){
    const [subjectList, setSubjectList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [cohortList, setCohortList] = useState([]);
    const [lecturerList, setLecturerList] = useState([]);
    const [totalEntry, setTotalEntry] = useState(0);

    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload
    
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading]  = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const scheduleService = useScheduleApi();
    const filterService = useFilterApi();
    

    useEffect(() => {
        const fetchSubjectData = async () => {
            const result = await filterService.getAllSubject();
            let subjectMapped = result?.data?.subject_ids.map((entry) => {
                console.log("Creating subject selection!");
                return {
                    text: entry.display_name,
                    value: entry.id,
                    label: entry.display_name
                }
            })
            setSubjectList(subjectMapped);
        }
        const fetchSemesterData = async () => {
            const result = await filterService.getAllSemester();
            let semesterMapped = result?.data?.semester_ids.map((entry) => {
                console.log("Creating semester selection!");
                return {
                    text: entry.display_name,
                    value: entry.id,
                    label: entry.display_name
                }
            })
            setSemesterList(semesterMapped);
        }
        const fetchClassData = async () => {
            const result = await filterService.getAllClass();
            let classMapped = result?.data?.student_class_ids.map((entry) => {
                console.log("Creating class selection!");
                return {
                    text: entry.class_name,
                    value: entry.id,
                    label: entry.class_name
                }
            })
            setClassList(classMapped);
        }
        const fetchCohortData = async () => {
            const result = await filterService.getAllCohort();
            let cohortMapped = result?.data?.student_cohort_ids.map((entry) => {
                console.log("Creating cohort selection!");
                return {
                    text: entry.number,
                    value: entry.id,
                    label: entry.number
                }
            })
            setCohortList(cohortMapped);
        }
        const fecthLecturerData = async () => {
            const result = await filterService.getAllLecturer();
            let lecturerMapped = result?.data?.lecturer_ids.map((entry) => {
                console.log("Creating lecturer selection!");
                return {
                    text: entry.display_name,
                    value: entry.id,
                    label: entry.display_name
                }
            })
            setLecturerList(lecturerMapped);
        }
        fecthLecturerData();
        fetchCohortData();
        fetchClassData();
        fetchSubjectData();
        fetchSemesterData();
    }, []);

    const patchDeleteSchedule = async () => {
        let body = {
            list_id: selectedRowKeys.map((entry) => Number(entry)),
        };
        const result = await scheduleService.patchDeleteSchedule(body);
    };

    const onPatchDeleteSchedule = async () => {
        let config = {
            title: 'Xác nhận xoá',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc muốn xoá ${selectedRowKeys.length} dòng đã chọn?`,
            onOk() {
                patchDeleteSchedule();
                setSelectedRowKeys([]);
                setSelectedRowRecords([]);
                triggerReload();
            },
            onCancel() {},
        };
        await modal.confirm(config);
    };

    const triggerReload = () => {
        setReloadToggle((prev) => !prev)
    }

    const selectedRowKeyCallback = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        setSelectedRowRecords(newSelectedRowsRecord)
        console.log(newSelectedRowsRecord);
    };

    const exportSchedule = async () => {
        setExportButtonLoading(true);
        let allSchedule;
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await scheduleService.getAllSchedule();
            allSchedule = res?.data?.teaching_schedule_ids;
        }
        else{
            console.log("Export selected");
            allSchedule = selectedRowRecords
        }
        let cleanedSchedule = allSchedule.map((entry) => {
            let lecturer_name_list = entry.lecturer_ids?.map((lecturer) => lecturer?.display_name).join(', ');
            console.log(lecturer_name_list);
            let cleanedData = {
                className: entry.student_class_id[1],
                cohort: entry.student_cohort_id[1],
                subject: entry.subject_id[1],
                semester: entry.semester_id[1],
                room: entry.room?entry.room:"",
                session: entry.teaching_session,
                lecturer_list: lecturer_name_list
            }
            return cleanedData
        })
        let cols = ['Lớp', 'Khoá', 'Môn học', 'Kỳ học', 'Phòng học', 'Buổi giảng dạy', 'Danh sách giảng viên']
        exportExcelFromJson(cleanedSchedule, cols, "Lịch giảng dạy.xlsx");
        setExportButtonLoading(false);
    }


    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Quản lý lịch giảng dạy</h1>
            <Space className='flex my-2 justify-between'>
                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>Thêm mới</Button>
                    <Button type="primary" icon={<UploadOutlined />} onClick={() => setImportModalOpen(true)}>Nhập từ Excel</Button>
                    <Button type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportSchedule}
                            loading={exportButtonLoading}
                    >
                            Xuất {selectedRowKeys.length==0?" toàn bộ": `${selectedRowKeys.length} dòng`}
                    </Button>
                    <Button className={selectedRowKeys.length!=0?'bg-red-500 text-white':''} 
                            icon={<DeleteOutlined />} 
                            disabled={selectedRowKeys.length==0}
                            onClick={onPatchDeleteSchedule}
                    >
                        Xoá {selectedRowKeys.length!=0?selectedRowKeys.length + ' dòng':''}
                    </Button>    
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>
                </Space>
            </Space>
            <ScheduleTable selectedRowKeyCallback={selectedRowKeyCallback} 
                                setTotalEntry={(total) => setTotalEntry(total)}
                                filter={{class_list: classList, 
                                    subject_list: subjectList, 
                                    semester_list: semesterList, 
                                    cohort_list: cohortList,
                                    lecturer_list: lecturerList}}
                                reload={reloadToggle}/>
            <CreateSchedule open={createModalOpen}
                        onCancel={() => setCreateModalOpen(false)}
                        reload={triggerReload}
                        selections={{subject_list: subjectList, semester_list: semesterList, class_list: classList}} />
            <ImportModal open={importModalOpen} onCancel={() => setImportModalOpen(false)} reload={triggerReload}/>
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </div>
    )
}

export default ManageSchedule;