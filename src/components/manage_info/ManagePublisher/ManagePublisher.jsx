import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Tooltip, Modal, Space } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManagePublisherApi from 'src/services/managePublisherService'; // Sửa đường dẫn dịch vụ
import { toast } from 'react-toastify';
import CreatePublisher from './CreatePublisher';
import EditPublisher from './EditPublisher';
import ShowInfoPublisher from './ShowInfoPublisher';

function ManagePublisher() {
    const [publisherList, setPublisherList] = useState([]);
    const [listPublisherToDelete, setListPublisherToDelete] = useState([]);
    const [publisherInfo, setPublisherInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const { publisherData, deletePublisher, deleteListPublishers } = useManagePublisherApi(); // Sửa hàm gọi API

    useEffect(() => {
        const fetchData = async () => {
            const results = await publisherData(page, pageSize);
            setPublisherList(results?.publishers);
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
        setPublisherInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setPublisherInfo({});
    }, []);

    const handleDelete = async (id) => {
        const result = await deletePublisher(id);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        handleReload();
    };

    const handleDeleteListPublisher = async () => {
        const result = await deleteListPublishers(listPublisherToDelete);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setListPublisherToDelete([]);
        handleReload();
    };

    const columns = [
        {
            title: 'Tên nhà xuất bản',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
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
                                setPublisherInfo(record);
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
                                    content: `Bạn có chắc chắn muốn xóa nhà xuất bản: ${record.name}`,
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
                <h1 className="text-2xl">Quản lý nhà xuất bản</h1>
            </div>
            <Space className="mb-2">
                <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                    <PlusCircleOutlined />
                    Tạo mới
                </Button>
                <Button
                    type="primary"
                    className="bg-red-500"
                    disabled={listPublisherToDelete.length === 0}
                    onClick={() => {
                        modalDelete.confirm({
                            title: 'Xác nhận xoá',
                            icon: <ExclamationCircleFilled />,
                            content: `Bạn có chắc muốn xoá ${listPublisherToDelete.length} nhà xuất bản đã chọn?`,
                            onOk() {
                                handleDeleteListPublisher();
                            },
                            onCancel() {},
                        });
                    }}
                >
                    <DeleteOutlined />
                    Xóa {listPublisherToDelete.length !== 0 ? listPublisherToDelete.length + ' nhà xuất bản' : ''}
                </Button>
            </Space>
            <div>
                <Table
                    columns={columns}
                    dataSource={publisherList}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listPublisherToDelete,
                        onChange: (selectedRowKeys) => {
                            setListPublisherToDelete(selectedRowKeys);
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
                            setPublisherInfo(record);
                            setShowInfoModal(true);
                        },
                    })}
                />
            </div>

            <CreatePublisher
                openModal={createModalOpen}
                closeModal={handleCloseCreateModal}
                handleReload={handleReload}
            />

            <EditPublisher
                data={publisherInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoPublisher
                data={publisherInfo}
                openModal={showInfoModal}
                closeModal={handleCloseShowInfoModal}
            />

            {contextHolder}
        </div>
    );
}

export default ManagePublisher;
