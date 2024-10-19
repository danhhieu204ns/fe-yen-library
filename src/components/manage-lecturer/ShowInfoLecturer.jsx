import { memo } from 'react';
import { Modal, Row, Col, Input, Typography } from 'antd';

function ShowInfoLecturer({ data, openModal, closeModal }) {
    return (
        <Modal open={openModal} onCancel={closeModal} onOk={closeModal}>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Typography>Tên giảng viên</Typography>
                    <Input disabled className="disabled:bg-white disabled:text-black" value={data?.lecturer_name} />
                </Col>
                <Col span={12}>
                    <Typography>Học hàm/Học vị</Typography>
                    <Input disabled className="disabled:bg-white disabled:text-black" value={data?.hoc_ham_hoc_vi} />
                </Col>
                <Col span={12}>
                    <Typography>Số điện thoại</Typography>
                    <Input
                        disabled
                        className="disabled:bg-white disabled:text-black"
                        value={data?.phone_number || ''}
                    />
                </Col>
                <Col span={12}>
                    <Typography>Email</Typography>
                    <Input value={data?.email || ''} disabled className="disabled:bg-white disabled:text-black" />
                </Col>
                <Col span={12}>
                    <Typography>CH/TG</Typography>
                    <Input value={data?.ch_tg} disabled className="disabled:bg-white disabled:text-black" />
                </Col>
            </Row>
        </Modal>
    );
}

export default memo(ShowInfoLecturer);
