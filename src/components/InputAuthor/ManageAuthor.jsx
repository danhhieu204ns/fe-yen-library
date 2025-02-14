import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Tooltip, Modal, Space, Input, Select, Typography, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageAuthorApi from 'src/services/manageAuthorService';
import CreateAuthor from './CreateAuthor';
import EditAuthor from './EditAuthor';
import ShowInfoAuthor from './ShowInfoAuthor';
import moment from 'moment';
import { UploadOutlined, CheckCircleOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';

import * as XLSX from 'xlsx';

function ManageAuthor() {
    const [authorList, setAuthorList] = useState([]);
    const [listAuthorToDelete, setListAuthorToDelete] = useState([]);
    const [authorInfo, setAuthorInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('name');

    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [isUploading, setIsUploading] = useState(false);

    const handleImport = async () => {
        if (!selectedFile) {
            toast.error('Vui lòng chọn file để import!');
            return;
        }

        setIsUploading(true);
        try {
            // const result = await importStudent(selectedFile);
            // toast.success(result?.message || 'Import thành công!');
            setIsImportModalVisible(false);
            setSelectedFile(null);
            fetchData();
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi import dữ liệu.');
        } finally {
            setIsUploading(false);
            setIsImportModalVisible(false);
        }
    };

    const generateExcelTemplate = () => {
        const wb = XLSX.utils.book_new();
        const headers = ['Tên tác giả', 'Ngày sinh', 'Địa chỉ', 'Bút danh', 'Tiểu sử'];
        const sampleRows = [['Nguyễn Văn A', '29/09/2099', 'Hà Nội', 'Hello', 'File']];
        const wsData = [headers, ...sampleRows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        XLSX.writeFile(wb, 'author_import_template.xlsx');
    };

    const { authorData, deleteAuthor, deleteListAuthor } = useManageAuthorApi();

    const fetchData = async () => {
        const results = await authorData(page, pageSize);
        setAuthorList(results?.authors);
        setTotalData(results?.total_pages * pageSize);
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

    const handleDelete = async (id) => {
        const result = await deleteAuthor(id);
        console.log(result);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        handleReload();
    };

    const handleDeleteListAuthor = async () => {
        const result = await deleteListAuthor(listAuthorToDelete);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setListAuthorToDelete([]);
        handleReload();
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
        return false;
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
        };

        filterAuthors();
    }, [searchTerm, filterOption, authorList]);

    const columns = [
        {
            title: 'Tên tác giả',
            dataIndex: 'name',
            key: 'author',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthdate',
            key: 'birthdate',
            render: (text) => (text ? moment(text).format('DD/MM/YYYY') : 'Chưa xác định'), // Định dạng ngày sinh
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Bút danh',
            dataIndex: 'pen_name',
            key: 'pen_name',
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
                                setAuthorInfo(record);
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
                                    content: `Bạn có chắc chắn muốn xóa tác giả: ${record.name}`,
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
        <div style={{ padding: '20px' }}>
            <div className="flex justify-center">
                <h1 className="text-2xl mt-[60px] py-6">Quản lý Tác giả</h1>
            </div>

            <div className="flex justify-between items-center">
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
                        <Select.Option value="name">Tên tác giả</Select.Option>
                        <Select.Option value="birthdate">Ngày sinh</Select.Option>
                        <Select.Option value="address">Địa chỉ</Select.Option>
                        <Select.Option value="pen_name">Bút danh</Select.Option>
                        <Select.Option value="biography">Tiểu sử</Select.Option>
                    </Select>
                </div>

                <Button
                    className="bg-[#28A745] shadow-none text-white border-none"
                    onClick={() => setIsImportModalVisible(true)}
                >
                    <PlusCircleOutlined /> Import
                </Button>
            </div>
            <Space className="mb-2">
                <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                    <PlusCircleOutlined />
                    Tạo mới
                </Button>
                <Button
                    type="primary"
                    className="bg-red-500"
                    disabled={listAuthorToDelete.length === 0}
                    onClick={() => {
                        modalDelete.confirm({
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
                    onRow={(record) => ({
                        onClick: () => {
                            setAuthorInfo(record);
                            setShowInfoModal(true);
                        },
                    })}
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

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <UploadOutlined className="text-blue-500" />
                        <span>Import Danh Sách Học Sinh</span>
                    </div>
                }
                open={isImportModalVisible}
                onCancel={() => {
                    setIsImportModalVisible(false);
                    setSelectedFile(null);
                }}
                footer={null}
                width={600}
            >
                <div className="flex flex-col gap-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className={`w-full border-2 border-dashed rounded-lg p-8 text-center
                ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'}
                transition-all cursor-pointer`}
                        >
                            <Upload.Dragger
                                beforeUpload={handleFileChange}
                                showUploadList={false}
                                accept=".xlsx,.xls"
                                className="border-0 bg-transparent"
                            >
                                {selectedFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-green-500 text-xl">
                                            <CheckCircleOutlined />
                                        </div>
                                        <Typography.Text className="text-green-600">
                                            Đã chọn: {selectedFile.name}
                                        </Typography.Text>
                                        <Typography.Text className="text-gray-400 text-sm">
                                            Click hoặc kéo thả để thay đổi file
                                        </Typography.Text>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-blue-500 text-xl">
                                            <UploadOutlined />
                                        </div>
                                        <Typography.Text className="text-gray-600">
                                            Click hoặc kéo thả file vào đây
                                        </Typography.Text>
                                        <Typography.Text className="text-gray-400 text-sm">
                                            Chỉ hỗ trợ file .xlsx, .xls
                                        </Typography.Text>
                                    </div>
                                )}
                            </Upload.Dragger>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={generateExcelTemplate}
                            icon={<DownloadOutlined />}
                            className="border-blue-500 text-blue-500 hover:text-blue-600"
                        >
                            Tải file mẫu
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleImport}
                            loading={isUploading}
                            disabled={!selectedFile}
                            icon={<ImportOutlined />}
                        >
                            Import Dữ Liệu
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ManageAuthor;
