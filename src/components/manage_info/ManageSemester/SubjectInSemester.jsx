import { memo, useEffect, useState } from 'react';
import { Button, Table, Modal, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import useManageInfoApi from 'src/services/manageInfoService';
import { toast } from 'react-toastify';

function SubjectInSemester({ semesterId }) {
    const [subjectListInSemester, setSubjectListInSemester] = useState([]);
    const [subjectListToAdd, setSubjectListToAdd] = useState([]);
    const [listSubjectIdToAdd, setListSubjectIdToAdd] = useState([]);
    const [listSubjectIdToDelete, setListSubjectIdToDelete] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [openAddSubjectModal, setOpenAddSubjectModal] = useState(false);
    const [modalDetele, contextHolder] = Modal.useModal();

    const { allSubjectInSemester, allSubject, addSubjectToSemester, deleteListSubjectInSemester } = useManageInfoApi();

    useEffect(() => {
        const fetchData = async () => {
            const result = await allSubjectInSemester(semesterId);
            setSubjectListInSemester(result?.subject);
        };

        fetchData();
    }, [semesterId, reloadToggle]);

    const handleOpenAddSubjectModal = async () => {
        const result = await allSubject();
        const data = result?.subject_ids.filter(
            (subject) => !subjectListInSemester.some((subjectInSemester) => subjectInSemester.id === subject.id)
        );
        setSubjectListToAdd(data);
        setOpenAddSubjectModal(true);
    };

    const handleAddListSubject = async () => {
        const result = await addSubjectToSemester(semesterId, listSubjectIdToAdd);
        console.log(result);

        if (result?.status) {
            toast.error('Thêm môn học thất bại');
            return;
        }

        setListSubjectIdToAdd([]);
        toast.success('Thêm môn học thành công');
        setOpenAddSubjectModal(false);
        setReloadToggle(!reloadToggle);
    };

    const handleDeleteListSubject = async () => {
        const result = await deleteListSubjectInSemester(semesterId, listSubjectIdToDelete);

        if (result?.status) {
            toast.error('Xóa thất bại');
            return;
        }

        setListSubjectIdToDelete([]);
        toast.success('Xóa thành công');
        setReloadToggle(!reloadToggle);
    };

    const columns = [
        {
            title: 'Mã môn học',
            dataIndex: 'subject_code',
            key: 'subject_code',
            align: 'center',
        },
        {
            title: 'Tên môn học',
            key: 'subject_name',
            dataIndex: 'subject_name',
            align: 'center',
        },
        {
            title: 'Số tín chỉ',
            key: 'number_study_credits',
            dataIndex: 'number_study_credits',
            align: 'center',
        },
        {
            title: 'Tổng số tiết học',
            key: 'total_lesson',
            dataIndex: 'total_lessons',
            align: 'center',
        },
    ];

    return (
        <div className="mx-6 mt-6 border-t">
            <div className="flex flex-col">
                <h1 className="text-2xl">Môn học</h1>
                <div className="mt-1">
                    <Button type="primary" className="mr-4" onClick={handleOpenAddSubjectModal}>
                        <PlusCircleOutlined />
                        Thêm mới
                    </Button>
                    <Button
                        type="primary"
                        className="bg-red-500"
                        disabled={listSubjectIdToDelete.length == 0 ? true : false}
                        onClick={() => {
                            modalDetele.confirm({
                                title: 'Xác nhận xoá',
                                icon: <ExclamationCircleFilled />,
                                content: `Bạn có chắc muốn xoá ${listSubjectIdToDelete.length} môn học đã chọn?`,
                                onOk() {
                                    handleDeleteListSubject();
                                },
                                onCancel() {},
                            });
                        }}
                    >
                        <DeleteOutlined />
                        Xóa {listSubjectIdToDelete.length != 0 ? listSubjectIdToDelete.length + ' môn học' : ''}
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={subjectListInSemester}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: listSubjectIdToDelete,
                    onChange: (selectedRowKeys, selectedRows) => {
                        setListSubjectIdToDelete(selectedRowKeys); // get Id of selected rows to delete
                    },
                }}
                rowKey={(record) => record.id}
                pagination={false}
            />

            <Modal
                title="Thêm môn học"
                open={openAddSubjectModal}
                maskClosable={false}
                onCancel={() => {
                    setOpenAddSubjectModal(false);
                }}
                onOk={handleAddListSubject}
            >
                <Select
                    mode="multiple"
                    allowClear
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    style={{ width: '100%' }}
                    placeholder="Vui lòng chọn môn học"
                    value={listSubjectIdToAdd}
                    onChange={(value) => setListSubjectIdToAdd(value)}
                    options={subjectListToAdd?.map((subject) => ({
                        label: subject.subject_code + ' - ' + subject.subject_name,
                        value: subject.id,
                    }))}
                />
            </Modal>

            {contextHolder}
        </div>
    );
}

export default memo(SubjectInSemester);
