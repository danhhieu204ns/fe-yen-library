import { Table, Space, Button, Modal, Tooltip } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { useStudentApi } from 'src/services/studentService';
import EditStudent from './EditStudent';
import dayjs from 'dayjs';
import ShowInfo from './ShowInfo';
import { getColumnSearchProps} from 'src/utils/searchByApi';
import Typography from 'antd/es/typography/Typography';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function StudentTable({
    selectedRowKeyCallback=(keys, record)=>{}, // Trả lại dòng select cho parent
    setTotalEntry=(entry) => {}, // Set tổng số
    filter, // Nhận filter từ parent, tránh fetch nhiều
    reload=false, // Parent thông qua prop này để reload Table
    callback=null, // Callback thông tin khi ở dạng Popup
    popupMode=false, // Mode hiển thị trong popup
    hiddenColumns=[]
}) {
    const [studentList, setStudentList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [totalPages, setTotalPages] = useState();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalRecord, setEditModalRecord] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoModalRecord, setInfoModalRecord] = useState(null);

    const [currentFilters, setCurrentFilters] = useState();
    const [searchMode, setSearchMode] = useState(false);

    const [filterRequestBody, setFilterRequestBody] = useState();

    const [modal, contextHolder] = Modal.useModal();
    const studentService = useStudentApi();
    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender){
            console.log("Reload triggered");
            triggerReload();    
        }  
    }, [reload]);

    // Fetch student data by page
    useEffect(() => {
        const fetchStudentData = async () => {
            console.log("Fetching data for table. Should only happen once!");
            const result = await studentService.getAllStudentByPage(currentPage, pageSize);
            setStudentList(result?.data?.student_ids); // Data guaranteed to be <= pageSize
            setTotalPages(result?.data?.total_pages);
            setTotalEntry(result?.data?.total_data);
        };

        if (!searchMode) fetchStudentData(); // Nếu đang có search thì ko đc fetch gì khi thay đổi page hay pageSize
    }, [reloadToggle, currentPage, pageSize, searchMode]);

    useEffect(() => {
        const fetchFilteredStudentData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await studentService.searchStudent(filterRequestBody, currentPage, pageSize);
            setStudentList(res?.data?.student_info);
            setTotalEntry(res?.data?.total_data);
            setTotalPages(res?.data?.total_pages);
        }

        if (searchMode) fetchFilteredStudentData(); // Chỉ chạy khi trong search mode
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

    const deleteStudent = async (id) => {
        const result = await studentService.deleteStudentById(id);
    };

    const triggerReload = () => {
        setReloadToggle((prev) => !prev);
    };

    const showInfoModal = () => {
        if (selectedRowKeys.length == 0) setInfoModalOpen(true); // Prevent accidental popup when mis-click selection
    };

    const onSelectedRowKeysChange = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        selectedRowKeyCallback(newSelectedRowsKey, newSelectedRowsRecord);
        console.log(newSelectedRowsRecord);
    };

    const resetSearch = () => {
        console.log("Exit search mode! Resetting");
        setSearchMode(false);
    };

    // Update khi filter thay đổi
    const onTableChange = async (pagination, filters, sorter, extra) => {
        console.log(filters);
        let cleanedFilters = filters;
        // Gỡ array với những field cần search
        cleanedFilters.student_code = cleanedFilters.student_code ? cleanedFilters.student_code[0] : null;
        cleanedFilters.full_name = cleanedFilters.full_name ? cleanedFilters.full_name[0] : null;
        setCurrentFilters(cleanedFilters);
    }

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
            align: 'center',
            fixed: 'left',
            width: 120,
            ...getColumnSearchProps('Mã sinh viên','student_code'),
            sorter: (a, b) => a.student_code - b.student_code,
        },
        {
            title: 'Họ tên',
            key: 'full_name',
            dataIndex: 'full_name',
            align: 'center',
            fixed: 'left',
            width: 120,
            ...getColumnSearchProps('Họ tên', 'full_name'),
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
        },
        {
            title: 'Lớp',
            key: 'student_class_id',
            dataIndex: ['student_class_id', '1'], // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
            align: 'center',
            fixed: 'left',
            width: 130,
            filters: filter.class_list,
            filterSearch: true,
            sorter: (a, b) => a.student_class_id[0] - b.student_class_id[0],
        },
        {
            title: 'Giới tính',
            key: 'sex',
            dataIndex: 'sex',
            align: 'center',
            width: 90,
            filters: [
                {
                    text: 'Nam',
                    value: 'male',
                },
                {
                    text: 'Nữ',
                    value: 'female',
                },
            ],
            sorter: (a, b) => a.sex.localeCompare(b.sex),
            render: (text) => {
                if (text === 'male') return "Nam"
                else return "Nữ"
            }
        },
        {
            title: 'Ngày sinh',
            key: 'date_of_birth',
            dataIndex: 'date_of_birth',
            align: 'center',
            width: 110,
            sorter: (a, b) => String(a.date_of_birth).localeCompare(b.date_of_birth),
            render: (text) => dayjs(text, 'YYYY-MM-DD').format('DD/MM/YYYY').toString(),
        },
        {
            title: 'Số điện thoại',
            key: 'phone_number',
            dataIndex: 'phone_number',
            align: 'center',
            width: 120,
            sorter: (a, b) => a.phone_number - b.phone_number,
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
            align: 'center',
            width: 120,
            sorter: (a, b) => String(a.email).localeCompare(b.email),
        },
        {
            title: 'Địa chỉ thường trú',
            key: 'dia_chi_tt',
            dataIndex: 'dia_chi_tt',
            align: 'center',
            width: 200,
            sorter: (a, b) => String(a.dia_chi_tt).localeCompare(b.dia_chi_tt),
        },
        {
            title: 'Họ và tên cha',
            key: 'ho_va_ten_cha',
            dataIndex: 'ho_va_ten_cha',
            align: 'center',
            width: 120,
            sorter: (a, b) => String(a.ho_va_ten_cha).localeCompare(b.ho_va_ten_cha),
        },
        {
            title: 'Số điện thoại cha',
            key: 'so_dien_thoai_cha',
            dataIndex: 'so_dien_thoai_cha',
            align: 'center',
            width: 120,
            sorter: (a, b) => String(a.so_dien_thoai_cha).localeCompare(b.so_dien_thoai_cha),
        },
        {
            title: 'Họ và tên mẹ',
            key: 'ho_va_ten_me',
            dataIndex: 'ho_va_ten_me',
            align: 'center',
            width: 120,
            sorter: (a, b) => String(a.ho_va_ten_me).localeCompare(b.ho_va_ten_me),
        },
        {
            title: 'Số điện thoại mẹ',
            key: 'so_dien_thoai_me',
            dataIndex: 'so_dien_thoai_me',
            align: 'center',
            width: 120,
            sorter: (a, b) => String(a.so_dien_thoai_me).localeCompare(b.so_dien_thoai_me),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            width: 120,
            filters: [
                {
                    text: 'Đang học',
                    value: 'Đang học',
                },
                {
                    text: 'Đã tốt nghiệp',
                    value: 'Đã tốt nghiệp',
                },
                {
                    text: 'Chuyển ngành',
                    value: 'Chuyển ngành'
                },
                {
                    text: 'Thôi học',
                    value: 'Thôi học'
                }
            ],
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (record) => {
                return (
                    <Space>
                        <Tooltip title="Sửa">
                            <Button
                                shape="circle"
                                className='bg-yellow-300'
                                type='primary'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditModalRecord(record);
                                    setEditModalOpen(true);
                                }}
                            >
                                <EditOutlined className='text-slate-900 font-[300]' />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Xoá">
                            <Button
                                shape="circle"
                                className='bg-red-500'
                                type='primary'
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    let config = {
                                        title: 'Xác nhận xoá',
                                        icon: <ExclamationCircleFilled />,
                                        content: `Bạn có chắc muốn xoá sinh viên ${record.full_name} với mã sinh viên ${record.student_code}?`,
                                        onOk() {
                                            deleteStudent(record.id);
                                            triggerReload();
                                        },
                                        onCancel() { },
                                    };
                                    await modal.confirm(config);
                                }}
                            >
                                <DeleteOutlined style={{ color: '#ffffff' }} />
                            </Button>
                        </Tooltip>

                    </Space>
                );
            },
        },
    ];
    return (
        <>
            <Table
                style={{width: 'calc(100vw - 3.5em)'}}
                columns={columns.filter((column) => !hiddenColumns.includes(column.key))}
                dataSource={studentList}
                onChange={onTableChange}
                // Cuộn khi ở trong popup
                scroll={!popupMode ? {
                    x: 1300 // Không dùng đc nếu ko fix width của table
                } : {
                    y: 300
                }}
                // Tắt pagination nếu đang có search hoặc filter
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
                onRow={(record, index) => {
                    return {
                        onClick: (event) => {
                            if (!popupMode) {
                                console.log(`${record.student_code} clicked`);
                                setInfoModalRecord(record);
                                showInfoModal();
                            }
                            else {
                                if (callback) callback(record);
                            }
                        },
                    };
                }}
                // Ẩn selection khi ở trong popup
                rowSelection={!popupMode ? {
                    type: 'checkbox',
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectedRowKeysChange,
                } : null}
            />
            <ShowInfo open={infoModalOpen} onCancel={() => setInfoModalOpen(false)} record={infoModalRecord} />
            <EditStudent
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                reload={triggerReload}
                record={editModalRecord}
                selections={{ class_list: filter.class_list }}
            />
            {
                contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */
            }
        </>
    )
}

export default StudentTable;