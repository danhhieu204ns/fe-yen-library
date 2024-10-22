import { useEffect, useState } from 'react';
import { Button, Table, Tooltip, Modal, Space } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
    CheckOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';
import useManageInfoApi from 'src/services/manageInfoService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function ManageSemester() {
    const [semesterList, setSemesterList] = useState([]);
    const [listSemesterToDelete, setListSemesterToDelete] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [modalDetele, contextHolder] = Modal.useModal();

    const { semesterData, deleteSemester, deleteListSemester } = useManageInfoApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await semesterData(page, pageSize);
            setSemesterList(results?.semester_ids);
            setTotalData(results?.total_pages * pageSize);
        };
        fetchData();
    }, [page, pageSize, reloadToggle]);

    const handleDelete = async (id) => {
        const result = await deleteSemester(id);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setReloadToggle(!reloadToggle);
    };

    const handleDeleteListSemester = async () => {
        const result = await deleteListSemester(listSemesterToDelete);
        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        toast.success('Xóa thành công');
        setListSemesterToDelete([]);
        setReloadToggle(!reloadToggle);
    };

    const columns = [
        {
            title: 'Kỳ học',
            dataIndex: 'display_name',
            key: 'semester',
        },
        {
            title: 'Kỳ hiện tại',
            key: 'current_semester',
            align: 'center',
            render: (text, record) => <div className="text-lg">{record.current_semester ? <CheckOutlined /> : ''}</div>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <div className="space-x-2">
                    <Link to={`/manage/semester/edit/${record.id}`}>
                        <Tooltip title="Sửa">
                            <Button shape="circle" className="bg-yellow-300" type="primary">
                                <EditOutlined className="text-slate-900 font-[300]" />
                            </Button>
                        </Tooltip>
                    </Link>
                    <Tooltip title="Xóa">
                        <Button
                            shape="circle"
                            className="bg-red-500"
                            type="primary"
                            onClick={(e) => {
                                let config = {
                                    title: 'Xác nhận xoá',
                                    icon: <ExclamationCircleFilled />,
                                    content: `Bạn có chắc chắn muốn xóa kỳ học: ${record.display_name}`,
                                    onOk() {
                                        handleDelete(record.id);
                                    },
                                    onCancel() {},
                                };
                                const confirm = modalDetele.confirm(config);
                            }}
                        >
                            <DeleteOutlined className="text-white" />
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-center">
                <h1 className="text-2xl mt-[60px]">Quản lý kỳ học</h1>
            </div>
            <Space className="mb-2">
                <Link to={'/manage/semester/create'}>
                    <Button type="primary">
                        <PlusCircleOutlined />
                        Tạo mới
                    </Button>
                </Link>
                <Button
                    type="primary"
                    className="bg-red-500"
                    disabled={listSemesterToDelete.length == 0 ? true : false}
                    onClick={() => {
                        modalDetele.confirm({
                            title: 'Xác nhận xoá',
                            icon: <ExclamationCircleFilled />,
                            content: `Bạn có chắc muốn xoá ${listSemesterToDelete.length} kỳ học đã chọn?`,
                            onOk() {
                                handleDeleteListSemester();
                            },
                            onCancel() {},
                        });
                    }}
                >
                    <DeleteOutlined />
                    Xóa {listSemesterToDelete.length != 0 ? listSemesterToDelete.length + ' kỳ học' : ''}
                </Button>
            </Space>
            <div>
                <Table
                    columns={columns}
                    dataSource={semesterList}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: listSemesterToDelete,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setListSemesterToDelete(selectedRowKeys);
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
                />
            </div>
            {contextHolder}
        </div>
    );
}

export default ManageSemester;
