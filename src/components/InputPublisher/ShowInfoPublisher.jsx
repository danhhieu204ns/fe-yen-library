import { memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';

function ShowInfoPublisher({ openModal, closeModal, data }) {
    return (
        <Modal title="Thông tin nhà xuất bản" open={openModal} onCancel={closeModal} onOk={closeModal} maskClosable={false}>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên nhà xuất bản</Typography>
                    <Input
                        placeholder="Tên nhà xuất bản"
                        disabled
                        value={data?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Số điện thoại</Typography>
                    <Input
                        placeholder="Số điện thoại"
                        disabled
                        value={data?.phone_number}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Địa chỉ</Typography>
                    <Input
                        placeholder="Địa chỉ"
                        disabled
                        value={data?.address}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Email</Typography>
                    <Input
                        placeholder="Email"
                        disabled
                        value={data?.email}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Ngày tạo</Typography> 
                    <Input
                        placeholder="Ngày tạo"
                        disabled
                        value={data?.created_at} // Giả sử bạn có thuộc tính createdAt
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
            </Row>
        </Modal>
    );
}

export default memo(ShowInfoPublisher);
