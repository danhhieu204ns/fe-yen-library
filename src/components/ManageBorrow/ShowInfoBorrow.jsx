import React from 'react';
import { Modal, Button, Descriptions, Typography, Space, Tag } from 'antd';

function ShowInfoBorrow({ data, openModal, closeModal }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getStatusTag = (status) => {
        switch (status) {
          case 'Đang chờ xác nhận':
            return <Tag color="warning">Đang chờ xác nhận</Tag>;
          case 'Đang mượn':
            return <Tag color="processing">Đang mượn</Tag>;
          case 'Đã trả':
            return <Tag color="success">Đã trả</Tag>;
          case 'Đã quá hạn':
            return <Tag color="error">Đã quá hạn</Tag>;
          case 'Đã hủy':
            return <Tag color="default">Đã hủy</Tag>;
          default:
            return <Tag>{status}</Tag>;
        }
    };

    return (
        <Modal
            title="Chi tiết thông tin mượn sách"
            open={openModal}
            onCancel={closeModal}
            footer={[
                <Button key="close" type="primary" onClick={closeModal}>
                    Đóng
                </Button>,
            ]}
            width={600}
        >
            {data && Object.keys(data).length > 0 ? (
                <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
                    <Descriptions.Item label="Mã mượn sách">
                        {data.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên sách">
                        {data.book_copy.book?.name || 'Không có tên sách'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người mượn">
                        {data.user?.full_name || 'Không có tên người mượn'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nhân viên phụ trách">
                        {data.staff?.full_name || 'Không có tên nhân viên'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời hạn">
                        {data.duration} ngày
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {getStatusTag(data.status)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {formatDate(data.created_at)}
                    </Descriptions.Item>
                </Descriptions>
            ) : (
                <Typography.Text>Không có dữ liệu</Typography.Text>
            )}
        </Modal>
    );
}

export default ShowInfoBorrow;