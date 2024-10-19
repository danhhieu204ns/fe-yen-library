import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { getColumnSearchProps } from 'src/utils/searchInColumn';

function ShowInfo({
    open,
    onCancel,
    record=null
}){
    const disabled = true;

    return (
        <Modal title="Thông tin chi tiết" open={open} onCancel={onCancel} onOk={onCancel} width='50%'>
            <Row gutter={[12, 12]}>
                <Col span={8}>
                    <Typography>Mã sinh viên</Typography>
                    <Input disabled={disabled} value={record?.student_code} className='disabled:bg-white disabled:text-black'/>
                </Col> 
                <Col span={8}>
                    <Typography>Họ tên</Typography>
                    <Input disabled={disabled} value={record?.full_name} className='disabled:bg-white disabled:text-black'/>
                </Col> 
                <Col span={8}>
                    <Typography>Lớp</Typography>
                    <Input disabled={disabled} value={record?.student_class_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col> 
                <Col span={24}>
                    <Table
                        columns={[
                            {
                                title: 'STT',
                                key: 'index',
                                dataIndex: 'index',
                                width:80,
                                render: (value, record, index) => index+1
                            },
                            {
                                title: 'Mã môn học',
                                key: 'subject_code',
                                dataIndex: 'subject_code',
                                width: 150,
                                ...getColumnSearchProps('Mã môn học', 'subject_code'),
                            },
                            {
                                title: 'Tên môn học',
                                key: 'subject_name',
                                dataIndex: 'subject_name',
                                ...getColumnSearchProps('Tên môn học', 'subject_name'),
                            },
                        ]} 
                        dataSource={record?.student_learn_again_ids}
                        pagination={{
                            showSizeChanger: true
                        }}
                        rowKey={(record) => record.id}
                        scroll={{
                            y: 300
                        }}
                    />
                </Col>
            </Row>    
        </Modal>
    )
}

export default ShowInfo
