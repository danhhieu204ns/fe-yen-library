import { memo } from 'react';
import { Modal, Row, Col, Typography } from 'antd';
import { modalStyle, contentStyle, valueStyle, labelStyle } from '../common/InfoModalStyle';

const ShowInfoBookCopy = ({ data, openModal, closeModal }) => {

    return (
        <Modal
            title="Thông tin bản sao sách"
            open={openModal}
            onCancel={closeModal}
            {...modalStyle}
        >
            <div style={contentStyle}>
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Tên sách</Typography.Text>
                        <div style={valueStyle}>
                            {data?.book?.name || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Kệ sách</Typography.Text>
                        <div style={valueStyle}>
                            {data?.bookshelf?.name || 'Chưa có thông tin'}
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

export default memo(ShowInfoBookCopy);
