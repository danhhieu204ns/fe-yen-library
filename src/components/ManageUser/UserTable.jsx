import { Table, Space, Button, Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PoweroffOutlined, KeyOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { useUserApi } from 'src/services/userService';
import EditUser from './EditUser';
import ShowInfo from './ShowInfo';
import { getColumnSearchProps} from 'src/utils/searchByApi';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function UserTable({
    selectedRowKeyCallback,
    setTotalEntry,
    filter,
    reload
}) {
    const [userList, setUserList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

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

    const userService = useUserApi();

    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender){
            console.log("Reload triggered");
            triggerReload();    
        }  
    }, [reload]);

    useEffect(() => {
        const fetchUserData = async () => {
            console.log("Fetching data by page!")
            const result = await userService.getAllUserByPage(currentPage, pageSize);
            setUserList(result?.data?.data);
            setTotalPages(result?.data?.total_pages);
            setTotalEntry(result?.data?.total_data);
        }

        if (!searchMode) fetchUserData();

    }, [reloadToggle, currentPage, pageSize, searchMode])

    useEffect(() => {
        const fetchFilteredUserData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await userService.searchUser(filterRequestBody, currentPage, pageSize);
            setUserList(res?.data?.data);
            setTotalEntry(res?.data?.total_data);
            setTotalPages(res?.data?.total_pages);
        }

        if (searchMode) fetchFilteredUserData(); // Chỉ chạy khi trong search mode
    }, [reloadToggle, currentPage, pageSize, searchMode, filterRequestBody])

    // If filter change => Search using those params
    useEffect(() => {
        const searchUsingFilter = async () => {
            console.log("Filter changed! Compiling request body")
            let body = {}
            let isFilter = false;
            if(currentFilters==null) return;
            Object.keys(currentFilters).forEach((field) => {
                if (currentFilters[field]){
                    isFilter = true;
                    body[field] = currentFilters[field];
                } 
            })
            if (isFilter){
                console.log("Filter exists. Enter search mode");
                setFilterRequestBody(body);
                setSearchMode(true);  
            }
            else resetSearch();    
        }
        searchUsingFilter();
    }, [JSON.stringify(currentFilters)])

    const deleteUser = async (id) => {
        const result = await userService.deleteUser(id);
    }

    const activeUser = async (id) => {
        const result = await userService.activateUser({id:id});
        return result;
    }

    const deactivateUser = async (id) => {
        const result = await userService.deactivateUser({id:id});
        return result;
    }
    /**@callback {resetPassword} */
    /**@param {string} */
    /**@returns {boolean} */
    const resetPassword = async (username) => {
        const result = await userService.resetPassword({username:username});
        return result;
    }

    const triggerReload = () => {
        setReloadToggle((prev) => !prev)
    }

    const showInfoModal = () => {
        if (selectedRowKeys.length==0) setInfoModalOpen(true); // Prevent accidental popup when mis-click selection
    }

    const onSelectedRowKeysChange = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        selectedRowKeyCallback(newSelectedRowsKey, newSelectedRowsRecord);
        console.log(newSelectedRowsRecord);
    }

    const resetSearch = () => {
        setSearchMode(false);
    };

    const onTableChange = async (pagination, filters, sorter, extra) => {
        console.log(filters);
        let cleanedFilters = filters;
        cleanedFilters.username = cleanedFilters.username?cleanedFilters.username[0]:null;
        cleanedFilters.full_name = cleanedFilters.full_name?cleanedFilters.full_name[0]:null;

        setCurrentFilters(cleanedFilters);
    }

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
            ...getColumnSearchProps("Username", "username"),
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: 'Họ tên',
            key: 'full_name',
            dataIndex: 'full_name',
            align: 'center',
            ...getColumnSearchProps('Họ tên', 'full_name'),
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
        },
        {
            title: 'Vai trò',
            key: 'role',
            dataIndex: 'role', // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
            align: 'center',
            filters: [
                {text: 'Admin', value: 'Admin'},
                {text: 'User', value: 'User'}
            ],
            sorter: (a, b) => a.role.localeCompare(b.role),
        },
        {
            title: 'Trạng thái',
            key: 'active_user',
            dataIndex: 'active_user', // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
            align: 'center',
            filters: [
                {text: 'Đang hoạt động', value: true},
                {text: 'Không hoạt động', value: false}
            ],
            sorter: (a, b) => a.active_user - b.active_user,
            render: (value) => value?'Đang hoạt động':'Không hoạt động'
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (record) => {
                return (
                    <Space>
                        <Tooltip title={record.active_user?'Khoá':'Kích hoạt'}>
                            <Button
                                shape="circle"
                                className={record.active_user?'bg-red-500 hover:bg-red-500':'bg-green-500'}
                                type='primary'
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    let config = {
                                        title: record.active_user?'Xác nhận khoá':'Xác nhận kích hoạt',
                                        icon: <ExclamationCircleFilled />,
                                        content: record.active_user?`Bạn có chắc muốn khoá tài khoản ${record.username}?`:`Bạn có chắc muốn kích hoạt tài khoản ${record.username}?`,
                                        onOk: async () => {
                                            let res;
                                            if (record.active_user){
                                                res = await deactivateUser(record.id);
                                            }
                                            else{
                                                res = await activeUser(record.id);
                                            }
                                            if (res){
                                                await modal.success({
                                                    title: record.active_user?'Khoá tài khoản thành công':'Kích hoạt tài khoản thành công', 
                                                    content: record.active_user?`Tài khoản ${record.username} đã bị khoá`:`Tài khoản ${record.username} đã được kích hoạt`,
                                                    onOk: () => {
                                                        triggerReload();
                                                    }
                                                });
                                            }
                                            else{
                                                await modal.error({
                                                    title: 'Thao tác thất bại',
                                                    content: record.active_user?'Khoá tài khoản thất bại. Vui lòng thử lại':'Kích hoạt tài khoản thất bại. Vui lòng thử lại'
                                                })
                                            }
                                        },
                                        onCancel() {},
                                    };
                                    await modal.confirm(config);
                                }}
                            >
                                <PoweroffOutlined color='#ffffff'/>
                            </Button>    
                        </Tooltip>
                        <Tooltip title="Đặt lại mật khẩu">
                            <Button
                                shape="circle"
                                className='bg-blue-500'
                                type='primary'
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    let config = {
                                        title: 'Xác nhận đặt lại',
                                        icon: <ExclamationCircleFilled />,
                                        content: `Bạn có chắc muốn đặt lại mật khẩu cho tài khoản ${record.username}?`,
                                        onOk: async () => {
                                            let res = await resetPassword(record.username);
                                            
                                            if (res){
                                                await modal.success({
                                                    title: 'Đặt lại mật khẩu thành công', 
                                                    content: `Mật khẩu của tài khoản ${record.username} đã được đặt lại thành công`,
                                                });
                                            }
                                            else{
                                                await modal.error({
                                                    title: 'Đặt lại mật khẩu thất bại',
                                                    content: 'Đặt lại mật khẩu cho tài khoản thất bại. Vui lòng thử lại'
                                                })
                                            }
                                        },
                                        onCancel() {},
                                    };
                                    await modal.confirm(config);
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
                                <EditOutlined className='text-slate-900 font-[300]'/>
                            </Button>    
                        </Tooltip>
                        <Tooltip title="Xoá">
                            <Button
                                shape="circle"
                                className='bg-red-500'
                                type='primary'
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    let config = {
                                        title: 'Xác nhận xoá',
                                        icon: <ExclamationCircleFilled />,
                                        content: `Bạn có chắc muốn xoá tài khoản ${record.username}?`,
                                        onOk() {
                                            deleteUser(record.id);
                                            triggerReload();
                                        },
                                        onCancel() {},
                                    };
                                    await modal.confirm(config);
                                }}
                            >
                                <DeleteOutlined style={{ color: '#ffffff' }} />
                            </Button>    
                        </Tooltip>
                    </Space>    
                )
            }
        }
    ]
    return (
        <>
            <Table  columns={columns}
                dataSource={userList}
                onChange={onTableChange}
                scroll={{
                    x:1300, // Not working
                }}
                pagination={{
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize); // Might have unintended side effects
                        console.log(totalPages);
                    },
                    pageSize: pageSize,
                    total: totalPages*pageSize,
                    showSizeChanger: true
                }}
                rowKey={(record) => record.id}
                onRow={(record, index) => {
                    return({
                        onClick: event => {
                            console.log(`${record.username} clicked`);
                            setInfoModalRecord(record);
                            showInfoModal();
                        }
                    })
                }}    
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectedRowKeysChange,
                }}
            />
            <EditUser open={editModalOpen} 
                        onCancel={() => setEditModalOpen(false)} 
                        reload={triggerReload}
                        record={editModalRecord} />
            <ShowInfo open={infoModalOpen}
                    onCancel={() => setInfoModalOpen(false)}
                    record={infoModalRecord} />
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </>
    )
}

export default UserTable;