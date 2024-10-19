import { Space, Button, Modal, Typography, Input } from 'antd';
import {  DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { useAbsentApi } from 'src/services/absentService';
import { useFilterApi } from 'src/services/filterService';
import CreateStudent from './CreateStudent';
import AbsentStudentTable from './AbsentStudentTable';
import exportExcelFromJson from 'src/utils/exportExcel';
import ImportModal from './ImportModal';
import HideDropdown from 'src/utils/HideDropdown';

function ManageAbsentByStudent(){
    const [subjectList, setSubjectList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [totalEntry, setTotalEntry] = useState(0);

    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload
    
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading]  = useState(false);

    const [hiddenColumns, setHiddenColumns] = useState([]);

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
        fetchClassData();
        fetchSubjectData();
        fetchSemesterData();
    }, [])

    const patchDeleteStudent = async () => {
        let body = {
            list_id: selectedRowKeys.map((entry) => Number(entry)),
        };
        const result = await absentService.patchDeleteAbsentStudent(body);
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
        setSelectedRowRecords(newSelectedRowsRecord)
        console.log(newSelectedRowsRecord);
    };

    const onColumnVisibilityChange = (checkedValues) => {
        console.log(checkedValues);
        setHiddenColumns(checkedValues);
    }

    const exportStudent = async () => {
        setExportButtonLoading(true);
        let allStudent;
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await absentService.getAllAbsentStudent();
            allStudent = res?.data?.student_absent_ids;
        }
        else{
            console.log("Export selected");
            allStudent = selectedRowRecords
        }
        let cleanedStudent = allStudent.map((entry) => {
            let cleanData = {
                code: entry.student_code,
                name: entry.full_name,
                className: entry.student_class_id[1],
                num_absent: entry.number_lesson_absent,
                date_absent: dayjs(entry.date_absent, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                subject: entry.subject_id[1],
                semester: entry.semester_id[1],
                reason: entry.reason?entry.reason:""
            }
            return cleanData;
        })
        let cols = ['Mã sinh viên', 'Họ tên', 'Lớp', 'Số tiết vắng', 'Ngày vắng', 'Môn học', 'Kỳ học', 'Lý do'];
        exportExcelFromJson(cleanedStudent, cols, "Quản lý sinh viên vắng.xlsx");
        setExportButtonLoading(false);
    }


    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Sinh viên vắng</h1>
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
                            onClick={onPatchDeleteStudent}
                    >
                        Xoá {selectedRowKeys.length!=0?selectedRowKeys.length + ' dòng':''}
                    </Button>    
                    <HideDropdown onChange={onColumnVisibilityChange} columns={[
                        {label: 'Mã sinh viên', value: 'student_code'},
                        {label: 'Họ tên', value: 'full_name'},
                        {label: 'Lớp', value: 'student_class_id'},
                        {label: 'Số tiết vắng', value: 'number_lesson_absent'},
                        {label: 'Ngày vắng', value: 'date_absent'},
                        {label: 'Môn học', value: 'subject_id'},
                        {label: 'Kỳ học', value: 'semester_id'},
                        {label: 'Lý do', value: 'reason'},
                        {label: 'Thao tác', value: 'actions'},
                    ]}/>
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>
                </Space>
            </Space>
            <AbsentStudentTable selectedRowKeyCallback={selectedRowKeyCallback} 
                                setTotalEntry={(total) => setTotalEntry(total)}
                                filter={{class_list: classList, subject_list: subjectList, semester_list: semesterList}}
                                hiddenColumns={hiddenColumns}
                                reload={reloadToggle}/>
            <CreateStudent open={createModalOpen}
                        onCancel={() => setCreateModalOpen(false)}
                        reload={triggerReload}
                        selections={{subject_list: subjectList, semester_list: semesterList}} />
            <ImportModal open={importModalOpen} onCancel={() => setImportModalOpen(false)} reload={triggerReload}/>
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </div>
    )
}

export default ManageAbsentByStudent;