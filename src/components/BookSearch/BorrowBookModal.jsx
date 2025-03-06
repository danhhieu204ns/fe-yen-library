import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, InputNumber, Button, Alert, Descriptions, Spin, Image, Typography, Row, Col } from 'antd';
import { BookOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useBorrowApi from '../../services/manageBorrowService';
import { toast } from 'react-toastify';
import moment from 'moment';

const { Title, Text } = Typography;

const BorrowBookModal = ({ visible, book, onCancel }) => {
  const { createBorrow } = useBorrowApi();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [expectedReturnDate, setExpectedReturnDate] = useState(null);
  
  // Reset form when modal opens or book changes
  useEffect(() => {
    if (visible && book) {
      form.resetFields();
      setExpectedReturnDate(null);
      // Initialize with default values
      form.setFieldsValue({
        borrowDays: 7,
        borrowDate: moment()
      });
      // Update return date with default values
      updateExpectedReturnDate();
    }
  }, [visible, book]);

  // Update expected return date when borrow date or borrow days change
  const updateExpectedReturnDate = () => {
    const borrowDate = form.getFieldValue('borrowDate');
    const borrowDays = form.getFieldValue('borrowDays');
    
    if (borrowDate && borrowDays) {
      const returnDate = moment(borrowDate).add(borrowDays, 'days');
      setExpectedReturnDate(returnDate);
    } else {
      setExpectedReturnDate(null);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError(null);
    
    try {
      // Calculate due date based on borrow date and borrow days
      const borrowDate = values.borrowDate.format('YYYY-MM-DD');
      
      const borrowData = {
        book_id: book.id,
        borrow_date: borrowDate,  
        duration: values.borrowDays
      };
      
      const response = await createBorrow(borrowData);
      
      if (response && response.status === 201) {
        toast.success('Đăng kí mượn sách thành công! Hãy đến thư viện để nhận sách nhé!');
        onCancel(); // Close modal after success
      } else {
        setError('Có lỗi xảy ra khi mượn sách. Vui lòng thử lại.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi mượn sách. Vui lòng thử lại.');
      console.error('Error borrowing book:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Generate date validation based on library policy
  const disabledDate = (current) => {
    // Can't select days before today
    return current && current < moment().startOf('day');
  };

  // Ensure all object properties are converted to strings
  const safeRender = (value) => {
    if (value === null || value === undefined) return ''; 
    if (typeof value === 'object') {
      // Check if it has a name property we can use
      return value.name || JSON.stringify(value);
    }
    return String(value);
  };

  if (!book) {
    return null;
  }

  return (
    <Modal
      title={
        <div className="flex items-center text-lg font-medium">
          <BookOutlined className="mr-2" /> Đăng kí mượn sách
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="borrow-modal"
    >
      <div className="py-4">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex justify-center">
            <Image
              width={150}
              src={book.coverImage || 'https://via.placeholder.com/150x200?text=No+Cover'}
              alt={typeof book.name === 'string' ? book.name : 'Book cover'}
              fallback="https://via.placeholder.com/150x200?text=No+Cover"
              className="rounded shadow-sm"
            />
          </div>
          <div className="flex-grow">
            <Title level={4}>{safeRender(book.name)}</Title>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tác giả">
                {book.author ? safeRender(book.author) : 'Chưa rõ'}
              </Descriptions.Item>
              <Descriptions.Item label="Thể loại">
                {book.category ? safeRender(book.category) : 'Chưa rõ'}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà xuất bản">
                {safeRender(book.publisher) || 'Chưa rõ'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
          initialValues={{
            borrowDays: 7,
            borrowDate: moment()
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="borrowDate"
                label={
                  <span className="flex items-center">
                    <CalendarOutlined className="mr-1" /> Ngày mượn
                  </span>
                }
                rules={[{ required: true, message: 'Hãy chọn ngày mượn' }]}
              >
                <DatePicker 
                  disabledDate={disabledDate} 
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  onChange={updateExpectedReturnDate}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="borrowDays"
                label="Số ngày mượn"
                rules={[
                  { required: true, message: 'Hãy nhập số ngày mượn' },
                  { type: 'number', min: 1, max: 7, message: 'Số ngày mượn từ 1-7 ngày' }
                ]}
              >
                <InputNumber 
                  min={1} 
                  max={7} 
                  style={{ width: '100%' }} 
                  onChange={updateExpectedReturnDate}
                />
              </Form.Item>
            </Col>
          </Row>
          
          {expectedReturnDate && (
            <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-200">
              <div className="flex items-center text-blue-700">
                <InfoCircleOutlined className="mr-2" />
                <span className="font-medium">Ngày trả dự kiến: {expectedReturnDate.format('DD/MM/YYYY')}</span>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded-md mb-6 border border-gray-200">
            <Text type="secondary" className="text-sm">
              <strong>Điều khoản mượn sách:</strong> Sách có thể được mượn trong tối đa 7 ngày. 
              Trả sách trễ hạn có thể phải chịu phí phạt. Vui lòng giữ gìn tài liệu thư viện cẩn thận.
            </Text>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={book.available_copies <= 0}
            >
              Xác nhận mượn sách
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default BorrowBookModal;
