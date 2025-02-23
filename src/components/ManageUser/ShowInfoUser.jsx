import { Modal, Descriptions } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { modalStyle } from '../common/InfoModalStyle';

const ShowInfoUser = ({ data, openModal, closeModal }) => {
    return (
        <Modal
            title="Thông tin người dùng"
            open={openModal}
            onCancel={closeModal}
            {...modalStyle}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Tên người dùng">{data?.username || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Họ và Tên">{data?.full_name || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Email">{data?.email || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{data?.phone_number || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{data?.address || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                    {data?.roles && data.roles.length > 0 
                        ? data.roles.map(role => (
                            <span 
                                key={role}
                                className={`inline-block px-2 py-1 m-1 rounded-full text-xs
                                    ${role.toLowerCase() === 'admin' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-blue-100 text-blue-800'}`}
                            >
                                {role.toUpperCase()}
                            </span>
                        ))
                        : 'N/A'
                    }
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {data?.created_at ? moment(data.created_at).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

ShowInfoUser.propTypes = {
    data: PropTypes.object,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired
};

export default ShowInfoUser;
