import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Table, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageAuthorApi from 'src/services/manageAuthorService';
import CreateAuthor from './CreateAuthor';
import EditAuthor from './EditAuthor';
import ShowInfoAuthor from './ShowInfoAuthor';
import moment from 'moment';

function ManageAuthor() {
    const [authorList, setAuthorList] = useState([]);
    const [authorInfo, setAuthorInfo] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [showModalOpen, setShowModalOpen] = useState(false);
    const [modalDelete, contextHolder] = Modal.useModal();

    const { authorData, deleteAuthor } = useManageAuthorApi();

    const fetchData = async () => {
        const results = await authorData();
        setAuthorList(results?.authors);
    };

    useEffect(() => {
        fetchData();
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

    const columns = [
        {
            title: 'Tên tác giả',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthdate',
            sorter: (a, b) => new Date(a.birthdate) - new Date(b.birthdate),
            render: (text) => (text ? moment(text).format('DD/MM/YYYY') : 'Chưa xác định'),
        },
        {
            title: 'Quê quán',
            dataIndex: 'hometown',
        },
        {
            title: 'Bút danh',
            dataIndex: 'pen_name',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <div className="space-x-2">
                    <Button icon={<EditOutlined />} onClick={() => { setAuthorInfo(record); setEditModalOpen(true); }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => {
                        modalDelete.confirm({
                            title: 'Xác nhận xoá',
                            icon: <ExclamationCircleFilled />,
                            content: `Bạn có chắc chắn muốn xóa tác giả: ${record.name}`,
                            onOk: () => handleDelete(record.id),
                        });
                    }} />
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 className="text-2xl text-center">Quản lý Tác giả</h1>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setCreateModalOpen(true)}>Tạo mới</Button>
            <Table
                columns={columns}
                dataSource={authorList}
                rowKey={(record) => record.id}
                onRow={(record) => ({
                    onClick: () => { setAuthorInfo(record); setShowModalOpen(true); },
                })}
            />
            <CreateAuthor open={createModalOpen} onClose={() => setCreateModalOpen(false)} onReload={fetchData} />
            <EditAuthor data={authorInfo} open={editModalOpen} onClose={() => setEditModalOpen(false)} onReload={fetchData} />
            <ShowInfoAuthor data={authorInfo} open={showModalOpen} onClose={() => setShowModalOpen(false)} />
            {contextHolder}
        </div>
    );
}

export default ManageAuthor;
