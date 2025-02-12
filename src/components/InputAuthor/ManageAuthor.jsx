import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Tooltip, Modal, Space, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageAuthorApi from 'src/services/manageAuthorService';
import CreateAuthor from './CreateAuthor';
import EditAuthor from './EditAuthor';
import ShowInfoAuthor from './ShowInfoAuthor';
import moment from 'moment';


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

    const [filteredAuthors, setFilteredAuthors] = useState([]); // Dữ liệu sau khi lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('name'); // Mặc định lọc theo tên tác giả

    const { authorData, deleteAuthor, deleteListAuthor } = useManageAuthorApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await authorData(page, pageSize);
            setAuthorList(results?.authors);
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
        setAuthorInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setAuthorInfo({});
    }, []);

    const handleDelete = async (id) => {
        const result = await deleteAuthor(id);
        console.log(result)
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
                <h1 className="text-2xl mt-[60px] mb-[10px]">Quản lý Tác giả</h1>
            </div>
            <h2>Tìm kiếm Tác giả</h2>
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

            <CreateAuthor
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditAuthor
                data={authorInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoAuthor
                data={authorInfo}
                openModal={showInfoModal}
                closeModal={handleCloseShowInfoModal}
            />

            {contextHolder}
        </div>
    );
}

export default ManageAuthor;