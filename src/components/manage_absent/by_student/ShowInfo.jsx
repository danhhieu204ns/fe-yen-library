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
                    <Typography>Số tiết học vắng mặt</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.number_lesson_absent} />
                </Col>
                <Col span={12}>
                    <Typography>Ngày vắng</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={dayjs(record?.date_absent, "YYYY-MM-DD").format("DD/MM/YYYY")} />
                </Col>
                <Col span={12}>
                    <Typography>Môn học</Typography>
                    <Input disabled={disabled} value={record?.subject_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={12}>
                    <Typography>Kỳ học</Typography>
                    <Input disabled={disabled} value={record?.semester_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={12}>
                    <Typography>Lý do</Typography>
                    <Input disabled={disabled} value={record?.reason?record?.reason:""} className='disabled:bg-white disabled:text-black'/>
                </Col>
            </Row>    
        </Modal>
    )
}

export default ShowInfo
