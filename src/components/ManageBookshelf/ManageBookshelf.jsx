import { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Table, Tooltip, Modal, Space, Input, Flex } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, EyeOutlined, UploadOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import useBookshelfApi from 'src/services/bookshelfService';
import CreateBookshelf from './CreateBookshelf'; 
import EditBookshelf from './EditBookshelf';
import ShowInfoBookshelf from './ShowInfoBookshelf'; 
import ImportBookshelf from './ImportBookshelf';

function ManageBookshelf() {
    const { getBookshelfByPage, deleteBookshelf, deleteListBookshelf, importBookshelf, exportBookshelf } = useBookshelfApi();
    const [listBookshelfToDelete, setListBookshelfToDelete] = useState([]);
    const [bookshelfInfo, setBookshelfInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const [filteredBookshelfs, setFilteredBookshelfs] = useState([]); // Dữ liệu sau khi lọc
    const [selectedFile, setSelectedFile] = useState(null);
    const searchInput = useRef(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setTableLoading(true);
            try {
                const response = await getBookshelfByPage(page, pageSize);
                if (response?.bookshelfs) {
                    setFilteredBookshelfs(response.bookshelfs);
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
        setBookshelfInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setBookshelfInfo({});
    }, []);

    const handleCloseImportModal = useCallback(() => {
        setImportModalOpen(false);
    }, []);

    const handleDelete = async (id) => {
        setDeleteLoading(true);
        try {
            const response = await deleteBookshelf(id);
            if (response?.message) {
                toast.success('Xóa thành công');
                handleReload();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xóa thất bại');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteListBookshelf = async () => {
        setDeleteLoading(true);
        try {
            const response = await deleteListBookshelf(listBookshelfToDelete);
            if (response?.message) {
                toast.success('Xóa thành công');
                setListBookshelfToDelete([]);
                handleReload();
            } else {
                toast.error('Xóa thất bại');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xóa thất bại');
        } finally {
            setDeleteLoading(false);
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

        setImportLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await importBookshelf(formData);
            
            if (response?.status === 200 || response?.status === 201) {
                toast.success('Import dữ liệu thành công!');
                setSelectedFile(null);
                handleCloseImportModal();
                handleReload();
            } else {
                // Format error messages from array of objects
                let errorMessages = [];
                
                if (Array.isArray(response?.data.errors)) {
                    errorMessages = response.data.errors.map(error => {
                        if (typeof error === 'object') {
                            return `Dòng ${error.Line}: ${error.Error}`;
                        }
                        return error;
                    });
                } else if (response?.message) {
                    errorMessages = [response.message];
                } else if (response?.data?.message) {
                    errorMessages = [response.data.message];
                } else {
                    errorMessages = ['Import dữ liệu thất bại!'];
                }

                Modal.error({
                    title: 'Lỗi Import',
                    content: (
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {errorMessages.map((message, index) => (
                                <div key={index} className="py-1">
                                    {message}
                                </div>
                            ))}
                        </div>
                    ),
                    width: 600,
                });
            }
        } catch (error) {
            console.error('Import error:', error);
            Modal.error({
                title: 'Lỗi Import',
                content: 'Import dữ liệu thất bại!',
                width: 600,
            });
        } finally {
            setImportLoading(false);
        }
    };

    const handleOpenImport = () => {
        setImportModalOpen(true);
    };

    const handleExport = async () => {
        modalDelete.confirm({
            title: 'Xác nhận export',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn export danh sách kệ sách?',
            onOk: async () => {
                setExportLoading(true);
                try {
                    const response = await exportBookshelf();
                    
                    if (response?.status === 200) {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'bookshelfs.xlsx');
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
                    setExportLoading(false);
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
            title: 'Tên kệ sách',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            ...getColumnSearchProps('status'),
            render: (text) => text || 'Chưa rõ tình trạng'
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
                                setBookshelfInfo(record);
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
                                setBookshelfInfo(record);
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
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Kệ sách</h1>
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
                        loading={importLoading}
                    >
                        Import
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        className="bg-blue-500"
                        onClick={handleExport}
                        loading={exportLoading}
                    >
                        Export
                    </Button>
                    <Button
                        type="primary"
                        className="bg-red-500"
                        disabled={listBookshelfToDelete.length === 0}
                        loading={deleteLoading}
                        onClick={() => {
                            modalDelete.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xóa ${listBookshelfToDelete.length} kệ sách đã chọn?`,
                                onOk() {
                                    handleDeleteListBookshelf();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {listBookshelfToDelete.length !== 0 ? listBookshelfToDelete.length + ' kệ sách' : ''}
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
                    loading={tableLoading}
                    columns={columns}
                    dataSource={filteredBookshelfs}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listBookshelfToDelete,
                        onChange: (selectedRowKeys) => {
                            setListBookshelfToDelete(selectedRowKeys);
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
                    onChange={(pagination, filters, sorter) => {
                        if (sorter) {
                            const { field, order } = sorter;
                            // Client-side sorting is handled by the sorter functions in columns
                        }
                    }}
                />
            </div>

            <CreateBookshelf
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditBookshelf
                data={bookshelfInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoBookshelf
                data={bookshelfInfo}
                openModal={showInfoModal}
                closeModal={handleCloseShowInfoModal}
            />

            <ImportBookshelf
                openModal={importModalOpen}
                closeModal={handleCloseImportModal}
                onFileChange={handleFileChange}
                onImport={handleImport}
                selectedFile={selectedFile}
                loading={importLoading}
            />

            {contextHolder}
        </div>
    );
}

export default ManageBookshelf;
