import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, Table } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function ShowInfo({
    open,
    onCancel,
    record
}){
    const disabled = true;
    return (
        <Modal title="Thông tin chi tiết" open={open} onCancel={onCancel} onOk={onCancel} width='50%'>
            <Row gutter={[12, 12]}>
                <Col span={8}>
                    <Typography>Lớp</Typography>
                    <Input disabled={disabled} value={record?.student_class_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col> 
                <Col span={8}>
                    <Typography>Ngày</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={dayjs(record?.date_absent, "YYYY-MM-DD").format("DD/MM/YYYY")} />
                </Col>
                <Col span={8}>
                    <Typography>Số lượng vắng</Typography>
                    <Input disabled={disabled} value={record?.number_absent} className='disabled:bg-white disabled:text-red-500 disabled:font-semibold'/>
                </Col>
                <Col span={24}>
                    <Table
                        columns={[
                            {
                                title: 'Mã sinh viên',
                                key: 'student_code',
                                dataIndex: 'student_code'
                            },
                            {
                                title: 'Họ tên',
                                key: 'full_name',
                                dataIndex: 'full_name'
                            },
                            {
                                title: 'Số tiết vắng',
                                key: 'number_lesson_absent',
                                dataIndex: 'number_lesson_absent'
                            },
                            {
                                title: 'Lý do',
                                key: 'reason',
                                dataIndex: 'reason'
                            }
                        ]} 
                        dataSource={record?.student_absent_ids}
                        pagination={false}
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
