import { Space, Button, Modal, Typography, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AbsentClassTable from './AbsentClassTable';
import { useAbsentApi } from 'src/services/absentService';
import { useFilterApi } from 'src/services/filterService';
import exportExcelFromJson from 'src/utils/exportExcel';

function ManageAbsentByClass(){
    const [totalEntry, setTotalEntry] = useState(0);

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
        let allClass;
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await absentService.getAllAbsentClass();
            allClass = res?.data?.student_class_absent_ids;
        }
        else{
            console.log("Export selected");
            allClass = selectedRowRecords;
        }
        let cleanedClass = allClass.map((entry) => {
            let absent_list = entry.student_absent_ids.map((student) => {
                    console.log(student?.display_name)
                    return student?.display_name
                }).join(', ')
            let data = {
                class_name: entry.class_name,
                date_absent: dayjs(entry.date_absent, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                number_absent: entry.number_absent,
                absent_list: absent_list
            }
            return data;
        })
        let cols = ['Lớp', 'Ngày', 'Số lượng vắng', 'Danh sách vắng'];
        exportExcelFromJson(cleanedClass, cols, "Vắng theo lớp.xlsx");
        setExportButtonLoading(false);
    }


    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Thống kê vắng theo lớp</h1>
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
            <AbsentClassTable selectedRowKeyCallback={selectedRowKeyCallback}
                            setTotalEntry={(total) => setTotalEntry(total)} 
                            filter={{class_list: classList, cohort_list: cohortList}}
                            reload={reloadToggle}/>
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </div>
    )
}

export default ManageAbsentByClass;