import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Card, Row, Col, Pagination, Empty, Spin, Tag, Tooltip, Rate } from 'antd';
import { SearchOutlined, BookOutlined, FilterOutlined, ClearOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useBookApi from '../../services/manageBookService';
import useCategoryApi from 'src/services/manageCategoryService';
import useManageAuthorApi from 'src/services/manageAuthorService';
import BorrowBookModal from './BorrowBookModal';
import BookDetailsModal from './BookDetailsModal';

const { Option } = Select;
const { Meta } = Card;

const BookSearch = () => {
  const { bookData, searchBook } = useBookApi();
  const { allCategories } = useCategoryApi();
  const { allAuthors } = useManageAuthorApi();

  const [searchQuery, setSearchQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    categoryId: '',
    authorId: ''
  });
  
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  useEffect(() => {
    fetchCategories();
    fetchAuthors();
  }, [isSearchActive]);

  useEffect(() => {
    if (isSearchActive) {
      fetchSearchBooks();
    } else {
      fetchPageableBooks();
    }
  }, [pagination.current, isSearchActive]);

  // Determine if search is active based on filters and search query
  const checkIfSearchActive = () => {
    if (searchQuery.trim() !== '') return true;
    
    return Object.values(advancedFilters).some(
      value => value !== undefined && value !== null && value !== ''
    );
  };

  // API calls
  const fetchPageableBooks = async () => {
    setLoading(true);
    try {
      const response = await bookData(
        pagination.current, 
        pagination.pageSize
      );
      if (response?.books) {
        setBooks(response.books);
        setPagination({
          ...pagination,
          total: response.total_data || 0
        });
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchBooks = async () => {
    setLoading(true);
    try {
      // Make sure to only include parameters that have values
      const searchParams = {};
      
      // Only add parameters that are not empty/undefined
      if (searchQuery && searchQuery.trim() !== '') {
        searchParams.name = searchQuery.trim();
      }
      
      if (advancedFilters.authorId) {
        // Ensure author_id is sent as a number
        searchParams.author_id = Number(advancedFilters.authorId);
      }
      
      if (advancedFilters.categoryId) {
        // Ensure category_id is sent as a number
        searchParams.category_id = Number(advancedFilters.categoryId);
      }
      
      // Log the formatted parameters
      console.log('Search params:', searchParams);
      
      // Check if we have at least one search parameter
      const hasParams = Object.keys(searchParams).length > 0;
      
      // Only perform search if we have parameters, otherwise use regular bookData
      let response;
      if (hasParams) {
        response = await searchBook(
          searchParams,
          pagination.current,
          pagination.pageSize
        );
      } else {
        // If no search params, use the regular book listing endpoint
        response = await bookData(
          pagination.current, 
          pagination.pageSize
        );
      }
      
      if (response?.books) {
        setBooks(response.books);
        console.log('Search response:', response);
        setPagination({
          ...pagination,
          total: response.total_data || 0
        });
      }
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await allCategories();
      if (response?.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await allAuthors();
      if (response?.authors) {
        setAuthors(response.authors);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  // Event handlers
  const handleSearch = () => {
    const searchActive = checkIfSearchActive();
    setIsSearchActive(searchActive);
    setPagination({ ...pagination, current: 1 });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setAdvancedFilters({
      categoryId: '',
      authorId: ''
    });
    setIsSearchActive(false);
    setPagination({ ...pagination, current: 1 });
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const handleFilterChange = (name, value) => {
    setAdvancedFilters({
      ...advancedFilters,
      [name]: value
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleBorrowBook = (book) => {
    setSelectedBook(book);
    setBorrowModalVisible(true);
  };

  const handleViewBookDetails = (book) => {
    setSelectedBook(book);
    setDetailsModalVisible(true);
  };

  // Get book availability status
  const getAvailabilityStatus = (book) => {
    if (book.total_copies === 0) {
      return { status: 'UNAVAILABLE', text: 'Hiện chưa có sách' };
    }
    
    if (book.available_copies > 0) {
      return { status: 'AVAILABLE', text: `${book.available_copies} có sẵn` };
    } else {
      return { status: 'BORROWED', text: 'Tạm hết' };
    }
  };

  // Add this helper function inside the BookSearch component
  const safeRender = (value) => {
    if (value === null || value === undefined) return ''; 
    if (typeof value === 'object') {
      return value.name || JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="pt-5 mb-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center pt-10">
          <BookOutlined className="mr-2" /> Library Book Search
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <Input
              placeholder="Search books by title, author, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined className="text-gray-400" />}
              suffix={
                <Button type="primary" onClick={handleSearch}>
                  Search
                </Button>
              }
              size="large"
              className="w-full"
            />
          </div>
          <Button 
            icon={<FilterOutlined />} 
            onClick={toggleFilters} 
            className="min-w-[100px]"
          >
            Filters
          </Button>
          
          {isSearchActive && (
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClearSearch}
              className="min-w-[100px]"
            >
              Clear
            </Button>
          )}
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Select
                  placeholder="Select Category"
                  style={{ width: '100%' }}
                  onChange={(value) => handleFilterChange('categoryId', value)}
                  value={advancedFilters.categoryId || undefined}
                  allowClear
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Select
                  placeholder="Select Author"
                  style={{ width: '100%' }}
                  onChange={(value) => handleFilterChange('authorId', value)}
                  value={advancedFilters.authorId || undefined}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {authors.map(author => (
                    <Option key={author.id} value={author.id}>
                      {author.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Select
                  placeholder="Availability"
                  style={{ width: '100%' }}
                  onChange={(value) => handleFilterChange('availability', value)}
                  value={advancedFilters.availability || undefined}
                  allowClear
                >
                  <Option value="available">Available</Option>
                  <Option value="all">All Books</Option>
                </Select>
              </Col>
            </Row>   
            <Row className="mt-4">
              <Col span={24} className="flex justify-end gap-2">
                <Button type="primary" onClick={handleSearch}>
                  Apply Filters
                </Button>
                <Button onClick={handleClearSearch}>
                  Reset
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </div>

      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="mb-4">
              {isSearchActive ? (
                <p className="text-gray-600">Showing search results ({pagination.total} books found)</p>
              ) : (
                <p className="text-gray-600">Showing all books ({pagination.total} total)</p>
              )}
            </div>
            
            <Row gutter={[16, 16]}>
              {books.map(book => {
                const availability = getAvailabilityStatus(book);
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                    <Card
                      hoverable
                      cover={
                        <div className="flex justify-center items-center h-48 bg-gray-100 overflow-hidden">
                          <img 
                            alt={book.name} 
                            src={book.coverImage || 'https://via.placeholder.com/150x200?text=No+Cover'} 
                            className="h-full object-contain"
                          />
                        </div>
                      }
                      className="h-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Meta
                        title={<Tooltip title={safeRender(book.name)}><div className="truncate font-medium">{safeRender(book.name)}</div></Tooltip>}
                        description={
                          <div className="space-y-2">
                            <p className="text-sm text-gray-500">
                              {book.author ? safeRender(book.author) : 'Chưa rõ tác giả'}
                            </p>
                            <Rate disabled defaultValue={parseFloat(book.rating) || 0} className="text-sm" />
                            <div className="flex flex-wrap gap-1">
                              <Tag color="blue">
                                {book.category ? safeRender(book.category) : 'Chưa rõ thể loại'}
                              </Tag>
                              <Tag 
                                color={
                                  availability.status === 'AVAILABLE' ? 'green' :
                                  availability.status === 'BORROWED' ? 'orange' : 'red'
                                }
                              >
                                {availability.text}
                              </Tag>
                            </div>
                            <div className="flex justify-between gap-2 mt-4">
                              <Button 
                                icon={<InfoCircleOutlined />}
                                onClick={() => handleViewBookDetails(book)}
                                className="flex-1 text-xs px-1"
                              >
                                Xem chi tiết
                              </Button>
                              <Button 
                                type="primary" 
                                onClick={() => handleBorrowBook(book)}
                                disabled={availability.status !== 'AVAILABLE'}
                                className="flex-1 text-xs px-1"
                              >
                                Borrow
                              </Button>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
            <div className="flex justify-center mt-8">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Empty 
              description={isSearchActive ? "No books found matching your criteria" : "No books available"} 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          </div>
        )}
      </div>
      
      <BorrowBookModal
        visible={borrowModalVisible}
        book={selectedBook}
        onCancel={() => setBorrowModalVisible(false)}
      />
      
      <BookDetailsModal
        visible={detailsModalVisible}
        book={selectedBook}
        onCancel={() => setDetailsModalVisible(false)}
      />
    </div>
  );
};

export default BookSearch;
