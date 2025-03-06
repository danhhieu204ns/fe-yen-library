import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Table, Tooltip, Modal, Space, Input, Flex } from 'antd';
import { 
    EditOutlined, 
    DeleteOutlined, 
    ExclamationCircleFilled, 
    PlusCircleOutlined, 
    SearchOutlined,
    UploadOutlined,
    DownloadOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import useManageBorrowApi from 'src/services/manageBorrowService';
import CreateBorrow from './CreateBorrow';
import EditBorrow from './EditBorrow';
import ShowInfoBorrow from './ShowInfoBorrow';
import Highlighter from 'react-highlight-words';

function ManageBorrow() {
    // Basic state declarations
    const [borrowList, setBorrowList] = useState([]);
    const [listBorrowToDelete, setListBorrowToDelete] = useState([]);
    const [borrowInfo, setBorrowInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    // Import/export states
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);

    // Search state
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    // API service
    const { borrowData, deleteBorrow, deleteListBorrow } = useManageBorrowApi();

    useEffect(() => {
        fetchData();
    }, [page, pageSize, reloadToggle]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const results = await borrowData(page, pageSize);
            setBorrowList(results?.borrows || []);
            setTotalData(results?.total_data || 0);
        } catch (error) {
            console.error("Error fetching borrow data:", error);
            toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    // Handle search input
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        confirm();
    };

    // Get column search props - similar to ManageAuthor
    const getColumnSearchProps = (dataIndex, nestedKey = null) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm ${nestedKey || dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
                    </Button>
                    <Button 
                        onClick={() => handleReset(clearFilters, confirm)} 
                        size="small" 
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => {
            if (nestedKey) {
                // Access nested property e.g., book_copy.book.name
                const keys = nestedKey.split('.');
                let currentObj = record;
                for (const key of keys) {
                    if (!currentObj) return false;
                    currentObj = currentObj[key];
                }
                
                return currentObj 
                    ? currentObj.toString().toLowerCase().includes(value.toLowerCase()) 
                    : false;
            }
            
            return record[dataIndex] 
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) 
                : false;
        },
        render: (text, record) => {
            // Get the actual text to display based on dataIndex or nested path
            let displayText = text;
            if (nestedKey) {
                const keys = nestedKey.split('.');
                let currentObj = record;
                for (const key of keys) {
                    if (!currentObj) {
                        displayText = '';
                        break;
                    }
                    currentObj = currentObj[key];
                }
                displayText = currentObj;
            }

            return searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={displayText ? displayText.toString() : ''}
                />
            ) : (
                displayText
            );
        }
    });

    // Basic handler functions
    const handleReload = () => {
        setReloadToggle(!reloadToggle);
    };

    // Modal event handlers
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

    // Delete handlers
    const handleDelete = async (id) => {
        try {
            const result = await deleteBorrow(id);
            if (result?.status >= 400) {
                toast.error('Xóa thất bại');
                return;
            }
            toast.success('Xóa thành công');
            handleReload();
        } catch (error) {
            console.error("Error deleting borrow:", error);
            toast.error('Xóa thất bại: ' + error.message);
        }
    };

    const handleDeleteListBorrow = async () => {
        try {
            const result = await deleteListBorrow(listBorrowToDelete);
            if (result?.status >= 400) {
                toast.error('Xóa thất bại');
                return;
            }
            toast.success('Xóa thành công');
            setListBorrowToDelete([]);
            handleReload();
        } catch (error) {
            console.error("Error deleting multiple borrows:", error);
            toast.error('Xóa thất bại: ' + error.message);
        }
    };

    // Import/Export handlers
    const handleImportClick = useCallback(() => {
        toast.info("Chức năng Import đang được phát triển");
    }, []);

    const handleExport = useCallback(() => {
        setExportLoading(true);
        setTimeout(() => {
            toast.info("Chức năng Export đang được phát triển");
            setExportLoading(false);
        }, 1000);
    }, []);

    const onTableChange = (pagination, filters, sorter) => {
        if (pagination.current !== page) {
            setPage(pagination.current);
        }
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Đang chờ':
                return 'bg-yellow-400 text-white px-2 py-1 rounded';
            case 'Đang mượn':
                return 'bg-blue-400 text-white px-2 py-1 rounded';
            case 'Đã trả':
                return 'bg-green-400 text-white px-2 py-1 rounded';
            case 'Đã quá hạn':
                return 'bg-red-400 text-white px-2 py-1 rounded';
            case 'Đã hủy':
                return 'bg-gray-400 text-white px-2 py-1 rounded';
            default:
                return '';
        }
    };

    // Define columns with search functionality and sorting
    const columns = [
        {
            title: 'Tên sách',
            dataIndex: 'book_copy',
            key: 'book',
            ...getColumnSearchProps('book_copy', 'book_copy.book.name'),
            sorter: (a, b) => {
                const nameA = a.book_copy?.book?.name || '';
                const nameB = b.book_copy?.book?.name || '';
                return nameA.localeCompare(nameB);
            },
            render: (bookCopy) => bookCopy?.book?.name || 'Không có tên sách',
        },
        {
            title: 'Người dùng',
            dataIndex: 'user',
            key: 'user',
            ...getColumnSearchProps('user', 'user.full_name'),
            sorter: (a, b) => {
                const nameA = a.user?.full_name || '';
                const nameB = b.user?.full_name || '';
                return nameA.localeCompare(nameB);
            },
            render: (user) => user?.full_name || 'Không có người dùng',
        },
        {
            title: 'Nhân viên',
            dataIndex: 'staff',
            key: 'staff',
            ...getColumnSearchProps('staff', 'staff.full_name'),
            sorter: (a, b) => {
                const nameA = a.staff?.full_name || '';
                const nameB = b.staff?.full_name || '';
                return nameA.localeCompare(nameB);
            },
            render: (staff) => staff?.full_name || 'Không có nhân viên',
        },
        {
            title: 'Thời hạn (ngày)',
            dataIndex: 'duration',
            key: 'duration',
            ...getColumnSearchProps('duration'),
            sorter: (a, b) => a.duration - b.duration,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Đang chờ xác nhận', value: 'Đang chờ xác nhận' },
                { text: 'Đang mượn', value: 'Đang mượn' },
                { text: 'Đã trả', value: 'Đã trả' },
                { text: 'Đã quá hạn', value: 'Đã quá hạn' },
                { text: 'Đã hủy', value: 'Đã hủy' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <span className={getStatusClass(status)}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setBorrowInfo(record);
                                setEditModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                modalDelete.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa thông tin mượn sách của người dùng: ${record.user?.full_name || record.user_id}`,
                                    onOk() {
                                        handleDelete(record.id);
                                    },
                                    onCancel() {},
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className='py-20 px-4'>
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Mượn - Trả sách</h1>
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
                        onClick={handleImportClick}
                    >
                        Import
                    </Button>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleExport}
                        loading={exportLoading}
                        className="bg-blue-500 text-white"
                    >
                        Export
                    </Button>
                    <Button
                        type="primary"
                        className="bg-red-500"
                        disabled={listBorrowToDelete.length === 0}
                        onClick={() => {
                            modalDelete.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xoá ${listBorrowToDelete.length} đơn mượn đã chọn?`,
                                onOk() {
                                    handleDeleteListBorrow();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {listBorrowToDelete.length !== 0 ? listBorrowToDelete.length + ' đơn mượn' : ''}
                    </Button>
                </Space>
                <div className="flex justify-between items-center">
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={handleReload}
                        className="mr-2"
                    >
                        Làm mới
                    </Button>
                    <Flex gap={6} justify="center" align="center">
                        <span style={{ fontWeight: 'bold' }}>Tổng số:</span>
                        <Input
                            style={{
                                width: '60px',
                                color: 'red',
                                fontWeight: 'bold',
                            }}
                            value={totalData}
                            readOnly
                            disabled
                        />
                    </Flex>
                </div>
            </Space>

            <div>
                <Table
                    columns={columns}
                    dataSource={borrowList}
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
                    }}
                    onChange={onTableChange}
                    onRow={(record) => ({
                        onClick: () => {
                            setBorrowInfo(record);
                            setShowInfoModal(true);
                        },
                    })}
                    loading={loading}
                    className="cursor-pointer"
                />
            </div>

            {/* Modal components */}
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
    );
}

export default ManageBorrow;
