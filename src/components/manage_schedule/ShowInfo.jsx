import { Button, Modal, Row, Col, Input, Checkbox, Space, Select, Typography, Table } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import LecturerListTable from './LecturerListTable';

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
                    <Typography>Khoá</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.student_cohort_id[1]} />
                </Col>
                <Col span={8}>
                    <Typography>Môn học</Typography>
                    <Input disabled={disabled} value={record?.subject_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Kỳ học</Typography>
                    <Input disabled={disabled} value={record?.semester_id[1]} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Phòng học</Typography>
                    <Input disabled={disabled} value={record?.room?record?.room:""} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Buổi giảng dạy</Typography>
                    <Input disabled={disabled} value={record?.teaching_session} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={24}>
                    <Typography className='font-semibold'>Danh sách giảng viên</Typography>
                    <LecturerListTable data={record?.lecturer_ids} showOnly/>
                </Col>
            </Row>    
        </Modal>
    )
}

export default ShowInfo
