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
                    <Input  className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.student_class_id[1]} />
                </Col>
                <Col span={8}>
                    <Typography>Khoá</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.student_cohort_id[1]} />
                </Col>
                <Col span={8}>
                    <Typography>Giới tính</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.sex=='male'?"Nam":"Nữ"} />
                </Col>
                <Col span={8}>
                    <Typography>Ngày sinh</Typography>
                    <Input disabled={disabled} value={dayjs(record?.date_of_birth, "YYYY-MM-DD").format("DD/MM/YYYY")} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Số điện thoại</Typography>
                    <Input disabled={disabled} value={record?.phone_number ? record?.phone_number : ""} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Email</Typography>
                    <Input disabled={disabled} value={record?.email ? record?.email : ""} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Địa chỉ thường trú</Typography>
                    <Input disabled={disabled} value={record?.dia_chi_tt} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Họ và tên cha</Typography>
                    <Input disabled={disabled} value={record?.ho_va_ten_cha} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Số điện thoại cha</Typography>
                    <Input disabled={disabled} value={record?.so_dien_thoai_cha} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Họ và tên mẹ</Typography>
                    <Input disabled={disabled} value={record?.ho_va_ten_me} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Số điện thoại mẹ</Typography>
                    <Input disabled={disabled} value={record?.so_dien_thoai_me} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={8}>
                    <Typography>Trạng thái</Typography>
                    <Input className='disabled:bg-white disabled:text-black'
                            disabled={disabled} 
                            value={record?.status} />
                </Col>
            </Row>    
        </Modal>
    )
}

export default ShowInfo
