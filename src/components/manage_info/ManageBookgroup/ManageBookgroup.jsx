import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Tooltip, Modal, Space } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageBookGroupApi from 'src/services/manageBookgroupService'; // Giả sử bạn có service cho nhóm sách
import { toast } from 'react-toastify';
import CreateBookgroup from './CreateBookgroup'; // Component tạo mới nhóm sách
import EditBookgroup from './EditBookgroup'; // Component sửa thông tin nhóm sách
import ShowInfoBookgroup from './ShowInfoBookgroup'; // Component hiển thị thông tin nhóm sách
import moment from 'moment';

function ManageBookGroup() {
    const [bookGroupList, setBookGroupList] = useState([]);
    const [listBookGroupToDelete, setListBookGroupToDelete] = useState([]);
    const [bookGroupInfo, setBookGroupInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const { bookgroupData, deleteBookgroup, deleteListBookgroups } = useManageBookGroupApi(); // Giả sử bạn có service cho nhóm sách

    useEffect(() => {
        const fetchData = async () => {
            const results = await bookgroupData(page, pageSize);
            setBookGroupList(results?.bookgroups);
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
        setBookGroupInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setBookGroupInfo({});
    }, []);

    const handleDelete = async (id) => {
        const result = await deleteBookgroup(id);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        handleReload();
    };

    const handleDeleteListBookGroup = async () => {
        const result = await deleteListBookgroups(listBookGroupToDelete);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setListBookGroupToDelete([]);
        handleReload();
    };

    const columns = [
        {
            title: 'Tên nhóm sách',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <div
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px', // Bạn có thể điều chỉnh độ rộng cột tại đây
                    }}
                >
                    {text || 'Chưa có nội dung'}
                </div>
            ),
        },
        {
            title: 'Tác giả',
            dataIndex: 'author', // Chú ý bạn cần thay 'author_id' thành 'author' nếu bạn đã load đầy đủ thông tin tác giả
            key: 'author',
            render: (author) => author?.name || 'Không có tác giả', // Hiển thị tên tác giả
        },
        {
            title: 'Nhà xuất bản',
            dataIndex: 'publisher', // Thay 'publisher_id' thành 'publisher' nếu đã load thông tin nhà xuất bản
            key: 'publisher',
            render: (publisher) => publisher?.name || 'Không có nhà xuất bản', // Hiển thị tên nhà xuất bản
        },
        {
            title: 'Thể loại',
            dataIndex: 'genre', // Thay 'genre_id' thành 'genre' nếu đã load thông tin thể loại
            key: 'genre',
            render: (genre) => genre?.name || 'Không có thể loại', // Hiển thị tên thể loại
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
                                setBookGroupInfo(record);
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
                                    content: `Bạn có chắc chắn muốn xóa nhóm sách: ${record.name}`,
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
        <div>
            <div className="flex justify-center">
                <h1 className="text-2xl">Quản lý nhóm sách</h1>
            </div>
            <Space className="mb-2">
                <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                    <PlusCircleOutlined />
                    Tạo mới
                </Button>
                <Button
                    type="primary"
                    className="bg-red-500"
                    disabled={listBookGroupToDelete.length === 0}
                    onClick={() => {
                        modalDelete.confirm({
                            title: 'Xác nhận xoá',
                            icon: <ExclamationCircleFilled />,
                            content: `Bạn có chắc muốn xóa ${listBookGroupToDelete.length} nhóm sách đã chọn?`,
                            onOk() {
                                handleDeleteListBookGroup();
                            },
                            onCancel() {},
                        });
                    }}
                >
                    <DeleteOutlined />
                    Xóa {listBookGroupToDelete.length !== 0 ? listBookGroupToDelete.length + ' nhóm sách' : ''}
                </Button>
            </Space>
            <div>
                <Table
                    columns={columns}
                    dataSource={bookGroupList}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listBookGroupToDelete,
                        onChange: (selectedRowKeys) => {
                            setListBookGroupToDelete(selectedRowKeys);
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
                            setBookGroupInfo(record);
                            setShowInfoModal(true);
                        },
                    })}
                />
            </div>

            <CreateBookgroup
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditBookgroup
                data={bookGroupInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoBookgroup
                data={bookGroupInfo}
                openModal={showInfoModal}
                closeModal={handleCloseShowInfoModal}
            />

            {contextHolder}
        </div>
    );
}

export default ManageBookGroup;
