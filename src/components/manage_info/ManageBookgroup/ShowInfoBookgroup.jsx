import { memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';

function ShowInfoBookgroup({ openModal, closeModal, data }) {
    return (
        <Modal title="Thông tin nhóm sách" open={openModal} onCancel={closeModal} onOk={closeModal} maskClosable={false}>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên nhóm sách</Typography>
                    <Input
                        placeholder="Tên nhóm sách"
                        disabled
                        value={data?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tình trạng</Typography>
                    <Input
                        placeholder="Tình trạng"
                        disabled
                        value={data?.status}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Nội dung</Typography>
                    <Input.TextArea
                        placeholder="Nội dung"
                        disabled
                        value={data?.content}
                        className="disabled:bg-white disabled:text-black"
                        rows={4}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tác giả</Typography>
                    <Input
                        placeholder="Tác giả"
                        disabled
                        value={data?.author?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Nhà xuất bản</Typography>
                    <Input
                        placeholder="Nhà xuất bản"
                        disabled
                        value={data?.publisher?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Thể loại</Typography>
                    <Input
                        placeholder="Thể loại"
                        disabled
                        value={data?.genre?.name}
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

export default memo(ShowInfoBookgroup);
