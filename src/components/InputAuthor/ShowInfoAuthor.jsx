import { memo } from 'react';
import { Typography, Col, Row, Modal } from 'antd';
import moment from 'moment';
import { modalStyle, contentStyle, valueStyle, labelStyle } from '../common/InfoModalStyle';

function ShowInfoAuthor({ openModal, closeModal, data }) {
    return (
        <Modal
            title="Thông tin tác giả"
            open={openModal}
            onCancel={closeModal}
            {...modalStyle}
        >
            <div style={contentStyle}>
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Tên tác giả</Typography.Text>
                        <div style={valueStyle}>
                            {data?.name || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Ngày sinh</Typography.Text>
                        <div style={valueStyle}>
                            {data?.birthdate ? moment(data.birthdate).format('DD/MM/YYYY') : 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Địa chỉ</Typography.Text>
                        <div style={valueStyle}>
                            {data?.address || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Bút danh</Typography.Text>
                        <div style={valueStyle}>
                            {data?.pen_name || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Tiểu sử</Typography.Text>
                        <div style={valueStyle}>
                            {data?.biography || 'Chưa có thông tin'}
                        </div>
                    </Col>
                    <Col span={24}>
                        <Typography.Text style={labelStyle}>Ngày tạo</Typography.Text>
                        <div style={valueStyle}>
                            {data?.created_at ? moment(data.created_at).format('DD/MM/YYYY') : 'Chưa có thông tin'}
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}

export default memo(ShowInfoAuthor);
