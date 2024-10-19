import {  Space, Button, Modal, Typography, Input, notification } from 'antd';
import {
    DeleteOutlined,
    ExclamationCircleFilled,
    PlusCircleOutlined,
    DownloadOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useStudentApi } from 'src/services/studentService';
import { useFilterApi } from 'src/services/filterService';
import dayjs from 'dayjs';
import CreateStudent from './CreateStudent';
import StudentTable from './StudentTable';
import exportExcelFromJson from 'src/utils/exportExcel';
import HideDropdown from '../../utils/HideDropdown';

function ManageStudent() {
    const [classList, setClassList] = useState([]);
    const [totalEntry, setTotalEntry] = useState(0);

    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading]  = useState(false);
    const [syncButtonLoading, setSyncButtonLoading]  = useState(false);

    const [hiddenColumns, setHiddenColumns] = useState([]);

    const [modal, contextHolder] = Modal.useModal();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const studentService = useStudentApi();

    const filterService = useFilterApi();

    useEffect(() => {
        const fetchClassData = async () => {
            console.log('Fetching classes!');
            const result = await filterService.getAllClass();
            let classMapped = result?.data?.student_class_ids.map((entry) => {
                console.log('Creating class selection!');
                return {
                    text: entry.class_name,
                    value: entry.id,
                    label: entry.class_name,
                };
            });
            setClassList(classMapped);
        };
        fetchClassData();
    }, []);

    const openNotification = (type, title, content='') => {
        notificationApi[type]({
            message: title,
            description: content
        })
    }

    const patchDeleteStudent = async () => {
        let body = {
            list_id: selectedRowKeys.map((entry) => Number(entry)),
        };
        const result = await studentService.patchDeleteStudent(body);
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
        setReloadToggle((prev) => !prev);
    };

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
        // Nếu không chọn dòng nào thì getAll để xuất toàn bộ
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await studentService.getAllStudent();
            allStudent = res?.data?.student_ids;
        }
        else{
            console.log("Export selected");
            allStudent = selectedRowRecords;
        }
        let cleanedStudent = allStudent.map((entry) => {
            let cleanData = {
                code: entry.student_code,
                name: entry.full_name,
                class: entry.student_class_id[1],
                gender: entry.sex=='male'?'Nam':'Nữ',
                dob: dayjs(entry.date_of_birth, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                phone: entry.phone_number?entry.phone_number:"",
                email: entry.email?entry.email:"",
                status: entry.status
            }
            return cleanData;
        })
        let cols = ['Mã sinh viên', 'Họ tên', 'Lớp', 'Giới tính', 'Ngày sinh', 'Số điện thoại', 'Email', 'Trạng thái'];
        exportExcelFromJson(cleanedStudent, cols, "Quản lý sinh viên.xlsx");
        setExportButtonLoading(false);
    }

    const syncStudent = async () => {
        setSyncButtonLoading(true);
        openNotification('info', 'Đang thực hiện đồng bộ danh sách sinh viên', 'Quá trình này có thể mất vài phút');
        let res = await studentService.crawlStudent();
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
        <div className='w-full'>
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý sinh viên</h1>
            <Space className="flex my-2 justify-between">
                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>
                        Thêm mới
                    </Button>
                    <Button type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportStudent}
                            loading={exportButtonLoading}
                    >
                            Xuất {selectedRowKeys.length==0?" toàn bộ": `${selectedRowKeys.length} dòng`}
                    </Button>
                    <Button
                        className={selectedRowKeys.length!=0?'bg-red-500 text-white':''} 
                        icon={<DeleteOutlined />}
                        disabled={selectedRowKeys.length == 0}
                        onClick={onPatchDeleteStudent}
                    >
                        Xoá {selectedRowKeys.length != 0 ? selectedRowKeys.length + ' dòng' : ''}
                    </Button>  
                    <Button type="primary" 
                            icon={<SyncOutlined />}
                            onClick={syncStudent}
                            loading={syncButtonLoading}
                    >
                            Đồng bộ
                    </Button>  
                    <HideDropdown onChange={onColumnVisibilityChange} columns={[
                        // {label:'Mã sinh viên', value:'student_code'},
                        // {label:'Họ tên', value:'full_name'},
                        // {label:'Lớp', value:'student_class_id'},
                        {label:'Giới tính', value:'sex'},
                        {label:'Ngày sinh', value:'date_of_birth'},
                        {label:'Số điện thoại', value:'phone_number'},
                        {label:'Email', value:'email'},
                        {label:'Địa chỉ thường trú', value:'dia_chi_tt'},
                        {label:'Họ và tên cha', value:'ho_va_ten_cha'},
                        {label:'Số điện thoại cha', value:'so_dien_thoai_cha'},
                        {label:'Họ và tên mẹ', value:'ho_va_ten_me'},
                        {label:'Số điện thoại mẹ', value:'so_dien_thoai_me'},
                        {label:'Trạng thái', value:'status'},
                        {label:'Thao tác', value:'actions'},
                    ]}/>
                </Space>
                <Space> 
                    <Space>
                        <Typography className='font-bold'>Tổng số: </Typography>
                        <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>    
                    </Space>
                </Space>
            </Space>
            <StudentTable selectedRowKeyCallback={selectedRowKeyCallback}
                        setTotalEntry={(total) => setTotalEntry(total)}
                        filter={{class_list: classList}}
                        hiddenColumns={hiddenColumns}
                        reload={reloadToggle}/>        
            <CreateStudent
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                reload={triggerReload}
                selections={{ class_list: classList }}
            />
            {
                contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */
            }
            {notificationContextHolder}
        </div>
    );
}

export default ManageStudent;
