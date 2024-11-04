import { memo, useEffect, useState } from 'react';
import { Modal, Select, Typography, Col, Row, Card, Alert, Input } from 'antd';
import { toast } from 'react-toastify';
import useBookApi from 'src/services/manageBookService';
import useAuthorApi from 'src/services/manageAuthorService';
import usePublisherApi from 'src/services/managePublisherService';
import useGenreApi from 'src/services/manageGenreService';

function CreateBook({ openModal, closeModal, handleReload }) {
    const [formData, setFormData] = useState({
        name: '',
        status: '',
        content: '',
        author_id: '',
        publisher_id: '',
        genre_id: '',
    });
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [genres, setGenres] = useState([]);
    const [errorMessages, setErrorMessages] = useState('');
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [filteredPublishers, setFilteredPublishers] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);

    const { createBook } = useBookApi();
    const { allAuthors } = useAuthorApi();
    const { allPublishers } = usePublisherApi();
    const { allGenres } = useGenreApi();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authorsData = await allAuthors();
                const publishersData = await allPublishers();
                const genresData = await allGenres();
                setAuthors(authorsData);
                setFilteredAuthors(authorsData); // Khởi tạo bộ lọc
                setPublishers(publishersData);
                setFilteredPublishers(publishersData); // Khởi tạo bộ lọc
                setGenres(genresData);
                setFilteredGenres(genresData); // Khởi tạo bộ lọc
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const handleCreateBook = async () => {
        const { name, status, content, author_id, publisher_id, genre_id } = formData;

        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên sách');
            return;
        }
        if (!status || status.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tình trạng sách');
            return;
        }
        if (!content || content.trim().length === 0) {
            setErrorMessages('Vui lòng nhập nội dung sách');
            return;
        }
        if (!author_id) {
            setErrorMessages('Vui lòng chọn tác giả');
            return;
        }
        if (!publisher_id) {
            setErrorMessages('Vui lòng chọn nhà xuất bản');
            return;
        }
        if (!genre_id) {
            setErrorMessages('Vui lòng chọn thể loại');
            return;
        }

        const result = await createBook(formData);

        if (result?.status === 409) {
            setErrorMessages('Sách đã tồn tại');
            return;
        }
        if (result?.data) {
            setFormData({
                name: '',
                status: '',
                content: '',
                author_id: '',
                publisher_id: '',
                genre_id: ''
            });
            setFilteredAuthors(authors)
            setFilteredGenres(genres)
            setFilteredPublishers(publishers)
            setErrorMessages('');
            toast.success('Tạo sách thành công');
            handleReload();
            closeModal();
        }
    };

    // Lọc theo input cho các trường Select
    const handleAuthorSearch = (input) => {
        const filtered = authors.filter((author) =>
            author.name.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredAuthors(filtered);
    };

    const handlePublisherSearch = (input) => {
        const filtered = publishers.filter((publisher) =>
            publisher.name.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredPublishers(filtered);
    };

    const handleGenreSearch = (input) => {
        const filtered = genres.filter((genre) =>
            genre.name.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredGenres(filtered);
    };

    return (
        <Modal
            title="Tạo sách"
            open={openModal}
            onCancel={closeModal}
            onOk={handleCreateBook}
            maskClosable={false}
        >
            <div className="mx-6">
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        {errorMessages && <Alert message="Lỗi" description={errorMessages} type="error" showIcon />}
                    </Col>
                    <Col span={24}>
                        <Typography.Text className="text-base">Tên sách</Typography.Text>
                        <Input
                            size="large"
                            placeholder="Nhập tên sách"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                setErrorMessages('');
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text className="text-base">Tình trạng</Typography.Text>
                        <Input
                            size="large"
                            placeholder="Nhập tình trạng sách"
                            value={formData.status}
                            onChange={(e) => {
                                setFormData({ ...formData, status: e.target.value });
                                setErrorMessages('');
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text className="text-base">Nội dung</Typography.Text>
                        <Input
                            size="large"
                            placeholder="Nhập nội dung sách"
                            value={formData.content}
                            onChange={(e) => {
                                setFormData({ ...formData, content: e.target.value });
                                setErrorMessages('');
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text className="text-base">Tác giả</Typography.Text>
                        <Select
                            size="large"
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn tác giả"
                            value={formData.author_id}
                            onSearch={handleAuthorSearch}
                            filterOption={false}
                            onChange={(value) => {
                                setFormData({ ...formData, author_id: value });
                                setErrorMessages('');
                            }}
                        >
                            {filteredAuthors.map(author => (
                                <Select.Option key={author.id} value={author.id}>
                                    {author.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={24}>
                        <Typography.Text className="text-base">Nhà xuất bản</Typography.Text>
                        <Select
                            size="large"
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn nhà xuất bản"
                            value={formData.publisher_id}
                            onSearch={handlePublisherSearch}
                            filterOption={false}
                            onChange={(value) => {
                                setFormData({ ...formData, publisher_id: value });
                                setErrorMessages('');
                            }}
                        >
                            {filteredPublishers.map(publisher => (
                                <Select.Option key={publisher.id} value={publisher.id}>
                                    {publisher.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={24}>
                        <Typography.Text className="text-base">Thể loại</Typography.Text>
                        <Select
                            size="large"
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn thể loại"
                            value={formData.genre_id}
                            onSearch={handleGenreSearch}
                            filterOption={false}
                            onChange={(value) => {
                                setFormData({ ...formData, genre_id: value });
                                setErrorMessages('');
                            }}
                        >
                            {filteredGenres.map(genre => (
                                <Select.Option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}

export default memo(CreateBook);
