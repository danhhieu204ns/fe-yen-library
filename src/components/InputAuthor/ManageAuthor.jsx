import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Tooltip, Modal, Space, Input, Select, Typography, Upload, Flex, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import useManageAuthorApi from 'src/services/manageAuthorService';
import CreateAuthor from './CreateAuthor';
import EditAuthor from './EditAuthor';
import ShowInfoAuthor from './ShowInfoAuthor';
import moment from 'moment';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import ErrorModal from 'src/components/common/ErrorModal';
import ImportAuthorModal from './ImportAuthorModal';

function ManageAuthor() {
    const [authorList, setAuthorList] = useState([]);
    const [authorInfo, setAuthorInfo] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const [listAuthorToDelete, setListAuthorToDelete] = useState([]);

    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [total, setTotal] = useState();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [exportLoading, setExportLoading] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const { authorData, deleteAuthor, deleteListAuthor, importAuthor, exportAuthors } = useManageAuthorApi();

    const [modal, contextHolder] = Modal.useModal(); // Keep only one modal instance

    const [filteredAuthors, setFilteredAuthors] = useState([]);  // Thêm state này
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleImportClick = () => {
        setImportModalOpen(true);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            message.error('Vui lòng chọn file để import!');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await importAuthor(formData);
            
            // Kiểm tra nếu có lỗi từ response
            if (response?.errors && response.errors.length > 0) {
                const errorMessages = response.errors.map(error => `Dòng ${error.Dòng}: ${error.Lỗi}`);
                setErrorMessages(errorMessages);
                setErrorModalOpen(true);
                return;
            }

            // Nếu không có lỗi, xử lý thành công
            message.success(`Import thành công ${selectedFile.name}`);
            // Reset về trang đầu tiên sau khi import
            setPage(1);
            // Fetch lại data với page và pageSize hiện tại
            const results = await authorData(1, pageSize);
            setAuthorList(results?.authors || []);
            setTotal(results?.total_data || 0);
            setTotalData(results?.total_pages * pageSize || 0);
            handleCloseImportModal();
        } catch (error) {
            console.error('Import error:', error);
            message.error(`${selectedFile.name} file upload failed.`);
        }
    };

    const handleFileChange = (file) => {
        if (file) {
            setSelectedFile(file);
        }
    };

    const fetchData = async () => {
        const results = await authorData(page, pageSize);
        setAuthorList(results?.authors || []);
        setTotal(results?.total_data || 0); // Sử dụng total_data từ API
        setTotalData(results?.total_pages * pageSize || 0);
    };

    useEffect(() => {
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
        setAuthorInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setAuthorInfo({});
    }, []);

    const handleCloseImportModal = useCallback(() => {
        setImportModalOpen(false);
        setSelectedFile(null);
    }, []);

    const handleDelete = async (id) => {
        const result = await deleteAuthor(id);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }
        toast.success('Xóa thành công');
        fetchData();
    };

    const handleDeleteListAuthor = async () => {
        try {
            const result = await deleteListAuthor(listAuthorToDelete);
            if (!result || result.status === false) {
                toast.error(result?.message || 'Xóa thất bại');
                return;
            }
            toast.success('Xóa thành công');
            setListAuthorToDelete([]);
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi xóa');
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);

        const searchValue = selectedKeys[0]?.toLowerCase();
        if (!searchValue) {
            setFilteredAuthors([]);
            return;
        }

        const filtered = authorList.filter(item => {
            const targetValue = item[dataIndex];
            if (!targetValue) return false;
            
            if (dataIndex === 'birthdate') {
                return moment(targetValue).format('DD/MM/YYYY').includes(searchValue);
            }
            return targetValue.toString().toLowerCase().includes(searchValue);
        });

        setFilteredAuthors(filtered);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        setFilteredAuthors([]);
        confirm();
    };

    const getColumnSearchProps = (placeholder, dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Tìm ${placeholder}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
                        Xóa
                    </Button>
                </div>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        filteredValue: searchedColumn === dataIndex ? [searchText] : null,
    });

    const columns = [
        {
            title: 'Tên tác giả',
            dataIndex: 'name',
            key: 'author',
            ...getColumnSearchProps('Tên tác giả', 'name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
            filterSearch: true,  // Thêm thuộc tính này để cho phép search trong filter
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthdate',
            sorter: (a, b) => new Date(a.birthdate) - new Date(b.birthdate),
            render: (text) => (text ? moment(text).format('DD/MM/YYYY') : 'Chưa xác định'),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('Địa chỉ', 'address'),
            sorter: (a, b) => (a.address || '').localeCompare(b.address || ''),  // Thêm null check
            filterSearch: true,
        },
        {
            title: 'Bút danh',
            dataIndex: 'pen_name',
            key: 'pen_name',
            ...getColumnSearchProps('Bút danh', 'pen_name'),
            filterSearch: true,
        },
        {
            title: 'Tiểu sử',
            dataIndex: 'biography',
            key: 'biography',
            render: (text) => (
                <div
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px', // Bạn có thể điều chỉnh độ rộng cột tại đây
                    }}
                >
                    {text || 'Chưa có tiểu sử'}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
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
                                setAuthorInfo(record);
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
                                setAuthorInfo(record);
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
                                    content: `Bạn có chắc chắn muốn xóa tác giả: ${record.name}?`,
                                    onOk() {
                                        handleDelete(record.id);
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

    // Thêm hàm xử lý onChange cho Table để handle search
    const handleTableChange = (pagination, filters, sorter) => {
        // Cập nhật page và pageSize
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleExport = async () => {
        modal.confirm({
            title: 'Xác nhận xuất file',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn xuất danh sách tác giả?',
            okText: 'Xuất file',
            cancelText: 'Hủy',
            onOk: async () => {
                setExportLoading(true);
                try {
                    const response = await exportAuthors();
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
                        link.setAttribute('download', `authors_${currentDate}.xlsx`);
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
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Tác giả</h1>
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
                        disabled={listAuthorToDelete.length === 0}
                        onClick={() => {
                            modal.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xoá ${listAuthorToDelete.length} tác giả đã chọn?`,
                                onOk() {
                                    handleDeleteListAuthor();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {listAuthorToDelete.length !== 0 ? listAuthorToDelete.length + ' tác giả' : ''}
                    </Button>
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={total}/>    
                </Space>
            </Space>
            <div>
                <Table
                    columns={columns}
                    dataSource={filteredAuthors.length > 0 ? filteredAuthors : authorList}  // Change from filteredAuthors to authorList
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listAuthorToDelete,
                        onChange: (selectedRowKeys) => {
                            setListAuthorToDelete(selectedRowKeys);
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
                        showTotal: () => (
                            <span style={{ margin: '0 8px' }}>
                                Trang {page} / {Math.ceil(totalData/pageSize)}
                            </span>
                        ),
                        style: { marginBottom: 0 },
                    }}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                // Removed show modal on row click
                            },
                        };
                    }}
                    onChange={handleTableChange}
                />
            </div>

            <CreateAuthor openModal={createModalOpen} closeModal={handleCloseCreateModal} handleReload={handleReload} />

            <EditAuthor
                data={authorInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoAuthor data={authorInfo} openModal={showInfoModal} closeModal={handleCloseShowInfoModal} />

            {contextHolder}

            <ImportAuthorModal
                open={importModalOpen}
                onClose={handleCloseImportModal}
                onFileChange={handleFileChange}
                onImport={handleImport}
                selectedFile={selectedFile}
            />

            <ErrorModal
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                errorMessages={errorMessages}
            />
        </div>
    );
}

export default ManageAuthor;
