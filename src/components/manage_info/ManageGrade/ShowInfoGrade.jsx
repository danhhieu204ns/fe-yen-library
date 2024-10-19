import { Input, Typography, Col, Row, Modal } from 'antd';

function ShowInfoGrade({ openModal, closeModal, data }) {
    return (
        <Modal title="Tạo kỳ học" open={openModal} onCancel={closeModal} onOk={closeModal} maskClosable={false}>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Khóa</Typography>
                    <Input
                        placeholder="Nhập khóa"
                        type="number"
                        value={data?.number}
                        disabled
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
                <Col span={12}>
                    <Typography>Màu hiển thị</Typography>
                    <Input
                        placeholder="Màu hiển thị"
                        value={data?.color_code}
                        disabled
                        className="disabled:bg-white disabled:text-black"
                    />
                </Col>
            </Row>
        </Modal>
    );
}

export default ShowInfoGrade;
