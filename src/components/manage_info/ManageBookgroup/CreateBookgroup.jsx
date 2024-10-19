import { memo, useEffect, useState } from 'react';
import { Modal, Select, Typography, Col, Row, Card, Alert, Input } from 'antd';
import useBookgroupApi from 'src/services/manageBookgroupService';
import useAuthorApi from 'src/services/manageAuthorService';
import usePublisherApi from 'src/services/managePublisherService';
import useGenreApi from 'src/services/manageGenreService';
import { toast } from 'react-toastify';

function CreateBookgroup({ openModal, closeModal, handleReload }) {
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

    const { createBookgroup, getAllBookgroups } = useBookgroupApi(); // Thêm hàm getAllBookgroups
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
                setPublishers(publishersData);
                setGenres(genresData);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const handleCreateBookGroup = async () => {
        const { name, status, content, author_id, publisher_id, genre_id } = formData;
    
        // Validate input
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
    
        const result = await createBookgroup(formData);
        
        if (result?.status === 409) {
            setErrorMessages('Nhóm sách đã tồn tại');
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
            setErrorMessages('');
            handleReload();
            closeModal();
            toast.success('Tạo nhóm sách thành công');
        }
    };
    

    return (
        <Modal
            title="Tạo nhóm sách"
            open={openModal}
            onCancel={closeModal}
            onOk={handleCreateBookGroup}
            maskClosable={false}
        >
            <Card>
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
                                    setErrorMessages(''); // Reset error messages
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
                                    setErrorMessages(''); // Reset error messages
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
                                    setErrorMessages(''); // Reset error messages
                                }}
                            />
                        </Col>
                        <Col span={24}>
                            <Typography.Text className="text-base">Tác giả</Typography.Text>
                            <Select
                                size="large"
                                style={{ width: '100%' }}  // Đảm bảo độ dài bằng với các trường khác
                                placeholder="Chọn tác giả"
                                value={formData.author_id} // Đảm bảo giá trị hiện tại hiển thị sau khi refresh
                                onChange={(value) => {
                                    setFormData({ ...formData, author_id: value });
                                    setErrorMessages(''); // Reset error messages
                                }}
                            >
                                {authors.map(author => (
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
                                style={{ width: '100%' }}  // Đảm bảo độ dài bằng với các trường khác
                                placeholder="Chọn nhà xuất bản"
                                value={formData.publisher_id} // Đảm bảo giá trị hiện tại hiển thị sau khi refresh
                                onChange={(value) => {
                                    setFormData({ ...formData, publisher_id: value });
                                    setErrorMessages(''); // Reset error messages
                                }}
                            >
                                {publishers.map(publisher => (
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
                                style={{ width: '100%' }}  // Đảm bảo độ dài bằng với các trường khác
                                placeholder="Chọn thể loại"
                                value={formData.genre_id} // Đảm bảo giá trị hiện tại hiển thị sau khi refresh
                                onChange={(value) => {
                                    setFormData({ ...formData, genre_id: value });
                                    setErrorMessages(''); // Reset error messages
                                }}
                            >
                                {genres.map(genre => (
                                    <Select.Option key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Modal>
    );
}

export default memo(CreateBookgroup);
