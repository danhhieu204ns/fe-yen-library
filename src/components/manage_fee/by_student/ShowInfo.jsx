import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function ShowInfo({
    open,
    onCancel,
    record
}){
    const disabled = true;
    return (
        <Modal title="Thông tin chi tiết" open={open} onCancel={onCancel} onOk={onCancel}>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Mã sinh viên</Typography>
                    <Input disabled={disabled} value={record?.student_code} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={12}>
                    <Typography>Họ tên</Typography>
                    <Input disabled={disabled} value={record?.full_name} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={12}>
                    <Typography>Lớp</Typography>
                    <Input  className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.student_class_id[1]} />
                </Col>
                <Col span={12}>
                    <Typography>Trạng thái học phí</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.status?"Đã đóng":"Chưa đóng"} />
                </Col>
                <Col span={12}>
                    <Typography>Kỳ học</Typography>
                    <Input disabled={disabled} value={record?.semester_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={12}>
                    <Typography>Thời gian cập nhật</Typography>
                    <Input disabled={disabled} value={dayjs(record?.write_date, 'YYYY-MM-DD HH:MM:ss').format('DD/MM/YYYY HH:MM:ss')} className='disabled:bg-white disabled:text-black'/>
                </Col>
            </Row>    
        </Modal>
    )
}

export default ShowInfo
