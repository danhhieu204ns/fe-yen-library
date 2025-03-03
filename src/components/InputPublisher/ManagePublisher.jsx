import { useState, useEffect, useCallback } from 'react';
import { Modal, Space, Table, Tooltip, Button, Typography, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, EyeOutlined, UploadOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import useManagePublisherApi from 'src/services/managePublisherService';
import CreatePublisher from './CreatePublisher';
import ShowInfoPublisher from './ShowInfoPublisher';
import EditPublisher from './EditPublisher';
import ImportPublisherModal from './ImportPublisherModal';
import ErrorModal from 'src/components/common/ErrorModal';
import { getColumnSearchProps } from 'src/utils/searchByApi.jsx';

function ManagePublisher() {
    const [publisherList, setPublisherList] = useState([]);
    const [publisherInfo, setPublisherInfo] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    // Add loading states
    const [tableLoading, setTableLoading] = useState(false);
    const [deleteListLoading, setDeleteListLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const [searchMode, setSearchMode] = useState(false);
    const [filterRequestBody, setFilterRequestBody] = useState({});

    const { publisherData, deletePublisher, deleteListPublisher, importPublisher, exportPublishers, searchPublisher } = useManagePublisherApi();

    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        const fetchData = async () => {
            setTableLoading(true);
            try {
                const results = await publisherData(page, pageSize);
                setPublisherList(results?.publishers || []);
                setTotalData(results?.total_data || 0);
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu');
                console.error('Fetch error:', error);
            } finally {
                setTableLoading(false);
            }
        };
        if (!searchMode) fetchData();
    }, [page, pageSize, reloadToggle, searchMode]);

    useEffect(() => {
        const fetchFilteredData = async () => {
            if (!filterRequestBody) return;
            
            setTableLoading(true);
            try {
                const res = await searchPublisher(filterRequestBody, page, pageSize);
                if (res?.publishers) {
                    setPublisherList(res.publishers);
                    setTotalData(res.total_data);
                } else {
                    message.error('Lỗi tìm kiếm');
                    resetSearch();
                }
            } catch (error) {
                message.error('Lỗi tìm kiếm');
                resetSearch();
            } finally {
                setTableLoading(false);
            }
        }

        if (searchMode) fetchFilteredData();
    }, [page, pageSize, searchMode, filterRequestBody]);

    const resetSearch = () => {
        setSearchMode(false);
        setFilterRequestBody({});
    };

    const onTableChange = (filters) => {
        const searchBody = {};
        // Handle filters properly regardless of whether they're null or array
        Object.entries(filters).forEach(([key, value]) => {
            // For array values (like phone_number)
            if (Array.isArray(value) && value.length > 0 && value[0]) {
                searchBody[key] = value[0].trim();
            }
            // For direct values that might come as strings
            else if (value && typeof value === 'string') {
                searchBody[key] = value.trim();
            }
        });

        if (Object.keys(searchBody).length > 0) {
            setSearchMode(true);
            setFilterRequestBody(searchBody);
        } else {
            resetSearch();
        }
    };

    const columns = [
        {
            title: 'Tên nhà xuất bản',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            ...getColumnSearchProps('tên nhà xuất bản', 'name'),
            sorter: (a, b) => a.name.localeCompare(b.name),

        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
            width: '25%',
            align: 'center',
            ...getColumnSearchProps('số điện thoại', 'phone_number'),
            filterSearch: true, 
            render: (text) => (
                <div style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {text || 'Chưa có số điện thoại'}
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            ...getColumnSearchProps('email', 'email'),
            render: (text) => (
                <div style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {text || 'Chưa có email'}
                </div>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
            ...getColumnSearchProps('địa chỉ', 'address'),
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
                                setPublisherInfo(record);
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
                                setPublisherInfo(record);
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
                                modal.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa nhà xuất bản: ${record?.name}?`,
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
        }
    ];

    const handleDelete = async (record) => {
        try {
            const result = await deletePublisher(record.id);
            if (result) {
                message.success(`Đã xóa nhà xuất bản: ${record.name}`);
                setReloadToggle(!reloadToggle);
            } else {
                message.error(`Xóa thất bại: ${record.name}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Đã có lỗi xảy ra khi xóa');
        }
    };

    const handleDeleteList = async () => {
        setDeleteListLoading(true);
        try {
            const result = await deleteListPublisher(selectedRows);
            if (result) {
                message.success(`Đã xóa ${selectedRows.length} nhà xuất bản`);
                setSelectedRows([]);
                setReloadToggle(!reloadToggle);
            } else {
                message.error('Xóa thất bại');
            }
        } catch (error) {
            console.error('Delete list error:', error);
            message.error('Đã có lỗi xảy ra khi xóa');
        } finally {
            setDeleteListLoading(false);
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            message.error('Vui lòng chọn file để import!');
            return;
        }
        setImportLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await importPublisher(formData);
            
            if (response?.errors && response.errors.length > 0) {
                const errorMessages = response.errors.map(error => `Dòng ${error.Dòng}: ${error.Lỗi}`);
                setErrorMessages(errorMessages);
                setErrorModalOpen(true);
                return;
            }

            message.success(`Import thành công ${selectedFile.name}`);
            setReloadToggle(!reloadToggle);
            setImportModalOpen(false);
            setSelectedFile(null);
        } catch (error) {
            console.error('Import error:', error);
            message.error(`${selectedFile.name} file upload failed.`);
        } finally {
            setImportLoading(false);
        }
    };

    const handleExport = async () => {
        modal.confirm({
            title: 'Xác nhận xuất file',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn xuất danh sách nhà xuất bản?',
            okText: 'Xuất file',
            cancelText: 'Hủy',
            onOk: async () => {
                setExportLoading(true);
                try {
                    const response = await exportPublishers();
                    if (response) {
                        const currentDate = new Date().toISOString().split('T')[0];
                        const blob = new Blob([response], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });
                        
                        if (blob.size === 0) {
                            message.error('File xuất ra rỗng');
                            return;
                        }

                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `publishers_${currentDate}.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode.removeChild(link);
                        window.URL.revokeObjectURL(url);
                        message.success('Xuất file thành công');
                    }
                } catch (error) {
                    console.error('Export error:', error);
                    message.error('Xuất file thất bại');
                } finally {
                    setExportLoading(false);
                }
            }
        });
    };

    return (
        <div className='py-20 px-4'>
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Nhà Xuất Bản</h1>
            <Space className="flex my-2 justify-between">
                <Space>
                    <Button 
                        type="primary" 
                        icon={<PlusCircleOutlined />} 
                        onClick={() => setCreateModalOpen(true)}
                    >
                        Thêm mới
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<UploadOutlined />} 
                        className="bg-green-500 text-white" 
                        onClick={() => setImportModalOpen(true)}
                        loading={importLoading}
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
                        disabled={selectedRows.length === 0}
                        loading={deleteListLoading}
                        onClick={() => {
                            modal.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xoá ${selectedRows.length} nhà xuất bản đã chọn?`,
                                onOk() {
                                    handleDeleteList();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {selectedRows.length !== 0 ? selectedRows.length + ' nhà xuất bản' : ''}
                    </Button>
                </Space>
                <Space>
                    <Typography.Text className='font-bold'>Tổng số: </Typography.Text>
                    <Input 
                        disabled 
                        className='disabled:bg-white disabled:text-red-500 font-bold w-16' 
                        value={totalData}
                    />    
                </Space>
            </Space>

            <Table
                columns={columns}
                dataSource={publisherList}
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
                loading={tableLoading}
            />

            <CreatePublisher
                openModal={createModalOpen}
                closeModal={() => setCreateModalOpen(false)}
                handleReload={() => setReloadToggle(!reloadToggle)}
            />

            <EditPublisher
                data={publisherInfo}
                openModal={editModalOpen}
                closeModal={() => {
                    setEditModalOpen(false);
                    setPublisherInfo({});
                }}
                handleReload={() => setReloadToggle(!reloadToggle)}
            />

            <ShowInfoPublisher 
                data={publisherInfo} 
                openModal={showInfoModal} 
                closeModal={() => {
                    setShowInfoModal(false);
                    setPublisherInfo({});
                }}
            />

            <ImportPublisherModal
                open={importModalOpen}
                onClose={() => {
                    setImportModalOpen(false);
                    setSelectedFile(null);
                }}
                onFileChange={setSelectedFile}
                onImport={handleImport}
                selectedFile={selectedFile}
                loading={importLoading}
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

export default ManagePublisher;