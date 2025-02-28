import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button, Spin } from 'antd';
import { toast } from 'react-toastify';
import { useUserApi } from 'src/services/userService';
import useManageBorrowApi from 'src/services/manageBorrowService';
import useBookApi from 'src/services/manageBookService';

function CreateBorrow({ openModal, closeModal, handleReload }) {
    const [form] = Form.useForm();
    const { createBorrow } = useManageBorrowApi();
    const { getUserFullName, getAdminName } = useUserApi();
    const { bookName } = useBookApi();

    const [users, setUsers] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [books, setBooks] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (openModal) {
            setLoading(true);
            const fetchData = async () => {
                try {
                    const userData = await getUserFullName();
                    setUsers(userData?.users || []);

                    const staffData = await getAdminName();
                    setStaffs(staffData?.users || []);

                    const bookData = await bookName();
                    setBooks(bookData?.data?.books || []);
                    setFilteredBooks(bookData?.data?.books || []);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [openModal]);

    useEffect(() => {
        if (books?.length > 0 && searchTerm) {
            const filtered = books.filter(book => 
                book.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBooks(filtered);
        } else {
            setFilteredBooks(books || []);
        }
    }, [searchTerm, books]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const result = await createBorrow({
                user_id: values.user_id,
                book_id: values.book_id,
                staff_id: values.staff_id,
                duration: values.duration
            });

            if (result.status === 201) {
                toast.success('Tạo thông tin mượn sách thành công');
                handleReload();
                form.resetFields();
                closeModal();
            } else {            
                toast.error(`Tạo thông tin mượn sách thất bại. ${result.data.detail}`);
            }

        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    return (
        <Modal
            title="Tạo thông tin mượn sách"
            open={openModal}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Tạo
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="create_borrow"
                    initialValues={{ duration: 7 }}
                >
                    <Form.Item
                        name="book_id"
                        label="Sách"
                        rules={[{ required: true, message: 'Vui lòng chọn sách!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn sách"
                            optionFilterProp="children"
                            onSearch={handleSearch}
                            filterOption={false}
                        >
                            {Array.isArray(filteredBooks) && filteredBooks.map(book => (
                                <Select.Option key={book.id} value={book.id}>
                                    {book.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="user_id"
                        label="Người dùng"
                        rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn người dùng"
                            optionFilterProp="children"
                            filterOption={(input, option) => 
                                (option?.children || '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {Array.isArray(users) && users.map(user => (
                                <Select.Option key={user.id} value={user.id}>
                                    {user.full_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="staff_id"
                        label="Nhân viên"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn nhân viên"
                            optionFilterProp="children"
                            filterOption={(input, option) => 
                                (option?.children || '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {Array.isArray(staffs) && staffs.map(staff => (
                                <Select.Option key={staff.id} value={staff.id}>
                                    {staff.full_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="duration"
                        label="Thời hạn (ngày)"
                        rules={[{ required: true, message: 'Vui lòng nhập thời hạn!' }]}
                    >
                        <Input type="number" min={1} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}

export default CreateBorrow;
