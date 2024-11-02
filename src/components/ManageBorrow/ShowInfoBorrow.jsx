import { memo } from 'react';
import { Input, Typography, Col, Row, Modal } from 'antd';

function ShowInfoBorrow({ openModal, closeModal, data }) {
    return (
        <Modal title="Thông tin mượn sách" open={openModal} onCancel={closeModal} onOk={closeModal} maskClosable={false}>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên sách</Typography>
                    <Input
                        placeholder="Tên sách"
                        disabled
                        value={data?.book?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tên người dùng</Typography>
                    <Input
                        placeholder="Tên người dùng"
                        disabled
                        value={data?.user?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tên nhân viên</Typography>
                    <Input
                        placeholder="Tên nhân viên"
                        disabled
                        value={data?.staff?.name}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Thời hạn (ngày)</Typography>
                    <Input
                        placeholder="Thời hạn"
                        disabled
                        value={data?.duration}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Trạng thái</Typography>
                    <Input
                        placeholder="Trạng thái"
                        disabled
                        value={data?.status}
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={24}>
                    <Typography>Ngày tạo</Typography>
                    <Input
                        placeholder="Ngày tạo"
                        disabled
                        value={data?.created_at} // Giả sử bạn có thuộc tính created_at
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
            </Row>
        </Modal>
    );
}

export default memo(ShowInfoBorrow);
