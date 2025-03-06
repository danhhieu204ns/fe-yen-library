import React from 'react';
import { Modal, Row, Col, Typography, Tag, Divider, Descriptions, Rate, Image, Space } from 'antd';
import { BookOutlined, UserOutlined, CalendarOutlined, TagOutlined, CopyOutlined, ReadOutlined, GlobalOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const BookDetailsModal = ({ visible, book, onCancel }) => {
  if (!book) return null;

  // Ensure all object properties are converted to strings or React elements
  const safeRender = (value) => {
    if (value === null || value === undefined) return ''; 
    if (typeof value === 'object') {
      // Check if it has a name property we can use
      return value.name || JSON.stringify(value);
    }
    return value.toString();
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      title={<Title level={4} className="flex items-center"><BookOutlined className="mr-2" /> Chi tiết sách</Title>}
      className="rounded-lg overflow-hidden"
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8} md={8} lg={8}>
          <div className="flex justify-center mb-4 bg-gray-100 rounded p-2 shadow">
            <Image 
              src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'}
              alt={safeRender(book.name)}
              className="max-w-full h-auto max-h-[300px] object-contain"
              fallback="https://via.placeholder.com/300x400?text=No+Cover"
            />
          </div>
          <div className="flex flex-col items-center my-4">
            <Rate disabled defaultValue={parseFloat(book.rating) || 0} />
            <Text>{book.rating ? `${book.rating}/5` : 'Chưa có đánh giá'}</Text>
          </div>
          <div className="flex justify-center mt-3">
            <Tag 
              color={parseInt(book.available_copies) > 0 ? 'green' : 'red'} 
              className="px-2 py-1 text-sm"
            >
              {parseInt(book.available_copies) > 0 
                ? `${book.available_copies} cuốn có sẵn` 
                : 'Hiện không có sẵn'}
            </Tag>
          </div>
        </Col>
        
        <Col xs={24} sm={16} md={16} lg={16}>
          <Title level={3}>{safeRender(book.name)}</Title>
          <Space direction="vertical" size="large" className="w-full">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label={<div className="flex items-center"><UserOutlined className="mr-1" /> Tác giả</div>}>
                {book?.author?.name ? book?.author?.name : 'Chưa rõ tác giả'}
              </Descriptions.Item>
              <Descriptions.Item label={<div className="flex items-center"><TagOutlined className="mr-1" /> Thể loại</div>}>
                {book?.category?.name ? book?.category?.name : 'Chưa rõ thể loại'}
              </Descriptions.Item>
            </Descriptions>
            
            <div>
              <Divider orientation="left">Mô tả</Divider>
              <Paragraph className="text-justify leading-relaxed max-h-[200px] overflow-y-auto p-3 border-l-4 border-blue-500 bg-gray-50 rounded">
                {safeRender(book.summary) || 'Chưa có mô tả cho sách này.'}
              </Paragraph>
            </div>
            
            <div>
              <Divider orientation="left">Thông tin khác</Divider>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Paragraph>
                    <ReadOutlined className="text-blue-500 mr-1" /> <strong>Số trang:</strong> {safeRender(book.pages) || 'Chưa rõ'}
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph>
                    <GlobalOutlined className="text-blue-500 mr-1" /> <strong>Ngôn ngữ:</strong> {safeRender(book.language) || 'Chưa rõ'}
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph>
                    <HomeOutlined className="text-blue-500 mr-1" /> <strong>Nhà xuất bản:</strong> {safeRender(book.publisher) || 'Chưa rõ'}
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph>
                    <BookOutlined className="text-blue-500 mr-1" /> <strong>Tổng số cuốn:</strong> {parseInt(book.total_copies) || 0}
                  </Paragraph>
                </Col>
              </Row>
            </div>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default BookDetailsModal;
