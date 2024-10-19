import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { getColumnSearchProps } from 'src/utils/searchInColumn';
import { useFeeApi } from 'src/services/feeService';

function ShowInfo({
    open,
    onCancel,
    record=null
}){
    const [studentList, setStudentList] = useState([]);

    const feeService = useFeeApi();

    const disabled = true;

    useEffect(() => {
        const fetchStudentInClass = async () => {
            let res = await feeService.getAllStudentInClassFee(record.id);
            setStudentList(res.data.data);
        }

        if (record?.id) fetchStudentInClass();
    }, [record])

    return (
        <Modal title="Thông tin chi tiết" open={open} onCancel={onCancel} onOk={onCancel} width='50%'>
            <Row gutter={[12, 12]}>
                <Col span={8}>
                    <Typography>Lớp</Typography>
                    <Input disabled={disabled} value={record?.student_class_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col> 
                <Col span={8}>
                    <Typography>Kỳ học</Typography>
                    <Input disabled={disabled} value={record?.semester_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col> 
                <Col span={8}>
                    <Typography>Số lượng chưa đóng</Typography>
                    <Input disabled={disabled} value={record?.number_unpaid} className='disabled:bg-white disabled:text-red-500 disabled:font-semibold'/>
                </Col> 
                <Col span={24}>
                    <Table
                        columns={[
                            {
                                title: 'Mã sinh viên',
                                key: 'student_code',
                                dataIndex: 'student_code',
                                align: 'center',
                                ...getColumnSearchProps('Mã sinh viên', 'student_code'),
                                render: (text, record) => <Typography className={record.status?'text-green-500':''}>{text}</Typography>
                            },
                            {
                                title: 'Họ tên',
                                key: 'full_name',
                                dataIndex: 'full_name',
                                align: 'center',
                                ...getColumnSearchProps('Họ tên', 'full_name'),
                                render: (text, record) => <Typography className={record.status?'text-green-500':''}>{text}</Typography>
                            },
                            {
                                title: 'Đã nộp học phí',
                                key: 'status',
                                dataIndex: 'status',
                                align: 'center',
                                filters: [
                                    {text: 'Đã đóng', value: true},
                                    {text: 'Chưa đóng', value: false}
                                ],
                                onFilter: (value, record) => record.status == value,
                                render: (value) => value?<CheckOutlined className='text-green-500'/>:null
                            }
                        ]} 
                        dataSource={studentList}
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
