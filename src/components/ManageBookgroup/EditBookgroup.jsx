import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, DatePicker } from 'antd';
import moment from 'moment';
import useManageBookgroupApi from 'src/services/manageBookgroupService'; // Giả sử bạn có service này
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

function EditBookgroup({ openModal, closeModal, handleReload, data }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [content, setContent] = useState('');
    const [createdAt, setCreatedAt] = useState(null); // Ngày tạo
    const [author, setAuthor] = useState('');
    const [publisher, setPublisher] = useState('');
    const [genre, setGenre] = useState('');
    const [errorMessages, setErrorMessages] = useState('');

    const { editBookGroup } = useManageBookgroupApi(); // Giả sử bạn có hàm này để gọi API

    useEffect(() => {
        if (data) {
            setName(data?.name || '');
            setStatus(data?.status || '');
            setContent(data?.content || '');
            setCreatedAt(data?.created_at ? moment(data.created_at) : null);
            setAuthor(data?.author?.name || '');
            setPublisher(data?.publisher?.name || '');
            setGenre(data?.genre?.name || '');
        }
    }, [data]);

    const handleEditBookGroup = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên nhóm sách');
            return;
        }

        const updatedData = {
            name: name.trim(),
            status: status.trim(),
            content: content.trim(),
            created_at: createdAt ? createdAt.format('YYYY-MM-DD') : null,
            author: author.trim(),
            publisher: publisher.trim(),
            genre: genre.trim(),
        };

        const result = await editBookGroup(data.id, updatedData);

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Nhóm sách đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Cập nhật nhóm sách thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setName('');
            setStatus('');
            setContent('');
            setCreatedAt(null);
            setAuthor('');
            setPublisher('');
            setGenre('');
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Cập nhật nhóm sách thành công');
        }
    };

    return (
        <Modal
            title="Sửa thông tin nhóm sách"
            open={openModal}
            onCancel={() => {
                setName('');
                setStatus('');
                setContent('');
                setCreatedAt(null);
                setAuthor('');
                setPublisher('');
                setGenre('');
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleEditBookGroup}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên nhóm sách</Typography>
                    <Input
                        placeholder="Nhập tên nhóm sách"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrorMessages('');
                        }}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Trạng thái</Typography>
                    <Input
                        placeholder="Nhập trạng thái"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Nội dung</Typography>
                    <Input.TextArea
                        placeholder="Nhập nội dung"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Tác giả</Typography>
                    <Input
                        placeholder="Nhập tên tác giả"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Nhà xuất bản</Typography>
                    <Input
                        placeholder="Nhập tên nhà xuất bản"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Typography>Thể loại</Typography>
                    <Input
                        placeholder="Nhập thể loại"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditBookgroup);
