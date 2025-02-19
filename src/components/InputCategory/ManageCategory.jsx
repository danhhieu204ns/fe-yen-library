import { useState, useEffect, useCallback } from 'react';
import { Modal, Space, Table, Tooltip, Button, Typography, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined, EyeOutlined, UploadOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import useManageCategoryApi from 'src/services/manageCategoryService';
import CreateCategory from './CreateCategory';
import ShowInfoCategory from './ShowInfoCategory';
import EditCategory from './EditCategory';
import ImportCategoryModal from './ImportCategoryModal';
import ErrorModal from 'src/components/common/ErrorModal';
import { getColumnSearchProps } from 'src/utils/searchByApi';

function ManageCategory() {
    const [categoryList, setCategoryList] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);

    const [currentFilters, setCurrentFilters] = useState();
    const [searchMode, setSearchMode] = useState(false);
    const [filterRequestBody, setFilterRequestBody] = useState();
    const [modal, contextHolder] = Modal.useModal();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    const { getAllCategoryByPage, deleteCategory, deleteCategoryList, searchCategory, importCategory, exportCategories } = useManageCategoryApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await getAllCategoryByPage(page, pageSize);
            setCategoryList(results?.categories);
            setTotalData(results?.total_data);
        };
        if (!searchMode) fetchData();
    }, [page, pageSize, reloadToggle, searchMode]);

    useEffect(() => {
        const fetchFilteredData = async () => {
            let res = await searchCategory(filterRequestBody, page, pageSize);
            setCategoryList(res?.categories);
            setTotalData(res?.total_data);
        }

        if (searchMode) fetchFilteredData(); // Chỉ chạy khi trong search mode
    }, [reloadToggle, page, pageSize, searchMode, filterRequestBody]);

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
        setCategoryInfo({});
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setEditModalOpen(false);
        setCategoryInfo({});
    }, []);

    const handleCloseImportModal = useCallback(() => {
        setImportModalOpen(false);
        setSelectedFile(null);
    }, []);

    const handleCloseErrorModal = useCallback(() => {
        setErrorModalOpen(false);
        setErrorMessages([]);
    }, []);

    const handleDelete = async (data) => {
        const result = await deleteCategory(data.id);

        if (result) {
            handleReload();
            modal.success({
                title: 'Xoá thành công',
                content: `Đã xoá tác giả: ${data?.name}`,
            });
        } else {
            modal.error({
                title: 'Xoá thất bại',
                content: `Xoá tác giả: ${data?.name} không thành công`,
            });
        }
    };

    const handleDeleteList = async () => {
        const result = await deleteCategoryList(selectedRows);

        if (result) {
            handleReload();
            modal.success({
                title: 'Xoá thành công',
                content: `Đã xoá ${selectedRows.length} tác giả`,
            });
        } else {
            modal.error({
                title: 'Xoá thất bại',
                content: `Xoá ${selectedRows.length} tác giả không thành công`,
            });
        }
    };

    const resetSearch = () => {
        console.log("Exit search mode! Resetting");
        setSearchMode(false);
    };

    const onTableChange = async (pagination, filters, sorter, extra) => {
        // Handle filters
        let cleanedFilters = {};
        if (filters.name) {
            cleanedFilters.name = filters.name[0];
            const searchBody = {
                name: filters.name[0]
            };
            setFilterRequestBody(searchBody);
            setSearchMode(true);
        } else {
            setSearchMode(false);
        }
        setCurrentFilters(cleanedFilters);

        // Handle sorting
        if (sorter && sorter.field) {
            const sortedList = [...categoryList].sort((a, b) => {
                const fieldA = a[sorter.field];
                const fieldB = b[sorter.field];

                if (typeof fieldA === 'string') {
                    if (sorter.order === 'ascend') {
                        return fieldA.localeCompare(fieldB);
                    } else if (sorter.order === 'descend') {
                        return fieldB.localeCompare(fieldA);
                    }
                } else if (typeof fieldA === 'number') {
                    if (sorter.order === 'ascend') {
                        return fieldA - fieldB;
                    } else if (sorter.order === 'descend') {
                        return fieldB - fieldA;
                    }
                }
                return 0;
            });
            setCategoryList(sortedList);
        }
    };

    const handleFileChange = (info) => {
        const isExcel = info.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || info.file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
            message.error('Chỉ chấp nhận file Excel!');
            return;
        }
        setSelectedFile(info.file);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            message.error('Vui lòng chọn file để import!');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await importCategory(formData);
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

    const handleExport = async () => {
        modal.confirm({
            title: 'Xác nhận xuất file',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn xuất danh sách thể loại?',
            okText: 'Xuất file',
            cancelText: 'Hủy',
            onOk: async () => {
                setExportLoading(true);
                try {
                    const response = await exportCategories();
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
                        link.setAttribute('download', `categories_${currentDate}.xlsx`);
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        const searchValue = selectedKeys[0] || '';
        confirm();
        setSearchText(searchValue);
        setSearchedColumn(dataIndex);

        if (!searchValue) {
            setFilteredCategories([]);
            return;
        }

        const filtered = categoryList.filter(item => {
            const targetValue = item[dataIndex];
            if (!targetValue) return false;
            
            if (dataIndex === 'age_limit') {
                return targetValue.toString().includes(searchValue);
            }
            return targetValue.toString().toLowerCase().includes(searchValue.toLowerCase());
        });

        setFilteredCategories(filtered);
    };

    const handleReset = (clearFilters, confirm) => {
        if (clearFilters) {
            clearFilters();
        }
        setSearchText('');
        setFilteredCategories([]);
        confirm();
    };

    const getColumnSearchProps = (placeholder, dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Tìm ${placeholder}`}
                    value={selectedKeys[0] || ''}
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
        onFilter: (value, record) => {
            if (!record[dataIndex]) return false;
            return record[dataIndex].toString().toLowerCase()
                .includes((value || '').toLowerCase());
        },
        filteredValue: searchedColumn === dataIndex ? [searchText] : null,
    });

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            align: 'center',
            ...getColumnSearchProps('tên danh mục', 'name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Giới hạn tuổi',
            dataIndex: 'age_limit',
            key: 'age_limit',
            width: '15%',
            align: 'center',
            ...getColumnSearchProps('giới hạn tuổi', 'age_limit'),
            sorter: (a, b) => (a.age_limit || 0) - (b.age_limit || 0),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            align: 'center',
            ...getColumnSearchProps('mô tả', 'description'),
            sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
            render: (text) => (
                <div style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px'
                }}>
                    {text || 'Chưa có mô tả'}
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
                                setCategoryInfo(record);
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
                                setCategoryInfo(record);
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
                                    content: `Bạn có chắc chắn muốn xóa tác giả: ${record?.name}?`,
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
        <div className='py-20 px-4'>
            <h1 className="flex justify-center text-xl font-semibold my-2">Quản lý Thể loại sách</h1>
            <Space className="flex my-2 justify-between">
                <Space>
                    <Button 
                        type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>
                        Thêm mới
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<UploadOutlined />} 
                        className="bg-green-500 text-white" 
                        onClick={() => setImportModalOpen(true)}
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
                        icon={<DeleteOutlined />}
                        disabled={selectedRows.length == 0}
                        onClick={() => {
                            modal.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc chắn muốn xóa ${selectedRows.length} tác giả đã chọn?`,
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
                        Xoá {selectedRows.length != 0 ? selectedRows.length + ' tác giả' : ''}
                    </Button>    
                </Space>
                <Space>
                    <Typography className='font-bold'>Tổng số: </Typography>
                    <Input disabled className='disabled:bg-white disabled:text-red-500 font-bold w-16' value={totalData}/>    
                </Space>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredCategories.length > 0 ? filteredCategories : categoryList}
                onChange={onTableChange}
                rowKey={(record) => record.id}
                pagination={{
                    showSizeChanger: true,
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
                            // Removed the code to show modal on row click
                        },
                    };
                }}
            />

            <CreateCategory
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditCategory
                data={categoryInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoCategory data={categoryInfo} openModal={showInfoModal} closeModal={handleCloseShowInfoModal} />

            <ImportCategoryModal
                open={importModalOpen}
                onClose={handleCloseImportModal}
                onFileChange={handleFileChange}
                onImport={handleImport}
                selectedFile={selectedFile}
            />

            <ErrorModal
                open={errorModalOpen}
                onClose={handleCloseErrorModal}
                errorMessages={errorMessages}
            />

            {contextHolder}
        </div>
    );
}

export default ManageCategory;
