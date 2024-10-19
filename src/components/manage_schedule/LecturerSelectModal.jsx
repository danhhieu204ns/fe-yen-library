import { Table, Space, Button, Modal, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

import useManageLecturerApi from 'src/services/manageLecturerService';
import { useScheduleApi } from 'src/services/manageScheduleService';
import { getColumnSearchProps} from 'src/utils/searchByApi';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function LecturerSelectModal({
    open,
    onCancel,
    onOkCallback,
    selected,
    filter, // Nhận filter từ parent, tránh fetch nhiều
    reload, // Parent thông qua prop này để reload Table
    callback=null, // Callback thông tin khi ở dạng Popup
    popupMode=false, // Mode hiển thị trong popup
}) {
    const [lecturerList, setLecturerList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowRecord, setSelectedRowRecord] = useState([]);

    const [currentFilters, setCurrentFilters] = useState();
    const [filterRequestBody, setFilterRequestBody] = useState();

    const [searchMode, setSearchMode] = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const scheduleService = useScheduleApi();

    const isFirstRender = useIsFirstRender();

    const lecturerService = useManageLecturerApi();

    useEffect(() => {
        if (!isFirstRender){
            console.log("Reload triggered");
            triggerReload();    
        }  
    }, [reload]);

    useEffect(() => {
        setSelectedRowKeys(selected);
        setSearchMode(false);
    }, [open])

    // Fetch student data by page
    useEffect(() => {
        const fetchLecturerData = async () => {
            console.log("Fetching data for table. Should only happen once!")
            const result = await lecturerService.getAllLecturerByPage(currentPage, pageSize);
            setLecturerList(result?.lecturer_ids); // Data guaranteed to be <= pageSize
            setTotalPages(result?.total_pages);
        };

        if (!searchMode) fetchLecturerData(); // Nếu đang có search thì ko đc fetch gì khi thay đổi page hay pageSize
    }, [reloadToggle, currentPage, pageSize, searchMode]);

    useEffect(() => {
        const fetchFilteredLecturerData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await scheduleService.searchLecturer(filterRequestBody, currentPage, pageSize);
            setLecturerList(res?.data?.lecturer_info);
            setTotalPages(res?.data?.total_pages);
        }

        if (searchMode) fetchFilteredLecturerData(); // Chỉ chạy khi trong search mode
    }, [reloadToggle, currentPage, pageSize, searchMode, filterRequestBody])

    // Chạy mỗi khi filter thay đổi
    useEffect(() => {
        const searchUsingFilter = async () => {
            console.log("Filter changed! Compiling request body")
            let body = {}
            let isFilter = false; // Check nếu tất cả các field mà null thì là đang không có filter
            if (currentFilters == null) return;
            Object.keys(currentFilters).forEach((field) => {
                if (currentFilters[field]) {
                    isFilter = true;
                    body[field] = currentFilters[field];
                }
            })
            if (isFilter){
                console.log("Filter exists. Enter search mode");
                setFilterRequestBody(body);
                setSearchMode(true);    
            } 
            else resetSearch();
        }
        searchUsingFilter();
    }, [JSON.stringify(currentFilters)]) // Chuyển sang String để useEffect so sánh vì object ko so sánh đc

    const triggerReload = () => {
        setReloadToggle((prev) => !prev);
    };

    const onSelectedRowKeysChange = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        setSelectedRowRecord(newSelectedRowsRecord);
        console.log(newSelectedRowsRecord);
    };

    const resetSearch = () => {
        setSearchMode(false);
    };

    // Update khi filter thay đổi
    const onTableChange = async (pagination, filters, sorter, extra) => {
        console.log(filters);
        let cleanedFilters = filters;
        // Gỡ array với những field cần search
        cleanedFilters.lecturer_name = cleanedFilters.lecturer_name ? cleanedFilters.lecturer_name[0] : null;
        setCurrentFilters(cleanedFilters);
    }

    const handleCancel = () => {
        onCancel();
    }
    
    const handleOk = () => {
        onOkCallback(selectedRowRecord);
    }


    const columns = [
        {
            title: 'Mã giảng viên',
            dataIndex: 'lecturer_code',
            key: 'lecturer_code',
            align: 'center',
            render: (value) => value?value:''
        },
        {
            title: 'Tên giảng viên',
            dataIndex: 'lecturer_name',
            key: 'lecturer_name',
            align: 'center',
            ...getColumnSearchProps('Giảng viên', 'lecturer_name')
        },
        {
            title: 'Học hàm/Học vị',
            dataIndex: 'hoc_ham_hoc_vi',
            key: 'hoc_ham_hoc_vi',
            align: 'center',
            filters: [
                {text:'Cử nhân', value: 'Cử nhân'},
                {text:'Kỹ sư', value: 'Kỹ sư'},
                {text: 'Thạc sĩ', value: 'Thạc sĩ'},
                {text: 'Tiến sĩ', value: 'Tiến sĩ'},
                {text:'Phó giáo sư', value: 'Phó giáo sư'},
                {text: 'Giáo sư', value: 'Giáo sư'}
            ]
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
        },
        {
            title: 'CH/TG',
            dataIndex: 'ch_tg',
            key: 'ch_tg',
            align: 'center',
            filters: [
                {text:'CH', value: 'CH'},
                {text: 'TG', value: 'TG'}
            ]
        },
    ];
    return (
        <Modal destroyOnClose title="Thêm giảng viên" open={open} onCancel={onCancel} onOk={handleOk} width='60%'>
            <Table
                columns={columns}
                dataSource={lecturerList}
                onChange={onTableChange}
                // Cuộn khi ở trong popup
                scroll={!popupMode ? {

                } : {
                    y: 300
                }}
                pagination={{
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize); // Might have unintended side effects
                        console.log(totalPages);
                    },
                    pageSize: pageSize,
                    total: totalPages * pageSize,
                    showSizeChanger: true
                }}
                rowKey={(record) => record.id}
                // Bình thường: Hiện info. Popup: Trả về kết quả
                // onRow={(record, index) => {
                //     return {
                //         onClick: (event) => {
                //             if (!popupMode) {
                //                 console.log(`${record.student_code} clicked`);
                //                 setInfoModalRecord(record);
                //                 showInfoModal();
                //             }
                //             else {
                //                 if (callback) callback(record);
                //             }
                //         },
                //     };
                // }}
                // Ẩn selection khi ở trong popup
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectedRowKeysChange,
                }}
            />
            {
                contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */
            }
        </Modal>
    )
}

export default LecturerSelectModal;