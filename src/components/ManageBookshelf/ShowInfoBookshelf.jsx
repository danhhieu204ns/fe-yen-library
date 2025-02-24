import { memo } from 'react';
import { Modal, Row, Col, Typography } from 'antd';
import { modalStyle, contentStyle, valueStyle, labelStyle } from '../common/InfoModalStyle';

const ShowInfoBookshelf = ({ data, openModal, closeModal }) => {
  return (
    <Modal
        title="Thông tin kệ sách" // Fixed title
        open={openModal}
        onCancel={closeModal}
        {...modalStyle}
    >
        <div style={contentStyle}>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Tên kệ sách</Typography.Text>
                    <div style={valueStyle}>
                        {data?.name || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Tình trạng</Typography.Text>
                    <div style={valueStyle}>
                        {data?.status || 'Chưa có thông tin'}
                    </div>
                </Col>
            </Row>
        </div>
    </Modal>
  );
};

export default memo(ShowInfoBookshelf);
