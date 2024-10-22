import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Tooltip, Modal, Space } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageInfoApi from 'src/services/manageInfoService';
import { toast } from 'react-toastify';
import CreateGrade from './CreateGrade';
import EditGrade from './EditGrade';
import ShowInfoGrade from './ShowInfoGrade';

function ManageGrade() {
    const [gradeList, setGradeList] = useState([]);
    const [listGradeToDelete, setListGradeToDelete] = useState([]);
    const [gradeInfo, setGradeInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalDetele, contextHolder] = Modal.useModal();

    const { allGradePageable, deleteGrade, deleteListGrade } = useManageInfoApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await allGradePageable(page, pageSize);
            setGradeList(results?.student_cohort_ids);
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
        setGradeInfo({});
    }, []);

    const handleCloseShowInfoModal = useCallback(() => {
        setShowInfoModal(false);
        setGradeInfo({});
    }, []);

    const handleDelete = async (id) => {
        const result = await deleteGrade(id);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setReloadToggle(!reloadToggle);
    };

    const handleDeleteListGrade = async () => {
        const result = await deleteListGrade(listGradeToDelete);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setListGradeToDelete([]);
        setReloadToggle(!reloadToggle);
    };

    const columns = [
        {
            title: 'Khóa',
            dataIndex: 'number',
            key: 'number',
            align: 'center',
        },
        {
            title: 'Danh sách lớp',
            key: 'class_list',
            align: 'center',
            render: (text, record) => {
                const classList = record?.student_classes;
                return (
                    <div className="flex flex-wrap">
                        {classList.map((item) => (
                            <div className="border p-1 rounded-lg m-1 whitespace-nowrap" key={item.id}>
                                {item.class_name}
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div className="space-x-2 whitespace-nowrap">
                    <Tooltip title="Sửa">
                        <Button
                            shape="circle"
                            className="bg-yellow-300"
                            type="primary"
                            icon={<EditOutlined className="text-slate-900 font-[300]" />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setGradeInfo(record);
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
                                modalDetele.confirm({
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa khóa học: ${record?.number}?`,
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
                <h1 className="text-2xl mt-[60px]">Quản lý khóa học</h1>
            </div>
            <Space className="my-2">
                <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                    <PlusCircleOutlined />
                    Tạo mới
                </Button>
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        modalDetele.confirm({
                            title: 'Xác nhận xoá',
                            icon: <ExclamationCircleFilled />,
                            content: `Bạn có chắc chắn muốn xóa ${listGradeToDelete.length} khóa học đã chọn?`,
                            onOk() {
                                handleDeleteListGrade();
                            },
                            onCancel() {},
                        });
                    }}
                    disabled={listGradeToDelete.length === 0}
                >
                    Xóa {listGradeToDelete.length !== 0 ? listGradeToDelete.length + ' khóa học' : ''}
                </Button>
            </Space>
            <div>
                <Table
                    columns={columns}
                    dataSource={gradeList}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listGradeToDelete,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setListGradeToDelete(selectedRowKeys);
                        },
                    }}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: totalData,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                setGradeInfo(record);
                                setShowInfoModal(true);
                            },
                        };
                    }}
                />
            </div>

            <CreateGrade openModal={createModalOpen} closeModal={handleCloseCreateModal} handleReload={handleReload} />

            <EditGrade
                data={gradeInfo}
                openModal={editModalOpen}
                closeModal={handleCloseEditModal}
                handleReload={handleReload}
            />

            <ShowInfoGrade data={gradeInfo} openModal={showInfoModal} closeModal={handleCloseShowInfoModal} />

            {contextHolder}
        </div>
    );
}

export default ManageGrade;
