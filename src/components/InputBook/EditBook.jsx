import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Select, DatePicker } from 'antd';
import moment from 'moment';
import useManageBookApi from 'src/services/manageBookService';
import useAuthorApi from 'src/services/manageAuthorService';
import useGenreApi from 'src/services/manageGenreService';
import usePublisherApi from 'src/services/managePublisherService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

const { Option } = Select;

function EditBookgroup({ openModal, closeModal, handleReload, data }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [content, setContent] = useState('');
    const [authorId, setAuthorId] = useState(null);
    const [publisherId, setPublisherId] = useState(null);
    const [genreId, setGenreId] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [genres, setGenres] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');

    const { editBook } = useManageBookApi();
    const { allAuthors } = useAuthorApi();
    const { allGenres } = useGenreApi();
    const { allPublishers } = usePublisherApi();

    useEffect(() => {
        // Fetch lists of authors, publishers, and genres for dropdown options
        const loadDropdowns = async () => {
            setAuthors(await allAuthors());
            setPublishers(await allPublishers());
            setGenres(await allGenres());
        };
        loadDropdowns();
        
        if (data) {
            setName(data?.name || '');
            setStatus(data?.status || '');
            setContent(data?.content || '');
            setAuthorId(data?.author?.id || null);
            setPublisherId(data?.publisher?.id || null);
            setGenreId(data?.genre?.id || null);
        }
    }, [data]);

    const handleEditBook = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên sách');
            return;
        }

        const updatedData = {
            name: name.trim(),
            status: status.trim(),
            content: content.trim(),
            author_id: authorId,
            publisher_id: publisherId,
            genre_id: genreId,
        };
        
        const result = await editBook(data.id, updatedData);

        if (result?.name === 'AxiosError' && result?.response?.status === 409) {
            setErrorMessages('Sách đã tồn tại');
            return;
        }

        if (result?.name === 'AxiosError') {
            toast.error('Cập nhật sách thất bại. Vui lòng thử lại!');
            return;
        }

        if (result?.data) {
            setName('');
            setStatus('');
            setContent('');
            setAuthorId(null);
            setPublisherId(null);
            setGenreId(null);
            setErrorMessages('');
            closeModal();
            handleReload();
            toast.success('Cập nhật sách thành công');
        }
    };

    return (
        <Modal
            title="Sửa thông tin sách"
            open={openModal}
            onCancel={() => {
                setName('');
                setStatus('');
                setContent('');
                setAuthorId(null);
                setPublisherId(null);
                setGenreId(null);
                setErrorMessages('');
                closeModal();
            }}
            onOk={handleEditBook}
            maskClosable={false}
        >
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <Typography>Tên sách</Typography>
                    <Input
                        placeholder="Nhập tên sách"
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
                    <Select
                        placeholder="Chọn tác giả"
                        value={authorId}
                        onChange={setAuthorId}
                        style={{ width: '100%' }}
                    >
                        {authors.map((author) => (
                            <Option key={author.id} value={author.id}>
                                {author.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={24}>
                    <Typography>Nhà xuất bản</Typography>
                    <Select
                        placeholder="Chọn nhà xuất bản"
                        value={publisherId}
                        onChange={setPublisherId}
                        style={{ width: '100%' }}
                    >
                        {publishers.map((publisher) => (
                            <Option key={publisher.id} value={publisher.id}>
                                {publisher.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={24}>
                    <Typography>Thể loại</Typography>
                    <Select
                        placeholder="Chọn thể loại"
                        value={genreId}
                        onChange={setGenreId}
                        style={{ width: '100%' }}
                    >
                        {genres.map((genre) => (
                            <Option key={genre.id} value={genre.id}>
                                {genre.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <ErrorMessage message={errorMessages} />
            </Row>
        </Modal>
    );
}

export default memo(EditBookgroup);
