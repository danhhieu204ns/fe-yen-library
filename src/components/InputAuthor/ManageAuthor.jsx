import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Tooltip, Modal, Space, Input, Select, Typography, Upload, Flex, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import useManageAuthorApi from 'src/services/manageAuthorService';
import CreateAuthor from './CreateAuthor';
import EditAuthor from './EditAuthor';
import ShowInfoAuthor from './ShowInfoAuthor';
import moment from 'moment';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { getColumnSearchProps } from 'src/utils/searchByApi';
import ErrorModal from 'src/components/common/ErrorModal';
import ImportAuthorModal from './ImportAuthorModal';

function ManageAuthor() {
    const [authorList, setAuthorList] = useState([]);
    const [authorInfo, setAuthorInfo] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('name');
    const [listAuthorToDelete, setListAuthorToDelete] = useState([]);

    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [total, setTotal] = useState();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [exportLoading, setExportLoading] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const { authorData, deleteAuthor, deleteListAuthor, importAuthor, exportAuthors } = useManageAuthorApi();

    const [modal, contextHolder] = Modal.useModal(); // Keep only one modal instance

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
            console.log('response', response);
            if (response.status === 200) {
                message.success(`${selectedFile.name} file uploaded successfully`);
                handleReload();
                handleCloseImportModal();
            } else {
                const errorMessages = response.errors.map(error => `Dòng ${error.Dòng}: ${error.Lỗi}`);
                setErrorMessages(errorMessages);
                setErrorModalOpen(true);
            }
        } catch (error) {
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
        setTotal(results?.total_data || 0);
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

    useEffect(() => {
        const filterAuthors = () => {
            if (!searchTerm) {
                setFilteredAuthors(authorList);
                return;
            }

            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = authorList.filter((author) => {
                if (filterOption === 'name') {
                    return author.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'birthdate') {
                    return moment(author.birthdate).format('DD/MM/YYYY').includes(lowercasedTerm);
                } else if (filterOption === 'address') {
                    return author.address?.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'pen_name') {
                    return author.pen_name?.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'biography') {
                    return author.biography?.toLowerCase().includes(lowercasedTerm);
                }
                return false;
            });
            setFilteredAuthors(filtered);
            setTotal(filtered.length);
        };

        filterAuthors();
    }, [searchTerm, filterOption, authorList]);

    const columns = [
        {
            title: 'Tên tác giả',
            dataIndex: 'name',
            key: 'author',
            ...getColumnSearchProps('Tên tác giả', 'name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
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
            sorter: (a, b) => a.address.localeCompare(b.address),
        },
        {
            title: 'Bút danh',
            dataIndex: 'pen_name',
            key: 'pen_name',
            ...getColumnSearchProps('Bút danh', 'pen_name'),
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
<           h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Tác giả</h1>
            <div className="flex justify-between items-center">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <Input
                        placeholder="Nhập từ khóa tìm kiếm..."
                        allowClear
                        size="large"
                        style={{ width: '400px', marginRight: '10px' }}
                        onChange={(e) => {
                            const searchValue = e.target.value;
                            setSearchTerm(searchValue);

                            if (!searchValue) {
                                setFilteredAuthors(authorList);
                                setTotal(authorList.length);
                                return;
                            }

                            const lowercasedTerm = searchValue.toLowerCase();
                            const filtered = authorList.filter((author) => {
                                if (filterOption === 'name') {
                                    return author.name.toLowerCase().includes(lowercasedTerm);
                                } else if (filterOption === 'birthdate') {
                                    return moment(author.birthdate).format('DD/MM/YYYY').includes(lowercasedTerm);
                                } else if (filterOption === 'address') {
                                    return author.address?.toLowerCase().includes(lowercasedTerm);
                                } else if (filterOption === 'pen_name') {
                                    return author.pen_name?.toLowerCase().includes(lowercasedTerm);
                                } else if (filterOption === 'biography') {
                                    return author.biography?.toLowerCase().includes(lowercasedTerm);
                                }
                                return false;
                            });

                            setFilteredAuthors(filtered);
                            setTotal(filtered.length);
                        }}
                    />
                    <label style={{ marginRight: '10px' }}>Lọc theo:</label>
                    <Select
                        value={filterOption}
                        onChange={(value) => setFilterOption(value)}
                        style={{ width: '200px' }}
                    >
                        <Select.Option value="name">Tên tác giả</Select.Option>
                        <Select.Option value="birthdate">Ngày sinh</Select.Option>
                        <Select.Option value="address">Địa chỉ</Select.Option>
                        <Select.Option value="pen_name">Bút danh</Select.Option>
                        <Select.Option value="biography">Tiểu sử</Select.Option>
                    </Select>
                </div>

                <Flex gap={6} justify="center" align="center">
                    <span style={{ fontWeight: 'bold' }}>Tổng số:</span>
                    <Input
                        style={{
                            width: '60px',
                            color: 'red',
                            fontWeight: 'bold',
                        }}
                        value={total}
                        readOnly
                        disabled
                    />
                </Flex>
            </div>
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
            </Space>
            <div>
                <Table
                    columns={columns}
                    dataSource={filteredAuthors}
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
                    }}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                // Removed show modal on row click
                            },
                        };
                    }}
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
