import { Table, Modal, Tooltip, Button } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useEffect, useRef, useState, useMemo } from 'react';
import LecturerSelectModal from './LecturerSelectModal';

function LecturerListTable({data, disabled=false, showOnly=false, callback}){
    const [showMode, setShowMode] = useState(showOnly);

    const [lecturerList, setLecturerList] = useState();

    const [addModalOpen, setAddModalOpen] = useState(false);
    

    useEffect(() => {
        setLecturerList(data);
    }, [data])

    // Callback current state to parent every time lecturer list change
    useEffect(() => {
        if(callback) callback(lecturerList);
    }, [lecturerList])

    const columns=[
        {
            title: 'Giảng viên',
            key: 'display_name',
            dataIndex: 'display_name',
            align: 'center',
        },
        {
            title: 'CH/TG',
            key: 'ch_tg',
            dataIndex: 'ch_tg',
            align: 'center',
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
            align: 'center',
        },
        {
            title: 'Số điện thoại',
            key: 'phone_number',
            dataIndex: 'phone_number',
            align: 'center',
        },
        {
            title: 'Thao tác',
            align: 'center',
            render: (record) => {
                return (
                    <Tooltip title="Xoá">
                        <Button
                            disabled={disabled}
                            shape="circle"
                            className='bg-red-500'
                            type='primary'
                            onClick={async (e) => {
                                setLecturerList((prev) => prev.filter((entry) => entry.id!=record.id));
                            }}
                        >
                            <DeleteOutlined style={{ color: '#ffffff' }} />
                        </Button>    
                    </Tooltip>
                )
            }
        }
    ];

    const onOkCallback = (selectedRecords) => {
        setLecturerList(selectedRecords);
        setAddModalOpen(false);
    }

    return(
        <>
            <Table
                columns={!showMode ? columns : columns.slice(0, columns.length - 1)}
                dataSource={lecturerList}
                pagination={false}
                rowKey={(record) => record.id}
                scroll={{
                    y: 300
                }}
                footer={!showMode?() => <Button disabled={disabled} type='link' onClick={() => setAddModalOpen(true)}>Thêm giảng viên</Button>:null}
            />
            <LecturerSelectModal open={addModalOpen}
                                selected={lecturerList?.map((entry) => entry.id)}
                                onCancel={() => setAddModalOpen(false)}
                                onOkCallback={onOkCallback}/> 
        </>

    )
}

export default LecturerListTable;