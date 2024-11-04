import { Space, Button, Modal, Typography, Input } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useUserApi } from 'src/services/userService';
import CreateUser from './CreateUser';
import UserTable from './UserTable';

function ManageUser() {
    const [totalEntry, setTotalEntry] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecords, setSelectedRowRecords] = useState([]);
    const [modal, contextHolder] = Modal.useModal();
    const userService = useUserApi();

    const patchDeleteUser = async () => {
        let body = {
            list_id: selectedRowKeys.map((entry) => Number(entry)),
        };
        await userService.patchDeleteUser(body);
    };

    const onPatchDeleteUser = async () => {
        const config = {
            title: 'Xác nhận xoá',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc muốn xoá ${selectedRowKeys.length} dòng đã chọn?`,
            onOk() {
                patchDeleteUser();
                setSelectedRowKeys([]);
                setSelectedRowRecords([]);
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
        setSelectedRowRecords(newSelectedRowsRecord);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="flex justify-center">
                <h1 className="text-2xl mt-[60px] mb-[10px]">Quản lý Người dùng</h1>
            </div>
            <Space className='flex my-2 justify-between'>
                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>Thêm mới</Button>
                    <Button 
                        className={selectedRowKeys.length !== 0 ? 'bg-red-500 text-white' : ''} 
                        icon={<DeleteOutlined />} 
                        disabled={selectedRowKeys.length === 0}
                        onClick={onPatchDeleteUser}
                    >
                        Xoá {selectedRowKeys.length !== 0 ? selectedRowKeys.length + ' dòng' : ''}
                    </Button>    
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalEntry} />
                </Space>
            </Space>
            <UserTable 
                selectedRowKeyCallback={selectedRowKeyCallback} 
                setTotalEntry={(total) => setTotalEntry(total)}
                reload={reloadToggle}
            />
            <CreateUser 
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                reload={triggerReload} 
            />
            {contextHolder} {/* Modal hook context holder */}
        </div>
    );
}

export default ManageUser;
