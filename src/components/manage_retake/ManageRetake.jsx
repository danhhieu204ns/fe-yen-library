import { Space, Button, Modal, Typography, Input, notification } from 'antd';
import { DownloadOutlined, SyncOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import RetakeTable from './RetakeTable';
import { useRetakeApi } from 'src/services/retakeService';
import { useFilterApi } from 'src/services/filterService';
import exportExcelFromJson from 'src/utils/exportExcel';

function ManageRetake(){
    const [totalEntry, setTotalEntry] = useState(0);

    const [subjectList, setSubjectList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [cohortList, setCohortList] = useState([]);

    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading]  = useState(false);
    const [syncButtonLoading, setSyncButtonLoading]  = useState(false);

    const [modal, contextHolder] = Modal.useModal();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const filterService = useFilterApi();
    const retakeService = useRetakeApi();

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
        fetchSubjectData();
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

    const openNotification = (type, title, content='') => {
        notificationApi[type]({
            message: title,
            description: content
        })
    }

    const exportRetake = async () => {
        setExportButtonLoading(true);
        let allRetake;
        // Nếu không chọn dòng nào thì getAll để xuất toàn bộ
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await retakeService.getAllRetake();
            allRetake = res?.data?.data;
        }
        else{
            console.log("Export selected");
            allRetake = selectedRowRecords;
        }
        let cleanedRetake = allRetake.map((entry) => {
            let subject_retake_list = entry.student_learn_again_ids.map((entry) => entry.subject_id[1]).join('\n');
            let cleanData = {
                code: entry.student_code,
                name: entry.full_name,
                class: entry.student_class_id[1],
                subject_retake: subject_retake_list
            }
            return cleanData;
        })
        exportExcelFromJson(cleanedRetake, ['Mã sinh viên', 'Họ tên', 'Lớp', 'Danh sách môn học lại'], "Quản lý sinh viên học lại.xlsx");
        setExportButtonLoading(false);
    }

    const syncRetake = async () => {
        setSyncButtonLoading(true);
        openNotification('info', 'Đang thực hiện đồng bộ danh sách sinh viên học lại', 'Quá trình này có thể mất vài phút');
        let res = await retakeService.crawlRetake();
        setSyncButtonLoading(false);
        if (res){
            openNotification('success', 'Đồng bộ thành công');    
            triggerReload();
        }
        else{
            openNotification('error', 'Đồng bộ thất bại', 'Vui lòng thử lại sau');
        }
    }

    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Sinh viên học lại</h1>
            <Space className='flex justify-between my-2'>
                <Space>
                    <Button type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportRetake}
                            loading={exportButtonLoading}
                    >
                            Xuất {selectedRowKeys.length==0?" toàn bộ": `${selectedRowKeys.length} dòng`}
                    </Button>
                    <Button type="primary" 
                            icon={<SyncOutlined />}
                            onClick={syncRetake}
                            loading={syncButtonLoading}
                    >
                            Đồng bộ
                    </Button>      
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>    
                </Space>
            </Space>
            <RetakeTable selectedRowKeyCallback={selectedRowKeyCallback} 
                                setTotalEntry={(total) => setTotalEntry(total)} 
                                reload={reloadToggle}
                                filter={{class_list: classList, cohort_list: cohortList, subject_list: subjectList}}/>
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
            {notificationContextHolder}
        </div>
    )
}

export default ManageRetake;