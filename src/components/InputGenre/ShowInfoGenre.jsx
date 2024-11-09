import { memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';

function ShowInfoGenre({ openModal, closeModal, data }) { // Đổi tên component
    return (
        <Modal title="Thông tin thể loại" open={openModal} onCancel={closeModal} onOk={closeModal} maskClosable={false}>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên thể loại</Typography> {/* Thay đổi tiêu đề */}
                    <Input
                        placeholder="Tên thể loại"
                        disabled
                        value={data?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Độ tuổi giới hạn</Typography> 
                    <Input
                        placeholder="Độ tuổi giới hạn"
                        disabled
                        value={data?.age_limit}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Mô tả</Typography> {/* Nếu có mô tả cho thể loại */}
                    <Input.TextArea
                        placeholder="Mô tả"
                        disabled
                        value={data?.description} // Giả sử bạn có thuộc tính mô tả
                        className="disabled:bg-white disabled:text-black"
                        rows={4}
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

export default memo(ShowInfoGenre); // Đổi tên export thành ShowInfoGenre
