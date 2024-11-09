import { memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';

function ShowInfoAuthor({ openModal, closeModal, data }) {
    return (
        <Modal title="Thông tin tác giả" open={openModal} onCancel={closeModal} onOk={closeModal} maskClosable={false}>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên tác giả</Typography>
                    <Input
                        placeholder="Tên tác giả"
                        disabled
                        value={data?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Ngày sinh</Typography>
                    <Input
                        placeholder="Ngày sinh"
                        disabled
                        value={data?.birthdate}
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
                    <Typography>Bút danh</Typography>
                    <Input
                        placeholder="Bút danh"
                        disabled
                        value={data?.pen_name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tiểu sử</Typography>
                    <Input.TextArea
                        placeholder="Tiểu sử"
                        disabled
                        value={data?.biography}
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

export default memo(ShowInfoAuthor);
