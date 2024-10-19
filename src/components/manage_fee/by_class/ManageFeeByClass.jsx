import { Space, Button, Modal, Typography, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import ClassFeeTable from './ClassFeeTable';
import { useFeeApi } from 'src/services/feeService';
import { useFilterApi } from 'src/services/filterService';
import exportExcelFromJson from 'src/utils/exportExcel';

function ManageFeeByClass(){
    const [totalEntry, setTotalEntry] = useState(0);

    const [classList, setClassList] = useState([]);
    const [cohortList, setCohortList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);

    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading]  = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const filterService = useFilterApi();
    const feeService = useFeeApi();

    useEffect(() => {
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

        fetchSemesterData();
        fetchCohortData();
        fetchClassData();
    }, []);

    const triggerReload = () => {
        setReloadToggle((prev) => !prev)
    }

    const selectedRowKeyCallback = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        setSelectedRowRecords(newSelectedRowsRecord)
        console.log(newSelectedRowsRecord);
    };

    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Thống kê học phí theo lớp</h1>
            <Space className='flex justify-end my-2'>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>    
                </Space>
            </Space>
            <ClassFeeTable selectedRowKeyCallback={selectedRowKeyCallback} 
                                setTotalEntry={(total) => setTotalEntry(total)} 
                                reload={reloadToggle}
                                filter={{class_list: classList, cohort_list: cohortList, semester_list: semesterList}}/>
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </div>
    )
}

export default ManageFeeByClass;