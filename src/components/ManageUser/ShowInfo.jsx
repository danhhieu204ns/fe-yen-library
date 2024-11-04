import { Modal, Row, Col, Input, Typography } from 'antd';
import dayjs from 'dayjs';

function ShowInfo({ open, onClose, record }) {
    const disabled = true;
    return (
        <Modal 
            title="Thông tin chi tiết" 
            open={open} 
            onCancel={onClose} 
            onOk={onClose}
        >
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Tên người dùng</Typography>
                    <Input disabled={disabled} value={record?.username} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={12}>
                    <Typography>Họ tên</Typography>
                    <Input disabled={disabled} value={record?.full_name} className='disabled:bg-white disabled:text-black'/>
                </Col>
                <Col span={12}>
                    <Typography>Vai trò</Typography>
                    <Input className='disabled:bg-white disabled:text-black' disabled={disabled} value={record?.role} />
                </Col>
                <Col span={12}>
                    <Typography>Trạng thái</Typography>
                    <Input className='disabled:bg-white disabled:text-black' disabled={disabled} value={record?.active_user ? 'Đang hoạt động' : 'Không hoạt động'} />
                </Col>
            </Row>
        </Modal>
    );
}


export default ShowInfo
