import { useState, useEffect, memo } from 'react';
import { Input, Typography, Col, Row, Modal, Select } from 'antd';
import useManageBookApi from 'src/services/manageBookService';
import useManageAuthorApi from 'src/services/manageAuthorService';
import useManagePublisherApi from 'src/services/managePublisherService';
import useManageCategoryApi from 'src/services/manageCategoryService';
import { toast } from 'react-toastify';
import ErrorMessage from 'src/utils/error/errorMessage';

const { TextArea } = Input;

function CreateBook({ openModal, closeModal, handleReload }) {
    const [name, setName] = useState('');
    const [authorId, setAuthorId] = useState(null);
    const [publisherId, setPublisherId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [summary, setSummary] = useState('');
    const [pages, setPages] = useState('');
    const [language, setLanguage] = useState('');
    const [errorMessages, setErrorMessages] = useState('');
    const [loading, setLoading] = useState(false);

    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);

    const { createBook } = useManageBookApi();
    const { allAuthorNames } = useManageAuthorApi();
    const { allPublisherNames } = useManagePublisherApi();
    const { allCategories } = useManageCategoryApi();

    useEffect(() => {
        if (openModal) {
            fetchDropdownData();
        }
    }, [openModal]);

    const fetchDropdownData = async () => {
        try {
            const [authorsRes, publishersRes, categoriesRes] = await Promise.all([
                allAuthorNames(),
                allPublisherNames(),
                allCategories()
            ]);
            setAuthors(authorsRes.authors || []);
            setPublishers(publishersRes.publishers || []);
            setCategories(categoriesRes.categories || []);
        } catch (error) {
            toast.error('Lỗi khi tải dữ liệu!');
        }
    };

    const handleCreateBook = async () => {
        if (!name || name.trim().length === 0) {
            setErrorMessages('Vui lòng nhập tên sách');
            return;
        }
        if (!authorId) {
            setErrorMessages('Vui lòng chọn tác giả');
            return;
        }
        if (!publisherId) {
            setErrorMessages('Vui lòng chọn nhà xuất bản');
            return;
        }
        if (!categoryId) {
            setErrorMessages('Vui lòng chọn thể loại');
            return;
        }

        try {
            setLoading(true);
            const bookData = {
                name: name.trim(),
                author_id: authorId,
                publisher_id: publisherId,
                category_id: categoryId,
                summary: summary.trim(),
                pages: pages.trim(),
                language: language.trim()
            };

            const response = await createBook(bookData);
            
            if (response?.status === 201 || response?.status === 200) {
                toast.success('Tạo mới thành công!');
                resetForm();
                closeModal();
                handleReload();
            } else {
                toast.error('Tạo mới thất bại!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Tạo mới thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setAuthorId(null);
        setPublisherId(null);
        setCategoryId(null);
        setSummary('');
        setPages('');
        setLanguage('');
        setErrorMessages('');
    };

    const filterOption = (input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Modal
            title={<div className="text-lg">Tạo mới sách</div>}
            open={openModal}
            onCancel={() => {
                resetForm();
                closeModal();
            }}
            onOk={handleCreateBook}
            confirmLoading={loading}
            maskClosable={false}
            centered
            width={600}
            style={{ 
                top: 20,
                padding: '20px',
                borderRadius: '6px',
                background: '#fff',
            }}
        >
            <div className="p-4">
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tên sách:</Typography.Text>
                        <Input
                            placeholder="Nhập tên sách"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrorMessages('');
                            }}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tác giả:</Typography.Text>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Tìm kiếm hoặc chọn tác giả"
                            optionFilterProp="children"
                            value={authorId}
                            onChange={(value) => {
                                setAuthorId(value);
                                setErrorMessages('');
                            }}
                            filterOption={filterOption}
                            className="mt-2"
                        >
                            {authors.map(author => (
                                <Select.Option key={author.id} value={author.id}>
                                    {author.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Nhà xuất bản:</Typography.Text>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Tìm kiếm hoặc chọn nhà xuất bản"
                            optionFilterProp="children"
                            value={publisherId}
                            onChange={(value) => {
                                setPublisherId(value);
                                setErrorMessages('');
                            }}
                            filterOption={filterOption}
                            className="mt-2"
                        >
                            {publishers.map(publisher => (
                                <Select.Option key={publisher.id} value={publisher.id}>
                                    {publisher.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Thể loại:</Typography.Text>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Tìm kiếm hoặc chọn thể loại"
                            optionFilterProp="children"
                            value={categoryId}
                            onChange={(value) => {
                                setCategoryId(value);
                                setErrorMessages('');
                            }}
                            filterOption={filterOption}
                            className="mt-2"
                        >
                            {categories.map(category => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Tóm tắt:</Typography.Text>
                        <TextArea
                            placeholder="Nhập tóm tắt nội dung sách"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={4}
                            className="mt-2"
                            style={{ resize: 'none' }}
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Số trang:</Typography.Text>
                        <Input
                            placeholder="Nhập số trang"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <Col span={24}>
                        <Typography.Text strong className="text-base">Ngôn ngữ:</Typography.Text>
                        <Input
                            placeholder="Nhập ngôn ngữ"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mt-2"
                        />
                    </Col>
                    <ErrorMessage message={errorMessages} />
                </Row>
            </div>
        </Modal>
    );
}

export default memo(CreateBook);
