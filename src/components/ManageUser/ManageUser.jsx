import { useEffect, useState, useCallback } from 'react';
import { Space, Button, Modal, Typography, Input, Table, Tooltip, message } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, EditOutlined, EyeOutlined, UploadOutlined, DownloadOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useUserApi } from 'src/services/userService';
import { useRoleApi } from 'src/services/roleService';
import { getColumnSearchProps } from 'src/utils/searchByApi';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import ShowInfoUser from './ShowInfoUser';
import ImportUserModal from './ImportUserModal';
import ErrorModal from 'src/components/common/ErrorModal';
import moment from 'moment';

function ManageUser() {
    const [userList, setUserList] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);
    
    const [currentFilters, setCurrentFilters] = useState({});
    const [searchMode, setSearchMode] = useState(false);
    const [filterRequestBody, setFilterRequestBody] = useState({});
    const [roleOptions, setRoleOptions] = useState([]);

    const [modal, contextHolder] = Modal.useModal();

    const { 
        getAllUserByPage, 
        deleteUser, 
        deleteListUsers, 
        importUser, 
        exportUser, 
        searchUser, 
        activateUser, 
        deactivateUser,
    } = useUserApi();

    const { getRoleNames } = useRoleApi();

    const handleReload = useCallback(() => {
        setReloadToggle(prev => !prev);
        setSelectedRows([]);
        if (searchMode) {
            setSearchMode(false);
            setFilterRequestBody({});
            setCurrentFilters({});
        }
    }, [searchMode]);

    const resetSearch = useCallback(async () => {
        setSearchMode(false);
        setFilterRequestBody({});
        setCurrentFilters({});
        
        // Reload all data when search is reset
        try {
            const results = await getAllUserByPage(page, pageSize);
            setUserList(results?.users || []);
            setTotalData(results?.total_data || 0);
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải dữ liệu!');
            setUserList([]);
            setTotalData(0);
        }
    }, [page, pageSize, getAllUserByPage]);

    const onTableChange = (pagination, filters, sorter) => {
        // Only process filters if they've actually changed
        if (JSON.stringify(filters) !== JSON.stringify(currentFilters)) {
            const filterBody = {};
            Object.keys(filters).forEach(key => {
                if (filters[key]?.length > 0) {
                    if (key === 'roles') {
                        // Convert role_id to number for API
                        filterBody.role_id = Number(filters[key][0]);
                    } else {
                        filterBody[key] = filters[key][0];
                    }
                }
            });

            if (Object.keys(filterBody).length > 0) {
                setSearchMode(true);
                setFilterRequestBody(filterBody);
                setCurrentFilters(filters);
            } else {
                resetSearch();
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await getAllUserByPage(page, pageSize);
                setUserList(results?.users || []);
                setTotalData(results?.total_data || 0);
            } catch (error) {
                message.error('Có lỗi xảy ra khi tải dữ liệu!');
                setUserList([]);
                setTotalData(0);
            }
        };
        if (!searchMode) fetchData();
    }, [page, pageSize, reloadToggle, searchMode]);

    useEffect(() => {
        const fetchFilteredData = async () => {
            if (!filterRequestBody || Object.keys(filterRequestBody).length === 0) return;
            
            try {
                console.log('Searching with filter:', filterRequestBody); // Debug log
                const res = await searchUser(filterRequestBody, page, pageSize);
                if (res?.users) {
                    setUserList(res.users);
                    setTotalData(res.total_data);
                } else {
                    message.error('Không tìm thấy kết quả phù hợp');
                    resetSearch();
                }
            } catch (error) {
                console.error('Search error:', error); // Debug log
                if (error.response?.status === 422) {
                    message.error('Dữ liệu tìm kiếm không hợp lệ');
                } else {
                    message.error('Lỗi tìm kiếm');
                }
                resetSearch();
            }
        };

        if (searchMode && Object.keys(filterRequestBody).length > 0) {
            fetchFilteredData();
        }
    }, [searchMode, page, pageSize, filterRequestBody]); // Add filterRequestBody back

    // Add useEffect to fetch roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const roles = await getRoleNames();
                if (Array.isArray(roles)) {
                    const options = roles.map(role => ({
                        label: role.name?.toUpperCase() || role.role_name?.toUpperCase(),
                        value: role.id?.toString()
                    }));
                    setRoleOptions(options);
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
                setRoleOptions([]); // Set empty array on error
            }
        };

        fetchRoles();
    }, []);

    const handleImport = async () => {
        try {
            if (!selectedFile) {
                message.error('Vui lòng chọn file để import');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await importUser(formData);
            
            if (response.message) {
                message.success('Import thành công!');
                setImportModalOpen(false);
                setSelectedFile(null);
                handleReload();
            } else {
                // Handle import errors
                if (Array.isArray(response.errors)) {
                    const formattedErrors = response.errors.map(error => 
                        `Dòng ${error.row}: ${error.message}`
                    );
                    setErrorMessages(formattedErrors);
                    setErrorModalOpen(true);
                } else {
                    message.error('Có lỗi không xác định khi import dữ liệu');
                }
                setImportModalOpen(false);
                setSelectedFile(null);
            }
        } catch (error) {
            console.error('Import error:', error);
            setErrorMessages(['Có lỗi xảy ra khi import dữ liệu']);
            setErrorModalOpen(true);
            setImportModalOpen(false);
            setSelectedFile(null);
        }
    };

    const handleExport = async () => {
        modal.confirm({
            title: 'Xác nhận xuất file',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn xuất danh sách người dùng?',
            onOk: async () => {
                try {
                    setExportLoading(true);
                    const response = await exportUser();
                    
                    if (response) {
                        const url = window.URL.createObjectURL(new Blob([response]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `users_${moment().format('DD-MM-YYYY')}.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        message.success('Xuất file thành công!');
                    }
                } catch (error) {
                    message.error('Có lỗi xảy ra khi xuất file!');
                } finally {
                    setExportLoading(false);
                }
            }
        });
    };

    const handleToggleActivation = async (userId, isActive) => {
        try {
            const success = isActive 
                ? await deactivateUser(userId)
                : await activateUser(userId);

            if (success) {
                message.success(`${isActive ? 'Khóa' : 'Kích hoạt'} tài khoản thành công!`);
                handleReload();
            } else {
                message.error(`${isActive ? 'Khóa' : 'Kích hoạt'} tài khoản thất bại!`);
            }
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        try {
            const success = await deleteUser(id);
            if (success) {
                message.success('Xóa người dùng thành công!');
                handleReload();
            } else {
                message.error('Xóa người dùng thất bại!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa người dùng!');
        }
    };

    const handleDeleteList = async () => {
        try {
            // Pass array of IDs directly
            const success = await deleteListUsers(selectedRows);
            if (success) {
                message.success('Xóa danh sách người dùng thành công!');
                handleReload();
            } else {
                message.error('Xóa danh sách người dùng thất bại!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Có lỗi xảy ra khi xóa danh sách người dùng!');
        }
    };

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Họ tên',
            dataIndex: 'full_name',
            key: 'full_name',
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
            ...getColumnSearchProps('full_name'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
            ...getColumnSearchProps('phone_number'),
            render: (text) => (
                <div style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {text || 'Chưa có SĐT'}
                </div>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
            render: (text) => (
                <div style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {text || 'Chưa có địa chỉ'}
                </div>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => {
                if (!roles || roles.length === 0) return 'N/A';
                return roles.map(role => (
                    <span 
                        key={role} 
                        className={`inline-block px-2 py-1 m-1 rounded-full text-xs
                            ${role.toLowerCase() === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'}`}
                    >
                        {role.toUpperCase()}
                    </span>
                ));
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <Space>
                    <Tooltip title="Xem">
                        <Button
                            shape="circle"
                            className="bg-blue-500"
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setUserInfo(record);
                                setShowInfoModal(true);
                            }}
                        >
                            <EyeOutlined className="text-white" />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            shape="circle"
                            className="bg-yellow-300"
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setUserInfo(record);
                                setEditModalOpen(true);
                            }}
                        >
                            <EditOutlined className="text-slate-900 font-[300]" />
                        </Button>
                    </Tooltip>
                    <Tooltip title={record.is_active ? "Khóa tài khoản" : "Kích hoạt tài khoản"}>
                        <Button
                            shape="circle"
                            className={record.is_active ? "bg-orange-500" : "bg-green-500"}
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                modal.confirm({
                                    title: record.is_active ? 'Xác nhận khóa' : 'Xác nhận kích hoạt',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn ${record.is_active ? 'khóa' : 'kích hoạt'} tài khoản của người dùng: ${record.full_name}?`,
                                    onOk() {
                                        handleToggleActivation(record.id, record.is_active);
                                    },
                                });
                            }}
                        >
                            {record.is_active ? <LockOutlined className="text-white" /> : <UnlockOutlined className="text-white" />}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            shape="circle"
                            className="bg-red-500"
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                modal.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa người dùng: ${record.full_name}?`,
                                    onOk() {
                                        handleDelete(record.id);
                                    },
                                });
                            }}
                        >
                            <DeleteOutlined className="text-white" />
                        </Button>
                    </Tooltip>
                </Space>
            ),
        }
    ];

    return (
        <div className='py-20 px-4'>
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Người dùng</h1>
            <Space className="flex my-2 justify-between">
                <Space>
                    <Button 
                        type="primary" 
                        icon={<PlusCircleOutlined />} 
                        onClick={() => setCreateModalOpen(true)}>
                        Thêm mới
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<UploadOutlined />} 
                        className="bg-green-500 text-white" 
                        onClick={() => setImportModalOpen(true)}>
                        Import
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<DownloadOutlined />} 
                        className="bg-blue-500 text-white"
                        onClick={handleExport}
                        loading={exportLoading}>
                        Export
                    </Button>
                    <Button
                        type="primary"
                        className="bg-red-500"
                        disabled={selectedRows.length === 0}
                        onClick={() => {
                            modal.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xoá ${selectedRows.length} người dùng đã chọn?`,
                                onOk() {
                                    handleDeleteList();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {selectedRows.length !== 0 ? selectedRows.length + ' người dùng' : ''}
                    </Button>
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input 
                        disabled 
                        className='disabled:bg-white disabled:text-red-500 font-bold w-16' 
                        value={totalData} 
                    />
                </Space>
            </Space>

            <Table
                columns={columns}
                dataSource={userList}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRows,
                    onChange: (selectedRowKeys) => {
                        setSelectedRows(selectedRowKeys);
                    },
                }}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: totalData,
                    onChange: (newPage, newPageSize) => {
                        setPage(newPage);
                        setPageSize(newPageSize);
                    },
                }}
                rowKey={(record) => record.id}
                onChange={onTableChange}
            />

            <CreateUser
                openModal={createModalOpen}
                closeModal={() => setCreateModalOpen(false)}
                handleReload={handleReload}
            />

            <EditUser
                data={userInfo}
                openModal={editModalOpen}
                closeModal={() => {
                    setEditModalOpen(false);
                    setUserInfo({});
                }}
                handleReload={handleReload}
            />

            <ShowInfoUser
                data={userInfo}
                openModal={showInfoModal}
                closeModal={() => {
                    setShowInfoModal(false);
                    setUserInfo({});
                }}
            />

            <ImportUserModal
                open={importModalOpen}
                onClose={() => {
                    setImportModalOpen(false);
                    setSelectedFile(null);
                }}
                onFileChange={setSelectedFile}
                onImport={handleImport}
                selectedFile={selectedFile}
            />

            <ErrorModal
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                errorMessages={errorMessages}
            />

            {contextHolder}
        </div>
    );
}

export default ManageUser;
