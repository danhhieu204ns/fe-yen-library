import { memo } from 'react';
import { Modal, Row, Col, Typography } from 'antd';
import { modalStyle, contentStyle, valueStyle, labelStyle } from '../common/InfoModalStyle';

const ShowInfoBook = ({ data, openModal, closeModal }) => {
  return (
    <Modal
        title="Thông tin sách" // Fixed title
        open={openModal}
        onCancel={closeModal}
        {...modalStyle}
    >
        <div style={contentStyle}>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Tên sách</Typography.Text>
                    <div style={valueStyle}>
                        {data?.name || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Tác giả</Typography.Text>
                    <div style={valueStyle}>
                        {data?.author?.name || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Nhà xuất bản</Typography.Text>
                    <div style={valueStyle}>
                        {data?.publisher?.name || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Thể loại</Typography.Text>
                    <div style={valueStyle}>
                        {data?.category?.name || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Tình trạng</Typography.Text>
                    <div style={valueStyle}>
                        {data?.status || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Nội dung</Typography.Text>
                    <div style={valueStyle}>
                        {data?.summary || 'Chưa có thông tin'}
                    </div>
                </Col>
            </Row>
        </div>
    </Modal>
  );
};

export default memo(ShowInfoBook);
