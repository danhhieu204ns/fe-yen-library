import { memo } from 'react';
import { Modal, Row, Col, Typography } from 'antd';
import { modalStyle, contentStyle, valueStyle, labelStyle } from '../common/InfoModalStyle';

const ShowInfoBook = ({ data, openModal, closeModal }) => {
  return (
    <Modal
        title="Thông tin sách"
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
                    <Typography.Text style={labelStyle}>Tóm tắt</Typography.Text>
                    <div style={valueStyle}>
                        {data?.summary || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Số trang</Typography.Text>
                    <div style={valueStyle}>
                        {data?.pages || 'Chưa có thông tin'}
                    </div>
                </Col>
                <Col span={24}>
                    <Typography.Text style={labelStyle}>Ngôn ngữ</Typography.Text>
                    <div style={valueStyle}>
                        {data?.language || 'Chưa có thông tin'}
                    </div>
                </Col>
            </Row>
        </div>
    </Modal>
  );
};

export default memo(ShowInfoBook);
