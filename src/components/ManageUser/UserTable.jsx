import { Table, Space, Button, Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PoweroffOutlined, KeyOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useUserApi } from 'src/services/userService';
import { getColumnSearchProps } from 'src/utils/searchByApi';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';
import EditUser from './EditUser';
import ShowInfo from './ShowInfo';

function UserTable({
    selectedRowKeyCallback,
    setTotalEntry,
    filter,
    reload
}) {
    const [userList, setUserList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalRecord, setEditModalRecord] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoModalRecord, setInfoModalRecord] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [currentFilters, setCurrentFilters] = useState();
    const [filterRequestBody, setFilterRequestBody] = useState();
    const [searchMode, setSearchMode] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const { getAllUserByPage, resetPassword, activateUser, deactivateUser, deleteUser } = useUserApi();
    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender) {
            triggerReload();    
        }  
    }, [reload]);

    useEffect(() => {
        const fetchUserData = async () => {
            const result = await getAllUserByPage(currentPage, pageSize);
            setUserList(result?.users);

            setTotalPages(result?.total_pages);
            setTotalEntry(result?.total_data);
        }

        if (!searchMode) fetchUserData();

    }, [reloadToggle, currentPage, pageSize, searchMode]);
    useEffect(() => {
        const fetchFilteredUserData = async () => {
            const res = await userService.searchUser(filterRequestBody, currentPage, pageSize);
            setUserList(res?.data);
            setTotalEntry(res?.data?.total_data);
            setTotalPages(res?.data?.total_pages);
        }

        if (searchMode) fetchFilteredUserData();
    }, [reloadToggle, currentPage, pageSize, searchMode, filterRequestBody]);

    useEffect(() => {
        const searchUsingFilter = async () => {
            if (!currentFilters) return;
            const body = Object.keys(currentFilters).reduce((acc, field) => {
                if (currentFilters[field]) {
                    acc[field] = currentFilters[field];
                }
                return acc;
            }, {});
            if (Object.keys(body).length) {
                setFilterRequestBody(body);
                setSearchMode(true);  
            } else resetSearch();    
        }
        searchUsingFilter();
    }, [JSON.stringify(currentFilters)]);

    const deleteUserInfo = async (id) => {
        await deleteUser(id);
        triggerReload();
    }

    const toggleUserStatus = async (record) => {
        const action = record.status ? deactivateUser : activateUser;
        const confirmationMessage = record.status 
            ? `Bạn có chắc muốn khoá tài khoản "${record.user_auth.username}"?` 
            : `Bạn có chắc muốn kích hoạt tài khoản "${record.user_auth.username}"?`;

        const result = await modal.confirm({
            title: record.status ? 'Xác nhận khoá' : 'Xác nhận kích hoạt',
            icon: <ExclamationCircleFilled />,
            content: confirmationMessage,
            onOk: async () => {
                await action(record.id);
                triggerReload();
            },
        });
    };

    const resetPwd = async (username) => {
        const result = await resetPassword({ username });
        return result;
    }

    const triggerReload = () => {
        setReloadToggle(prev => !prev);
    }

    const showInfoModal = () => {
        if (selectedRowKeys.length === 0) setInfoModalOpen(true);
    }

    const closeInfoModal = () => {
        setInfoModalOpen(false);
    };

    const onSelectedRowKeysChange = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        selectedRowKeyCallback(newSelectedRowsKey, newSelectedRowsRecord);
    }

    const resetSearch = () => {
        setSearchMode(false);
    };

    const onTableChange = (pagination, filters) => {
        const cleanedFilters = {
            username: filters.username?.[0] || null,
            full_name: filters.full_name?.[0] || null,
        };
        setCurrentFilters(cleanedFilters);
    }

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: ['user_auth', 'username'],  // Nested field for username
            key: 'user_auth.username',
            align: 'center',
            ...getColumnSearchProps("Username", "username"),
            sorter: (a, b) => a.user_auth.username.localeCompare(b.user_auth.username),
        },
        {
            title: 'Họ tên',
            key: 'name',
            dataIndex: 'name',  // Direct field for full name
            align: 'center',
            ...getColumnSearchProps('Họ tên', 'name'),  // Use 'name' for full name search
            sorter: (a, b) => a.name.localeCompare(b.name),  // Sort based on name
        },
        {
            title: 'Số điện thoại',
            key: 'phone_number',
            dataIndex: 'phone_number',
            align: 'center',
            ...getColumnSearchProps('Số điện thoại', 'phone_number'), 
        },
        {
            title: 'Địa chỉ',
            key: 'address',
            dataIndex: 'address',
            align: 'center',
            ...getColumnSearchProps('Địa chỉ', 'address'), 
        },
        {
            title: 'Vai trò',
            dataIndex: ['role', 'name'],  // Nested field for role name
            key: 'role',
            align: 'center',
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'User', value: 'user' }
            ],
            onFilter: (value, record) => record.role.name === value,  // Filter based on nested role name
            sorter: (a, b) => a.role.name.localeCompare(b.role.name),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            filters: [
                { text: 'Đang hoạt động', value: true },
                { text: 'Không hoạt động', value: false }
            ],
            onFilter: (value, record) => record.status === value,  // Filter by active status
            sorter: (a, b) => a.status - b.status,  // Sort by active status
            render: value => (value ? 'Đang hoạt động' : 'Không hoạt động')  // Display active status
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (record) => (
                <Space>
                    <Tooltip title={record.status ? 'Khoá' : 'Kích hoạt'}>
                        <Button
                            shape="circle"
                            className={record.status ? 'bg-red-500 hover:bg-red-500' : 'bg-green-500'}
                            type='primary'
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleUserStatus(record);
                            }}
                        >
                            <PoweroffOutlined style={{ color: '#ffffff' }} />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Đặt lại mật khẩu">
                        <Button
                            shape="circle"
                            className='bg-blue-500'
                            type='primary'
                            onClick={async (e) => {
                                e.stopPropagation();
                                const confirmationMessage = `Bạn có chắc muốn đặt lại mật khẩu cho tài khoản ${record.user_auth.username}?`;
                                await modal.confirm({
                                    title: 'Xác nhận đặt lại',
                                    icon: <ExclamationCircleFilled />,
                                    content: confirmationMessage,
                                    onOk: async () => {
                                        await resetPwd(record.user_auth.username);
                                        triggerReload();
                                    },
                                });
                            }}
                        >
                            <KeyOutlined />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            shape="circle"
                            className='bg-yellow-300'
                            type='primary'
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditModalRecord(record);
                                setEditModalOpen(true);
                            }}
                        >
                            <EditOutlined className='text-slate-900 font-[300]' />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button
                            shape="circle"
                            className='bg-red-500'
                            type='primary'
                            onClick={async (e) => {
                                e.stopPropagation();
                                const confirmationMessage = `Bạn có chắc muốn xoá tài khoản ${record.user_auth.username}?`;
                                await modal.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: confirmationMessage,
                                    onOk: async () => {
                                        await deleteUser(record.id);
                                        triggerReload();
                                    },
                                });
                            }}
                        >
                            <DeleteOutlined style={{ color: '#ffffff' }} />
                        </Button>
                    </Tooltip>
                </Space>
            )
        }
    ];
    

    return (
        <>
            <Table
                columns={columns}
                dataSource={userList}
                onChange={onTableChange}
                scroll={{ x: 1300 }}
                pagination={{
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                    pageSize,
                    total: totalPages * pageSize,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} người dùng`
                }}
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectedRowKeysChange,
                }}
                onRow={(record) => ({
                    onClick: () => {
                        setInfoModalRecord(record);
                        setInfoModalOpen(true);
                    }
                })}
            />
            {contextHolder}
            <EditUser
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    triggerReload();
                }}
                record={editModalRecord}
            />
            <ShowInfo
                open={infoModalOpen}
                onClose={() => {
                    setInfoModalOpen(false);
                    triggerReload();
                }}
                record={infoModalRecord}
            />
        </>
    );
}

export default UserTable;
