import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { List, Button, Modal } from 'antd';
import { toast } from 'react-toastify';
import { selectCurrentToken, selectedCurrentUser } from '../../redux/auth/authSlice';
import useBorrowApi from 'src/services/manageBorrowService';

function MyBookCart() {
    const [borrowingOrders, setBorrowingOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectedCurrentUser);
    const { getBorrowsByUser, cancelBorrow } = useBorrowApi();

    useEffect(() => {
        const fetchBorrowingOrders = async () => {
            if (!token) {
                toast.error('Bạn cần đăng nhập để xem giỏ sách của mình');
                return;
            }
            try {
                const response = await getBorrowsByUser(user.id);
                setBorrowingOrders(response);
            } catch (error) {
                toast.error('Không thể tải dữ liệu đơn mượn');
            }
        };
        fetchBorrowingOrders();
    }, [token, user.id]);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelBorrow(orderId);
            setBorrowingOrders(borrowingOrders.map(order => 
                order.id === orderId ? { ...order, status: "Đã hủy" } : order
            ));
            toast.success('Hủy đơn mượn thành công');
        } catch (error) {
            toast.error('Hủy đơn mượn thất bại');
        }
    };

    // Hàm xác định màu nền cho trạng thái
    const getStatusStyle = (status) => {
        switch (status) {
          case 'Đang chờ xác nhận':
            return 'bg-yellow-400 text-white px-2 py-1 rounded';
          case 'Đang mượn':
            return 'bg-blue-400 text-white px-2 py-1 rounded';
          case 'Đã trả':
            return 'bg-green-400 text-white px-2 py-1 rounded';
          case 'Đã quá hạn':
            return 'bg-red-400 text-white px-2 py-1 rounded';
          case 'Đã hủy':
            return 'bg-gray-400 text-white px-2 py-1 rounded';
          default:
            return '';
        }
    };

    return (
        <div className="mt-[60px]" style={{ padding: '20px' }}>
            <div className="flex justify-center">
                <h1 className="text-2xl mt-[8px] mb-[10px]">Giỏ sách của tôi</h1>
            </div>
            <div>
                {borrowingOrders?.length > 0 ? (
                    <List
                        bordered
                        dataSource={borrowingOrders}
                        renderItem={(order) => (
                            <List.Item key={order.id}>
                                <List.Item.Meta
                                    title={
                                        <a 
                                            onClick={() => handleViewOrder(order)} 
                                            style={{ fontWeight: 'bold', fontSize: '16px' }}
                                        >
                                            {order.book.name}
                                        </a>
                                    }
                                    description={
                                        <>
                                            <span>Tác giả: {order.book.author.name} | Thể loại: {order.book.genre.name}</span>
                                            <br />
                                            <span 
                                                className={getStatusStyle(order.status)}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '5px',
                                                    display: 'inline-block',
                                                    marginTop: '5px',
                                                }}
                                            >
                                                Trạng thái: {order.status}
                                            </span>
                                        </>
                                    }
                                />
                                {order.status === 'Đang chờ xác nhận' && (
                                    <Button 
                                        danger 
                                        onClick={() => handleCancelOrder(order.id)}
                                    >
                                        Hủy đơn mượn
                                    </Button>
                                )}
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>Không có đơn mượn nào.</p>
                )}
            </div>

            {/* Modal xem chi tiết đơn mượn */}
            <Modal
                title="Thông tin đơn mượn"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedOrder && (
                    <>
                        <p><strong>Tên người dùng:</strong> {user?.name}</p>
                        <p><strong>Tên sách:</strong> {selectedOrder.book.name}</p>
                        <p><strong>Tác giả:</strong> {selectedOrder.book.author.name}</p>
                        <p><strong>Thể loại:</strong> {selectedOrder.book.genre.name}</p>
                        <p><strong>Thời gian mượn:</strong> {selectedOrder.duration} ngày</p>
                        <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default MyBookCart;
