import { memo } from 'react';
import { Input, Typography, Col, Row, Modal, Divider } from 'antd';

function ShowInfoCategory({ openModal, closeModal, data }) {
    return (
        <Modal 
            title="Thông tin thể loại" 
            open={openModal} 
            onCancel={closeModal} 
            footer={null}
            centered
            style={{ padding: '24px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Tên thể loại</Typography.Title>
                    <Input
                        placeholder="Tên thể loại"
                        disabled
                        value={data?.name}
                        className="disabled:bg-white disabled:text-black"
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <Divider />
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Độ tuổi giới hạn</Typography.Title>
                    <Input
                        placeholder="Độ tuổi giới hạn"
                        disabled
                        value={data?.age_limit}
                        className="disabled:bg-white disabled:text-black"
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
                <Divider />
                <Col span={24}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Mô tả</Typography.Title>
                    <Input.TextArea
                        placeholder="Mô tả"
                        disabled
                        value={data?.description}
                        className="disabled:bg-white disabled:text-black"
                        rows={4}
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                </Col>
            </Row>
        </Modal>
    );
}

export default memo(ShowInfoCategory);
