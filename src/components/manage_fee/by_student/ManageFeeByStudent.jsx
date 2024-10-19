import { Space, Button, Modal, Typography, Input } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { useEffect, useState } from 'react';

import { useFeeApi } from 'src/services/feeService';
import { useFilterApi } from 'src/services/filterService';
import CreateStudent from './CreateStudent';
import StudentFeeTable from './StudentFeeTable';
import exportExcelFromJson from 'src/utils/exportExcel';
import ImportModal from './ImportModal';

function ManageFeeByStudent(){
    const [semesterList, setSemesterList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [cohortList, setCohortList] = useState([]);
    const [totalEntry, setTotalEntry] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading] = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const filterService = useFilterApi();
    const feeService = useFeeApi();
    

    useEffect(() => {
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
        fetchSemesterData();
    }, [])


    const patchDeleteStudent = async () => {
        let body = {
            list_id: selectedRowKeys.map((entry) => Number(entry)),
        };
        const result = await feeService.patchDeleteStudentFee(body);
    };

    const onPatchDeleteStudent = async () => {
        let config = {
            title: 'Xác nhận xoá',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc muốn xoá ${selectedRowKeys.length} dòng đã chọn?`,
            onOk() {
                patchDeleteStudent();
                setSelectedRowKeys([])
                setSelectedRowRecords([])
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
        setSelectedRowRecords(newSelectedRowsRecord);
        console.log(newSelectedRowsRecord)
    }

    const exportStudent = async () => {
        setExportButtonLoading(true);
        let allStudent;
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await feeService.getAllStudentFee();
            allStudent = res?.data?.student;
        }
        else{
            console.log("Export selected");
            allStudent = selectedRowRecords;
        }
        
        let cleanedStudent = allStudent.map((entry) => {
            let colOrder = {
                student_code: entry.student_code,
                full_name: entry.full_name,
                student_class_id: entry.student_class_id[1],
                semester_id: entry.semester_id[1],
                status: entry.status?"Đã đóng":"Chưa đóng",
            }
            return colOrder;
        })
        console.log(cleanedStudent);
        let cols = ['Mã sinh viên', 'Họ tên', 'Lớp', 'Kỳ học', 'Đã đóng tiền học?']
        exportExcelFromJson(cleanedStudent, cols, "Học phí sinh viên.xlsx");
        setExportButtonLoading(false);
    }

    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Sinh viên - Học phí</h1>
            <Space className='flex my-2 justify-between'>
                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>Thêm mới</Button>
                    <Button type="primary" icon={<UploadOutlined />} onClick={() => setImportModalOpen(true)}>Nhập từ Excel</Button>
                    <Button type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportStudent}
                            loading={exportButtonLoading}
                    >
                            Xuất {selectedRowKeys.length==0?" toàn bộ": `${selectedRowKeys.length} dòng`}
                    </Button>
                    <Button className={selectedRowKeys.length!=0?'bg-red-500 text-white':''} 
                            icon={<DeleteOutlined />} 
                            disabled={selectedRowKeys.length==0}
                            onClick={onPatchDeleteStudent}>Xoá {selectedRowKeys.length!=0?selectedRowKeys.length + ' dòng':''}</Button>    
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>
                </Space>
            </Space>
            <StudentFeeTable selectedRowKeyCallback={selectedRowKeyCallback} 
                            setTotalEntry={(total) => setTotalEntry(total)}
                            filter={{class_list: classList, semester_list: semesterList, cohort_list: cohortList}}
                            reload={reloadToggle}/>
            
            <CreateStudent open={createModalOpen}
                        onCancel={() => setCreateModalOpen(false)}
                        reload={triggerReload}
                        selections={{semester_list: semesterList}} />
            <ImportModal open={importModalOpen} onCancel={() => setImportModalOpen(false)} reload={triggerReload} />
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </div>
    )
}

export default ManageFeeByStudent;