import { memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';
import moment from 'moment';

function ShowInfoPublisher({ openModal, closeModal, data }) {
    return (
        <Modal 
            title="Thông tin nhà xuất bản" 
            open={openModal} 
            onCancel={closeModal} 
            footer={null}
            maskClosable={true}
            centered
            width={600}
            style={{ 
                top: 20,
                padding: '20px',
                borderRadius: '6px',
                background: '#fff',
            }}
        >
            <div className="p-4">
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Tên nhà xuất bản</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.name || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Số điện thoại</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.phone_number || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Địa chỉ</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.address || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Email</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.email || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Ngày tạo</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.created_at ? moment(data.created_at).format('DD/MM/YYYY') : 'Chưa có thông tin'}
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}

export default memo(ShowInfoPublisher);
