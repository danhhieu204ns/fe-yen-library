import { memo, useState } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import useManageInfoApi from 'src/services/manageBookgroupService'; // Cập nhật service tương ứng
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

const { Option } = Select;

function CreateBookGroup({ openModal, closeModal, handleReload }) {
    const [bookGroupInfo, setBookGroupInfo] = useState({
        name: '',
        status: '',
        content: '',
        author_id: null,
        publisher_id: null,
        genre_id: null,
    });
    const [errorMessages, setErrorMessages] = useState('');

    const { createBookGroup } = useManageInfoApi();

    const handleCreateBookGroup = async () => {
        const { name, status, content, author_id, publisher_id, genre_id } = bookGroupInfo;

        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên nhóm sách');
            return;
        }

        // Kiểm tra các trường bắt buộc khác
        if (!status || !content || author_id === null || publisher_id === null || genre_id === null) {
            setErrorMessages('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Gửi request tạo nhóm sách
        const result = await createBookGroup({
            name: name.trim(),
            status: status.trim(),
            content: content.trim(),
            author_id,
            publisher_id,
            genre_id,
        });

        if (result?.name === 'AxiosError') {
            toast.error('Tạo nhóm sách thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setBookGroupInfo({
                name: '',
                status: '',
                content: '',
                author_id: null,
                publisher_id: null,
                genre_id: null,
            });
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Tạo nhóm sách thành công');
        }
    };

    const handleChange = (key, value) => {
        setBookGroupInfo({
            ...bookGroupInfo,
            [key]: value,
        });
        setErrorMessages('');
    };

    return (
        <Modal
            title="Tạo nhóm sách"
            open={openModal}
            onCancel={() => {
                setBookGroupInfo({
                    name: '',
                    status: '',
                    content: '',
                    author_id: null,
                    publisher_id: null,
                    genre_id: null,
                });
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleCreateBookGroup}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên nhóm sách</Typography>
                    <Input
                        placeholder="Nhập tên nhóm sách"
                        value={bookGroupInfo.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Trạng thái</Typography>
                    <Select
                        placeholder="Chọn trạng thái"
                        value={bookGroupInfo.status}
                        onChange={(value) => handleChange('status', value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Ngưng hoạt động</Option>
                    </Select>
                </Col>
                <Col span={24}>
                    <Typography>Nội dung</Typography>
                    <Input.TextArea
                        placeholder="Nhập nội dung"
                        value={bookGroupInfo.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tác giả</Typography>
                    <Select
                        placeholder="Chọn tác giả"
                        value={bookGroupInfo.author_id}
                        onChange={(value) => handleChange('author_id', value)}
                        style={{ width: '100%' }}
                    >
                        {/* Thêm danh sách tác giả ở đây */}
                        <Option value={1}>Tác giả 1</Option>
                        <Option value={2}>Tác giả 2</Option>
                        {/* ... */}
                    </Select>
                </Col>
                <Col span={24}>
                    <Typography>Nhà xuất bản</Typography>
                    <Select
                        placeholder="Chọn nhà xuất bản"
                        value={bookGroupInfo.publisher_id}
                        onChange={(value) => handleChange('publisher_id', value)}
                        style={{ width: '100%' }}
                    >
                        {/* Thêm danh sách nhà xuất bản ở đây */}
                        <Option value={1}>Nhà xuất bản 1</Option>
                        <Option value={2}>Nhà xuất bản 2</Option>
                        {/* ... */}
                    </Select>
                </Col>
                <Col span={24}>
                    <Typography>Thể loại</Typography>
                    <Select
                        placeholder="Chọn thể loại"
                        value={bookGroupInfo.genre_id}
                        onChange={(value) => handleChange('genre_id', value)}
                        style={{ width: '100%' }}
                    >
                        {/* Thêm danh sách thể loại ở đây */}
                        <Option value={1}>Thể loại 1</Option>
                        <Option value={2}>Thể loại 2</Option>
                        {/* ... */}
                    </Select>
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(CreateBookGroup);
