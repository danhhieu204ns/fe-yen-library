import { memo } from 'react';
import { Input, Typography, Col, Row, Modal, Divider } from 'antd';
import moment from 'moment';

function ShowInfoCategory({ openModal, closeModal, data }) {
    return (
        <Modal 
            title="Thông tin thể loại" 
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
                <Row gutter={[16, 8]}>
                    <Col span={24}>
                        <Typography.Text strong>Tên thể loại</Typography.Text>
                        <Input
                            disabled
                            value={data?.name}
                            className="mt-1 disabled:bg-white disabled:text-black"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong>Độ tuổi giới hạn</Typography.Text>
                        <Input
                            disabled
                            value={data?.age_limit}
                            className="mt-1 disabled:bg-white disabled:text-black"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong>Mô tả</Typography.Text>
                        <Input.TextArea
                            disabled
                            value={data?.description}
                            className="mt-1 disabled:bg-white disabled:text-black"
                            rows={3}
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong>Ngày tạo</Typography.Text>
                        <Input
                            disabled
                            value={data?.created_at ? moment(data.created_at).format('DD/MM/YYYY') : 'Chưa có thông tin'}
                            className="mt-1 disabled:bg-white disabled:text-black"
                        />
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}

export default memo(ShowInfoCategory);
