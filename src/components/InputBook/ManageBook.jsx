import { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Table, Tooltip, Modal, Space, Input, Select, Flex, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, EyeOutlined, UploadOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useManageBookApi from '../../services/manageBookService';
import CreateBook from './CreateBook'; // Component tạo mới nhóm sách
import EditBook from './EditBook'; // Component sửa thông tin nhóm sách
import ShowInfoBook from './ShowInfoBook'; // Component hiển thị thông tin nhóm sách
import ImportBook from './ImportBook';

function ManageBook() {
    const { bookData, deleteBook, deleteListBooks, importBook, exportBooks } = useManageBookApi();
    const [listBookToDelete, setListBookToDelete] = useState([]);
    const [bookInfo, setBookInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const [filteredBooks, setFilteredBooks] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const searchInput = useRef(null);

    // Loading states
    const [tableLoading, setTableLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deletingMultiple, setDeletingMultiple] = useState(false);
    const [importingLoading, setImportingLoading] = useState(false);
    const [exportingLoading, setExportingLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setTableLoading(true);
            try {
                const response = await bookData(page, pageSize);
                if (response?.books) {
                    setFilteredBooks(response.books);
                    setTotalData(response.total_data);
                }
            } catch (error) {
                console.error('Error details:', error);
                toast.error('Lỗi khi tải danh sách sách');
            } finally {
                setTableLoading(false);
            }
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
        setBookInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setBookInfo({});
    }, []);

    const handleCloseImportModal = useCallback(() => {
        setImportModalOpen(false);
    }, []);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const response = await deleteBook(id);
            if (response?.status === 200 || response?.data?.status === 200) {
                toast.success('Xóa thành công');
                handleReload();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xóa thất bại');
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteListBook = async () => {
        setDeletingMultiple(true);
        try {
            const response = await deleteListBooks(listBookToDelete);
            if (response?.status === 200 || response?.data?.status === 200) {
                toast.success('Xóa thành công');
                setListBookToDelete([]);
                handleReload();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xóa thất bại');
        } finally {
            setDeletingMultiple(false);
        }
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            toast.error('Vui lòng chọn file để import!');
            return;
        }

        setImportingLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await importBook(formData);
            
            // Kiểm tra cả status và data.status
            if (response?.status === 200 || response?.status === 201 || response?.data?.status === 200) {
                toast.success('Import dữ liệu thành công!');
                setSelectedFile(null);
                handleCloseImportModal();
                handleReload();
            } else {
                // Log response để debug
                console.log('Import response:', response);
                toast.error(response?.data?.message || 'Import dữ liệu thất bại!');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error(error.response?.data?.message || 'Import dữ liệu thất bại!');
        } finally {
            setImportingLoading(false);
        }
    };

    const handleOpenImport = () => {
        setImportModalOpen(true);
    };

    const handleExport = async () => {
        modalDelete.confirm({
            title: 'Xác nhận export',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn export danh sách sách?',
            onOk: async () => {
                setExportingLoading(true);
                try {
                    const response = await exportBooks();
                    
                    if (response?.status === 200) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'books.xlsx');
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                        toast.success('Export dữ liệu thành công!');
                    } else {
                        toast.error('Export dữ liệu thất bại!');
                    }
                } catch (error) {
                    console.error('Export error:', error);
                    toast.error('Export dữ liệu thất bại!');
                } finally {
                    setExportingLoading(false);
                }
            },
            onCancel() {},
        });
    };

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setPage(1); // Reset về trang 1 khi search
    };

    const handleReset = (clearFilters, confirm, dataIndex) => {
        clearFilters();
        confirm();
        handleSearch('', confirm, dataIndex);
    };

    const getColumnSearchProps = (dataIndex, nestedField) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
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
                        onClick={() => handleReset(clearFilters, confirm, dataIndex)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Đặt lại
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            if (nestedField) {
                return record[dataIndex]?.[nestedField]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ?? false;
            }
            return record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '';
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: 'Tên sách',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => {
                const isRed = record.available_copies === 0;
                return (
                    <span style={{ 
                        backgroundColor: isRed ? 'red' : 'green', 
                        color: 'white',
                        padding: '3px 10px',
                        borderRadius: '8px'
                    }}>
                        {record.available_copies}/{record.total_copies}
                    </span>
                );
            },
        },
        {
            title: 'Tóm tắt',
            dataIndex: 'summary',
            key: 'summary',
            ...getColumnSearchProps('summary'),
            render: (text) => (
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {text || 'Chưa rõ nội dung'}
                </div>
            ),
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            sorter: (a, b) => (a.author?.name || '').localeCompare(b.author?.name || ''),
            ...getColumnSearchProps('author', 'name'),
            render: (author) => author?.name || 'Chưa rõ tác giả',
        },
        {
            title: 'Nhà xuất bản',
            dataIndex: 'publisher',
            key: 'publisher',
            sorter: (a, b) => (a.publisher?.name || '').localeCompare(b.publisher?.name || ''),
            ...getColumnSearchProps('publisher', 'name'),
            render: (publisher) => publisher?.name || 'Chưa rõ nhà xuất bản',
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => (a.category?.name || '').localeCompare(b.category?.name || ''),
            ...getColumnSearchProps('category', 'name'),
            render: (category) => category?.name || 'Chưa rõ thể loại',
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div className="space-x-2">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            shape="circle"
                            className="bg-blue-500"
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setBookInfo(record);
                                setShowInfoModal(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button
                            shape="circle"
                            className="bg-yellow-300"
                            type="primary"
                            icon={<EditOutlined className="text-slate-900 font-[300]" />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setBookInfo(record);
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
                            loading={deletingId === record.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                modalDelete.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa sách: ${record.name}`,
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
        <div className='py-20 px-4'>
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Sách</h1>
            <Space className="flex my-2 justify-between">
                <Space>
                    <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                        <PlusCircleOutlined />
                        Thêm mới
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<UploadOutlined />}
                        className="bg-green-500"
                        onClick={handleOpenImport}
                        loading={importingLoading}
                    >
                        Import
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        className="bg-blue-500"
                        onClick={handleExport}
                        loading={exportingLoading}
                    >
                        Export
                    </Button>
                    <Button
                        type="primary"
                        className="bg-red-500"
                        disabled={listBookToDelete.length === 0}
                        loading={deletingMultiple}
                        onClick={() => {
                            modalDelete.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xóa ${listBookToDelete.length} sách đã chọn?`,
                                onOk() {
                                    handleDeleteListBook();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {listBookToDelete.length !== 0 ? listBookToDelete.length + ' sách' : ''}
                    </Button>
                </Space>
                <div className="flex justify-between items-center">
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
                    loading={tableLoading}
                    dataSource={filteredBooks}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listBookToDelete,
                        onChange: (selectedRowKeys) => {
                            setListBookToDelete(selectedRowKeys);
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
                />
            </div>

            <CreateBook
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditBook
                data={bookInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoBook
                data={bookInfo}
                openModal={showInfoModal}
                closeModal={handleCloseShowInfoModal}
            />

            <ImportBook
                openModal={importModalOpen}
                closeModal={handleCloseImportModal}
                onFileChange={handleFileChange}
                onImport={handleImport}
                selectedFile={selectedFile}
                loading={importingLoading}
            />

            {contextHolder}
        </div>
    );
}

export default ManageBook;
