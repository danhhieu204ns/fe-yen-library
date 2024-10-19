import { Space, Button, Modal, Typography, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import AbsentSubjectTable from './AbsentSubjectTable';
import { useAbsentApi } from 'src/services/absentService';
import { useFilterApi } from 'src/services/filterService';
import exportExcelFromJson from 'src/utils/exportExcel';

function ManageAbsentBySubject(){
    const [totalEntry, setTotalEntry] = useState(0);

    const [subjectList, setSubjectList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [cohortList, setCohortList] = useState([]);

    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading]  = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const absentService = useAbsentApi();
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
        fetchCohortData();
        fetchClassData();
        fetchSubjectData();
        fetchSemesterData();
    }, []);

    const triggerReload = () => {
        setReloadToggle((prev) => !prev)
    }

    const selectedRowKeyCallback = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        setSelectedRowRecords(newSelectedRowsRecord)
        console.log(newSelectedRowsRecord);
    };

    const exportStudent = async () => {
        setExportButtonLoading(true);
        let allSubjecet;
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await absentService.getAllAbsentSubject();
            allSubjecet = res?.data?.student_subject_absent_ids;
        }
        else{
            console.log("Export selected");
            allSubjecet = selectedRowRecords;
        }
        let cleanedSubject = allSubjecet.map((entry) => {
            let data = {
                student_code: entry.student_code,
                full_name: entry.full_name,
                class_name: entry.student_class_id[1],
                number_absent: entry.total_lesson_absent,
                percent_absent: (Math.round(parseFloat(entry.percent_absent) * 100) / 100).toFixed(2) + '%',
                subject: entry.subject_id[1],
                semester: entry.semester_id[1]
            }
            return data;
        })
        let cols = ['Mã sinh viên', 'Họ tên', 'Lớp', 'Tổng số tiết vắng', 'Phần trăm vắng', 'Môn học', 'Kỳ học'];
        exportExcelFromJson(cleanedSubject, cols, "Vắng theo môn học.xlsx");
        setExportButtonLoading(false);
    }

    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Thống kê vắng theo môn học</h1>
            <Space className='flex justify-between my-2'>
                <Space>
                    <Button type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportStudent}
                            loading={exportButtonLoading}
                        >
                            Xuất {selectedRowKeys.length==0?" toàn bộ": `${selectedRowKeys.length} dòng`}
                    </Button>
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>    
                </Space>
            </Space>
            <AbsentSubjectTable selectedRowKeyCallback={selectedRowKeyCallback} 
                                setTotalEntry={(total) => setTotalEntry(total)} 
                                reload={reloadToggle}
                                filter={{class_list: classList, subject_list: subjectList, semester_list: semesterList, cohort_list: cohortList}}/>
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </div>
    )
}

export default ManageAbsentBySubject;