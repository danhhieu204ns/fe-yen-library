import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Tooltip, Modal, Space, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageGenreApi from 'src/services/manageGenreService'; // Thay đổi dịch vụ
import { toast } from 'react-toastify';
import CreateGenre from './CreateGenre'; // Thay đổi component tạo mới
import EditGenre from './EditGenre'; // Thay đổi component sửa
import ShowInfoGenre from './ShowInfoGenre'; // Thay đổi component hiển thị thông tin


function ManageGenre() {
    const [genreList, setGenreList] = useState([]); // Danh sách thể loại
    const [listGenreToDelete, setListGenreToDelete] = useState([]); // Danh sách thể loại để xóa
    const [genreInfo, setGenreInfo] = useState({}); // Thông tin thể loại
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const [filteredGenres, setFilteredGenres] = useState([]); // Dữ liệu sau khi lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('name'); // Mặc định lọc theo tên the loai

    const { genreData, deleteGenre, deleteListGenres } = useManageGenreApi(); // Thay đổi hàm gọi API

    useEffect(() => {
        const fetchData = async () => {
            const results = await genreData(page, pageSize);
            setGenreList(results?.genres);
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
        setGenreInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setGenreInfo({});
    }, []);

    const handleDelete = async (id) => {
        const result = await deleteGenre(id);
        console.log(result);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        handleReload();
    };

    const handleDeleteListGenre = async () => {
        const result = await deleteListGenres(listGenreToDelete);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setListGenreToDelete([]);
        handleReload();
    };

    useEffect(() => {
        const filterGenres = () => {
            if (!searchTerm) {
                setFilteredGenres(genreList);
                return;
            }

            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = genreList.filter((genre) => {
                if (filterOption === 'name') {
                    return genre.name.toLowerCase().includes(lowercasedTerm);
                } else if (filterOption === 'age_limit') {
                    return String(genre.age_limit) === lowercasedTerm;
                } else if (filterOption === 'description') {
                    return genre.description?.toLowerCase().includes(lowercasedTerm);
                }
                return false;
            });
            setFilteredGenres(filtered);
        };

        filterGenres();
    }, [searchTerm, filterOption, genreList]);

    const columns = [
        {
            title: 'Tên thể loại',
            dataIndex: 'name',
            key: 'genre',
        },
        {
            title: 'Giới hạn tuổi',
            dataIndex: 'age_limit',
            key: 'age_limit',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <div
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px', // Điều chỉnh độ rộng cột tại đây
                    }}
                >
                    {text || 'Chưa có mô tả'}
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
                                setGenreInfo(record);
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
                                    content: `Bạn có chắc chắn muốn xóa thể loại: ${record.name}`, // Thay đổi nội dung cho thể loại
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
                <h1 className="text-2xl mt-[60px] mb-[10px]">Quản lý Thể loại</h1> {/* Thay đổi tiêu đề */}
            </div>
            <h2>Tìm kiếm Thể loại</h2>
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
                    <Option value="name">Tên Thể loại</Option>
                    <Option value="age_limit">Độ tuổi giới hạn</Option>
                    <Option value="description">Mô tả</Option>
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
                    disabled={listGenreToDelete.length === 0}
                    onClick={() => {
                        modalDelete.confirm({
                            title: 'Xác nhận xoá',
                            icon: <ExclamationCircleFilled />,
                            content: `Bạn có chắc muốn xoá ${listGenreToDelete.length} thể loại đã chọn?`, // Thay đổi nội dung cho thể loại
                            onOk() {
                                handleDeleteListGenre();
                            },
                            onCancel() {},
                        });
                    }}
                >
                    <DeleteOutlined />
                    Xóa {listGenreToDelete.length !== 0 ? listGenreToDelete.length + ' thể loại' : ''} {/* Thay đổi nội dung */}
                </Button>
            </Space>
            <div>
                <Table
                    columns={columns}
                    dataSource={filteredGenres} // Thay đổi danh sách dữ liệu
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listGenreToDelete,
                        onChange: (selectedRowKeys) => {
                            setListGenreToDelete(selectedRowKeys);
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
                            setGenreInfo(record);
                            setShowInfoModal(true);
                        },
                    })}
                />
            </div>

            <CreateGenre
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditGenre
                data={genreInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoGenre
                data={genreInfo}
                openModal={showInfoModal}
                closeModal={handleCloseShowInfoModal}
            />

            {contextHolder}
        </div>
    );
}

export default ManageGenre; // Đổi tên export thành ManageGenre
