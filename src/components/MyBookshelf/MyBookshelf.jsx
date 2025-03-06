import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';

const MyBookshelf = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Mock data cho sách
  useEffect(() => {
    const mockBooks = [
      { id: 1, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', category: 'Tâm lý', image: 'https://salt.tikicdn.com/cache/w1200/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg' },
      { id: 2, title: 'Atomic Habits', author: 'James Clear', category: 'Kĩ năng sống', image: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg' },
      { id: 3, title: 'Dạy Con Làm Giàu', author: 'Robert Kiyosaki', category: 'Tài chính', image: 'https://salt.tikicdn.com/cache/w1200/media/catalog/product/d/a/day-con-lam-giau-01_1.jpg' },
      { id: 4, title: 'Nhà Giả Kim', author: 'Paulo Coelho', category: 'Tiểu thuyết', image: 'https://salt.tikicdn.com/cache/w1200/ts/product/66/25/66/460b68f4883607698a0c50cecb0413a5.jpg' },
      { id: 5, title: 'Tư Duy Phản Biện', author: 'Richard Paul', category: 'Tư duy', image: 'https://salt.tikicdn.com/cache/w1200/ts/product/22/cb/a9/524a27dcd45e8a13ae6eecb3dfacba7c.jpg' },
      { id: 6, title: 'Điểm Đến Của Cuộc Đời', author: 'Nguyên Phong', category: 'Tâm lý', image: 'https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg' },
    ];
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  // Lọc sách theo search term
  useEffect(() => {
    const filtered = books.filter(
      book => book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  // Lọc sách theo danh mục
  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === 'Tất cả') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => book.category === category);
      setFilteredBooks(filtered);
    }
  };

  // Lấy các danh mục duy nhất từ sách
  const categories = ['Tất cả', ...new Set(books.map(book => book.category))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 pt-16">
        <h1 className="text-3xl font-bold mb-6">Tủ sách của tôi</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sách..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter />
              <span>Lọc</span>
              <FiChevronDown className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-48 p-4 bg-white border rounded-lg shadow-lg z-10">
                <h4 className="font-semibold mb-2">Danh mục</h4>
                <ul>
                  {categories.map((category) => (
                    <li 
                      key={category} 
                      className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${activeCategory === category ? 'bg-blue-100 text-blue-600 font-medium' : ''}`}
                      onClick={() => filterByCategory(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-blue-700">{books.length}</h3>
          <p className="text-blue-600">Tổng số sách</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-green-700">{books.filter(book => book.category === 'Tâm lý').length}</h3>
          <p className="text-green-600">Sách tâm lý</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-amber-700">{books.filter(book => book.category === 'Kĩ năng sống').length}</h3>
          <p className="text-amber-600">Sách kĩ năng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow" key={book.id}>
              <div className="relative">
                <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">{book.category}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">Không tìm thấy sách phù hợp</div>
        )}
      </div>
    </div>
  );
};

export default MyBookshelf;
