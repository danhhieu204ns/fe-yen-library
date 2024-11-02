import { Space, Button, Modal, Typography, Input } from 'antd';
import {  DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { useUserApi } from 'src/services/userService';
import CreateUser from './CreateUser';
import UserTable from './UserTable';
import exportExcelFromJson from 'src/utils/exportExcel';
import ImportModal from './ImportModal';

function ManageUser(){
    const [totalEntry, setTotalEntry] = useState(0);

    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload
    
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);

    const [exportButtonLoading, setExportButtonLoading]  = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const userService = useUserApi();

    const patchDeleteUser = async () => {
        let body = {
            list_id: selectedRowKeys.map((entry) => Number(entry)),
        };
        const result = await userService.patchDeleteUser(body);
    };

    const onPatchDeleteUser = async () => {
        let config = {
            title: 'Xác nhận xoá',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc muốn xoá ${selectedRowKeys.length} dòng đã chọn?`,
            onOk() {
                patchDeleteUser();
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

    const exportUser = async () => {
        setExportButtonLoading(true);
        let allUser;
        if (selectedRowKeys.length==0){
            console.log("Export all");
            let res = await userService.getAllUser();
            allUser = res?.data?.data;
        }
        else{
            console.log("Export selected");
            allUser = selectedRowRecords
        }
        let cleanedUser = allUser.map((entry) => {
            let cleanData = {
                username: entry.username,
                name: entry.full_name,
                role: entry.role,
                active: entry.active_user?'Đang hoạt động':'Không hoạt động'
            }
            return cleanData;
        })
        let cols = ['Tên người dùng', 'Họ tên', 'Vai trò', 'Trạng thái'];
        exportExcelFromJson(cleanedUser, cols, "Quản lý người dùng.xlsx");
        setExportButtonLoading(false);
    }


    return (
        <div>
            <h1 className='flex justify-center text-xl font-semibold my-2'>Quản lý người dùng</h1>
            <Space className='flex my-2 justify-between'>
                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>Thêm mới</Button>
                    <Button type="primary" icon={<UploadOutlined />} onClick={() => setImportModalOpen(true)}>Nhập từ Excel</Button>
                    <Button type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportUser}
                            loading={exportButtonLoading}
                    >
                            Xuất {selectedRowKeys.length==0?" toàn bộ": `${selectedRowKeys.length} dòng`}
                    </Button>
                    <Button className={selectedRowKeys.length!=0?'bg-red-500 text-white':''} 
                            icon={<DeleteOutlined />} 
                            disabled={selectedRowKeys.length==0}
                            onClick={onPatchDeleteUser}
                    >
                        Xoá {selectedRowKeys.length!=0?selectedRowKeys.length + ' dòng':''}
                    </Button>    
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry}/>
                </Space>
            </Space>
            <UserTable selectedRowKeyCallback={selectedRowKeyCallback} 
                                setTotalEntry={(total) => setTotalEntry(total)}
                                reload={reloadToggle}/>
            <CreateUser open={createModalOpen}
                        onCancel={() => setCreateModalOpen(false)}
                        reload={triggerReload} />
            <ImportModal open={importModalOpen} onCancel={() => setImportModalOpen(false)} reload={triggerReload}/>
            
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </div>
    )
}

export default ManageUser;