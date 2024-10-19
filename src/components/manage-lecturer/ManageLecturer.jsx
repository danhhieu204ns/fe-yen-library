import { Modal, Space, Table, Tooltip, Button, Typography, Input } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import useManageLecturerApi from 'src/services/manageLecturerService';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import CreateLecturer from './CreateLecturer';
import ShowInfoLecturer from './ShowInfoLecturer';
import EditLecturer from './EditLecturer';
import { getColumnSearchProps } from 'src/utils/searchByApi';

function ManageLecturer() {
    const [lecturerList, setLecturerList] = useState([]);
    const [lecturerInfo, setLecturerInfo] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [currentFilters, setCurrentFilters] = useState();
    const [searchMode, setSearchMode] = useState(false);
    const [filterRequestBody, setFilterRequestBody] = useState();

    const [modalDetele, contextHolder] = Modal.useModal();

    const { getAllLecturerByPage, deleteLecturer, deleteLecturerList, searchLecturer } = useManageLecturerApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await getAllLecturerByPage(page, pageSize);
            setLecturerList(results?.lecturer_ids);
            setTotalData(results?.total_data);
        };
        if (!searchMode) fetchData();
    }, [page, pageSize, reloadToggle, searchMode]);

    useEffect(() => {
        const fetchFilteredData = async () => {
            console.log(filterRequestBody);
            let res = await searchLecturer(filterRequestBody, page, pageSize);
            setLecturerList(res?.lecturer_info);
            setTotalData(res?.total_data);
        }

        if (searchMode) fetchFilteredData(); // Chỉ chạy khi trong search mode
    }, [reloadToggle, page, pageSize, searchMode, filterRequestBody]);

    // Chạy mỗi khi filter thay đổi
    useEffect(() => {
        const searchUsingFilter = async () => {
            console.log("Filter changed! Compiling request body")
            let body = {}
            let isFilter = false; // Check nếu tất cả các field mà null thì là đang không có filter
            if (currentFilters == null) return;
            Object.keys(currentFilters).forEach((field) => {
                if (currentFilters[field]) {
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
    }, [JSON.stringify(currentFilters)]); // Chuyển sang String để useEffect so sánh vì object ko so sánh đc

    const handleReload = useCallback(() => {
        setReloadToggle(!reloadToggle);
    }, [reloadToggle]);

    const handleCloseCreateModal = useCallback(() => {
        setCreateModalOpen(false);
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setLecturerInfo({});
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setEditModalOpen(false);
        setLecturerInfo({});
    }, []);

    const handleDelete = async (data) => {
        const result = await deleteLecturer(data.id);

        if (result) {
            handleReload();
            modalDetele.success({
                title: 'Xoá thành công',
                content: `Đã xoá giảng viên: ${data?.display_name}`,
            });
        } else {
            modalDetele.error({
                title: 'Xoá thất bại',
                content: `Xoá giảng viên: ${data?.display_name} không thành công`,
            });
        }
    };

    const handleDeleteList = async () => {
        const result = await deleteLecturerList(selectedRows);

        if (result) {
            handleReload();
            modalDetele.success({
                title: 'Xoá thành công',
                content: `Đã xoá ${selectedRows.length} giảng viên`,
            });
        } else {
            modalDetele.error({
                title: 'Xoá thất bại',
                content: `Xoá ${selectedRows.length} giảng viên không thành công`,
            });
        }
    };

    const resetSearch = () => {
        console.log("Exit search mode! Resetting");
        setSearchMode(false);
    };

    // Update khi filter thay đổi
    const onTableChange = async (pagination, filters, sorter, extra) => {
        console.log(filters);
        let cleanedFilters = filters;
        // Gỡ array với những field cần search
        cleanedFilters.lecturer_code = cleanedFilters.lecturer_code ? cleanedFilters.lecturer_code[0] : null;
        cleanedFilters.lecturer_name = cleanedFilters.lecturer_name ? cleanedFilters.lecturer_name[0] : null;
        setCurrentFilters(cleanedFilters);
    }

    const columns = [
        {
            title: 'Mã giảng viên',
            dataIndex: 'lecturer_code',
            key: 'lecturer_code',
            ...getColumnSearchProps('Mã giảng viên', 'lecturer_code'),
            render: (value) => (value ? value : ''),
        },
        {
            title: 'Tên giảng viên',
            dataIndex: 'lecturer_name',
            key: 'lecturer_name',
            ...getColumnSearchProps('Tên giảng viên', 'lecturer_name')
        },
        {
            title: 'Học hàm/Học vị',
            dataIndex: 'hoc_ham_hoc_vi',
            key: 'hoc_ham_hoc_vi',
            filters: [
                {text:'Cử nhân', value: 'Cử nhân'},
                {text:'Kỹ sư', value: 'Kỹ sư'},
                {text: 'Thạc sĩ', value: 'Thạc sĩ'},
                {text: 'Tiến sĩ', value: 'Tiến sĩ'},
                {text:'Phó giáo sư', value: 'Phó giáo sư'},
                {text: 'Giáo sư', value: 'Giáo sư'}
            ]
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'CH/TG',
            dataIndex: 'ch_tg',
            key: 'ch_tg',
            filters: [
                {text:'CH', value: 'CH'},
                {text: 'TG', value: 'TG'}
            ]
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button
                            shape="circle"
                            className="bg-yellow-300"
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLecturerInfo(record);
                                setEditModalOpen(true);
                            }}
                        >
                            <EditOutlined className="text-slate-900 font-[300]" />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            shape="circle"
                            className="bg-red-500"
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                modalDetele.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa giảng viên: ${record?.display_name}?`,
                                    onOk() {
                                        handleDelete(record);
                                    },
                                    onCancel() {},
                                });
                            }}
                        >
                            <DeleteOutlined className="text-white" />
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý giảng viên</h1>
            <Space className="flex my-2 justify-between">
                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>
                        Thêm mới
                    </Button>
                    {/* <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={exportStudent}
                        loading={exportButtonLoading}
                    >
                        Xuất {selectedRowKeys.length == 0 ? ' toàn bộ' : `${selectedRowKeys.length} dòng`}
                    </Button> */}

                    <Button
                        icon={<DeleteOutlined />}
                        disabled={selectedRows.length == 0}
                        onClick={() => {
                            modalDetele.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc chắn muốn xóa ${selectedRows.length} giảng viên đã chọn?`,
                                onOk() {
                                    handleDeleteList();
                                    setSelectedRows([]);
                                },
                                onCancel() {},
                            });
                        }}
                        type="primary"
                        className={selectedRows.length > 0 ? 'bg-red-500 text-white' : ''}
                    >
                        Xoá {selectedRows.length != 0 ? selectedRows.length + ' giảng viên' : ''}
                    </Button>    
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalData}/>    
                </Space>
                
            </Space>
            <Table
                columns={columns}
                dataSource={lecturerList}
                onChange={onTableChange}
                rowKey={(record) => record.id}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: totalData,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    },
                }}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRows,
                    onChange: (selectedRowKeys, selectedRows) => {
                        setSelectedRows(selectedRowKeys); // get Id of selected rows to delete
                    },
                }}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            setLecturerInfo(record);
                            setShowInfoModal(true);
                        },
                    };
                }}
            />

            <CreateLecturer
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditLecturer
                data={lecturerInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoLecturer data={lecturerInfo} openModal={showInfoModal} closeModal={handleCloseShowInfoModal} />

            {contextHolder}
        </div>
    );
}

export default ManageLecturer;
