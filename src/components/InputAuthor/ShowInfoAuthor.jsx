import { memo } from 'react';
import { Typography, Col, Row, Modal, Button } from 'antd';
import moment from 'moment';

function ShowInfoAuthor({ openModal, closeModal, data }) {
    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY');
    };

    return (
        <Modal
            title="Thông tin tác giả"
            open={openModal}
            footer={null}
            onCancel={closeModal}
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
                            <Typography.Text strong>Tên tác giả</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.name || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Ngày sinh</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.birthdate ? formatDate(data.birthdate) : 'Chưa có thông tin'}
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
                            <Typography.Text strong>Bút danh</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white">
                            {data?.pen_name || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="mb-2">
                            <Typography.Text strong>Tiểu sử</Typography.Text>
                        </div>
                        <div className="border rounded px-3 py-[4px] bg-white min-h-[72px] whitespace-pre-wrap">
                            {data?.biography || 'Chưa có thông tin'}
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}

export default memo(ShowInfoAuthor);
