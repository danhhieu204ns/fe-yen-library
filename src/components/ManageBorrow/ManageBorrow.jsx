import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Tooltip, Modal, Space, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageBorrowApi from 'src/services/manageBorrowService';
import { toast } from 'react-toastify';
import CreateBorrow from './CreateBorrow';
import EditBorrow from './EditBorrow';
import ShowInfoBorrow from './ShowInfoBorrow';


function ManageBorrow() {
    const [borrowList, setBorrowList] = useState([]);
    const [listBorrowToDelete, setListBorrowToDelete] = useState([]);
    const [borrowInfo, setBorrowInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const [filteredBorrows, setFilteredBorrowrs] = useState([]); // Dữ liệu sau khi lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('name'); // Mặc định lọc theo tên muon sach

    const { borrowData, deleteBorrow, deleteListBorrow } = useManageBorrowApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await borrowData(page, pageSize);
            setBorrowList(results?.borrows);
            setTotalData(results?.total_pages * pageSize);
        };
        fetchData();
    }, [page, pageSize, reloadToggle]);

    const handleReload = useCallback(() => {
        setReloadToggle(!reloadToggle);
    }, [reloadToggle]);

    const handleCloseCreateModal = useCallback(() => {
        setCreateModalOpen(false);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setEditModalOpen(false);
        setBorrowInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setBorrowInfo({});
    }, []);

    const handleDelete = async (id) => {
        const result = await deleteBorrow(id);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        handleReload();
    };

    const handleDeleteListBorrow = async () => {
        const result = await deleteListBorrow(listBorrowToDelete);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setListBorrowToDelete([]);
        handleReload();
    };

    useEffect(() => {
        const filterBorrows = () => {
            if (!searchTerm) {
                setFilteredBorrowrs(borrowList);
                return;
            }

            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = borrowList.filter((borrow) => {
                if (filterOption === 'name') {
                    return borrow.bookgroup.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'user') {
                    return borrow.user.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'staff') {
                    return borrow.staff.name?.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'duration') {
                    return String(borrow.duration) === lowercasedTerm;
                } else if (filterOption === 'status') {
                    return borrow.status.toLowerCase().includes(lowercasedTerm);
                }
                return false;
            });
            setFilteredBorrowrs(filtered);
        };

        filterBorrows();
    }, [searchTerm, filterOption, borrowList]);

    const columns = [
        {
            title: 'Tên sách',
            dataIndex: 'bookgroup',
            key: 'bookgroup',
            render: (bookgroup) => bookgroup?.name || 'Không có tên sách',
        },
        {
            title: 'Người dùng',
            dataIndex: 'user',
            key: 'user',
            render: (user) => user?.name || 'Không có người dùng',
        },
        {
            title: 'Nhân viên',
            dataIndex: 'staff',
            key: 'staff',
            render: (staff) => staff?.name || 'Không có nhân viên',
        },
        {
            title: 'Thời hạn (ngày)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div className="space-x-2">
                    <Tooltip title="Sửa">
                        <Button
                            shape="circle"
                            className="bg-yellow-300"
                            type="primary"
                            icon={<EditOutlined className="text-slate-900 font-[300]" />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setBorrowInfo(record);
                                setEditModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            shape="circle"
                            className="bg-red-500"
                            type="primary"
                            icon={<DeleteOutlined className="text-white" />}
                            onClick={(e) => {
                                e.stopPropagation();
                                modalDelete.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa thông tin mượn sách của người dùng: ${record.user_id}`,
                                    onOk() {
                                        handleDelete(record.id);
                                    },
                                    onCancel() {},
                                });
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <>
            <div style={{ padding: '20px' }}>
                <div className="flex justify-center">
                    <h1 className="text-2xl mt-[60px] mb-[10px]">Quản lý Mượn sách</h1>
                </div>
                <h2>Tìm kiếm Mượn sách</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Input
                    placeholder="Nhập từ khóa tìm kiếm..."
                    allowClear
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '400px', marginRight: '10px' }}
                />
                <label style={{ marginRight: '10px' }}>Lọc theo:</label>
                <Select
                    value={filterOption}
                    onChange={(value) => setFilterOption(value)}
                    style={{ width: '200px' }}
                >
                    <Option value="name">Tên Sách</Option>
                    <Option value="user">Tên Người dùng</Option>
                    <Option value="staff">Tên Nhân viên</Option>
                    <Option value="duration">Thời hạn</Option>
                    <Option value="status">Trạng thái</Option>
                </Select>
            </div>
                <Space className="mb-2">
                    <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                        <PlusCircleOutlined />
                        Tạo mới
                    </Button>
                    <Button
                        type="primary"
                        className="bg-red-500"
                        disabled={listBorrowToDelete.length === 0}
                        onClick={() => {
                            modalDelete.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xoá ${listBorrowToDelete.length} thông tin mượn sách đã chọn?`,
                                onOk() {
                                    handleDeleteListBorrow();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {listBorrowToDelete.length !== 0 ? listBorrowToDelete.length + ' thông tin' : ''}
                    </Button>
                </Space>
                <div>
                    <Table
                        columns={columns}
                        dataSource={filteredBorrows}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: listBorrowToDelete,
                            onChange: (selectedRowKeys) => {
                                setListBorrowToDelete(selectedRowKeys);
                            },
                        }}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: totalData,
                            onChange: (newPage, newPageSize) => {
                                setPage(newPage);
                                setPageSize(newPageSize);
                            },
                        }}
                        onRow={(record) => ({
                            onClick: () => {
                                setBorrowInfo(record);
                                setShowInfoModal(true);
                            },
                        })}
                    />
                </div>

                <CreateBorrow
                    openModal={createModalOpen}
                    closeModal={handleCloseCreateModal}
                    handleReload={handleReload}
                />

                <EditBorrow
                    data={borrowInfo}
                    openModal={editModalOpen}
                    closeModal={handleCloseEditModal}
                    handleReload={handleReload}
                />

                <ShowInfoBorrow
                    data={borrowInfo}
                    openModal={showInfoModal}
                    closeModal={handleCloseShowInfoModal}
                />

                {contextHolder}
            </div>
        </>
    );
}

export default ManageBorrow;
