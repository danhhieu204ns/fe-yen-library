import { Table, Space, Button, Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled, CheckOutlined } from '@ant-design/icons';
import { yellow, red } from '@ant-design/colors';
import { useEffect, useState } from 'react';

import { useFeeApi } from 'src/services/feeService';
import { useFilterApi } from 'src/services/filterService';
import EditStudent from './EditStudent';
import ShowInfo from './ShowInfo';
import { getColumnSearchProps } from 'src/utils/searchByApi';
import dayjs from 'dayjs';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function StudentFeeTable({
    selectedRowKeyCallback,
    setTotalEntry,
    filter,
    reload
}){
    const [studentList, setStudentList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalRecord, setEditModalRecord] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoModalRecord, setInfoModalRecord] = useState(null);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [currentFilters, setCurrentFilters] = useState();
    const [filteredCohort, setFilteredCohort] = useState([]);
    const [filterRequestBody, setFilterRequestBody] = useState();

    const [classInCohort, setClassInCohort] = useState();
    const [classNeedFilter, setClassNeedFilter] = useState(false);

    const [searchMode, setSearchMode] = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const filterService = useFilterApi();
    const feeService = useFeeApi();

    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender){
            console.log("Reload triggered");
            triggerReload();    
        }  
    }, [reload]);

    useEffect(() => {
        const fetchStudentData = async () => {
            const result = await feeService.getAllStudentFeeByPage(currentPage, pageSize);
            setStudentList(result?.data?.student);
            setTotalPages(result?.data?.total_pages);
            setTotalEntry(result?.data?.total_data)
        }

        if (!searchMode) fetchStudentData();

    }, [reloadToggle, currentPage, pageSize, searchMode])

    useEffect(() => {
        const fetchFilteredStudentData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await feeService.searchStudentFee(filterRequestBody, currentPage, pageSize);
            setStudentList(res?.data?.student_tuition_fee_ids);
            setTotalEntry(res?.data?.total_data);
            setTotalPages(res?.data?.total_pages);
        }

        if (searchMode) fetchFilteredStudentData(); // Chỉ chạy khi trong search mode
    }, [reloadToggle, currentPage, pageSize, searchMode, filterRequestBody])

    // If filter change => Search using those params
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
    }, [JSON.stringify(currentFilters)])

    // Get all class available in selected cohort as filter
    useEffect(() => {
        const getClassFilterInCohort = async () => {
            console.log('Get all class available in cohort')
            let res = await filterService.getClassInCohort({list_id: filteredCohort});
            let classInCohort = res?.data?.student_class_ids;
            console.log(classInCohort);
            let mappedClass = classInCohort.map((entry) => {
                return {
                    text: entry?.class_name,
                    value: entry.id
                }
            })
            setClassInCohort(mappedClass);
        }

        if (filteredCohort && filteredCohort.length>0){
            getClassFilterInCohort();    
            setClassNeedFilter(true);
        } 
        else setClassNeedFilter(false);
    }, [filteredCohort])

    const deleteStudent = async (id) => {
        const result = await feeService.deleteStudentFeeById(id);
    }

    const triggerReload = () => {
        setReloadToggle((prev) => !prev)
    }

    const showInfoModal = () => {
        if (selectedRowKeys.length==0) setInfoModalOpen(true); // Prevent accidental popup when mis-click selection
    }

    const onSelectedRowKeysChange = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey)
        selectedRowKeyCallback(newSelectedRowsKey, newSelectedRowsRecord)
        console.log(newSelectedRowsRecord)
    }

    const resetSearch = () => {
        setSearchMode(false);
    };

    const onTableChange = async (pagination, filters, sorter, extra) => {
        console.log(filters);
        let cleanedFilters = filters;
        cleanedFilters.student_code = cleanedFilters.student_code?cleanedFilters.student_code[0]:null;
        cleanedFilters.full_name = cleanedFilters.full_name?cleanedFilters.full_name[0]:null;

        setFilteredCohort(filters.student_cohort_id);
        setCurrentFilters(cleanedFilters);
    }

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
            align: 'center',
            ...getColumnSearchProps('Mã sinh viên', 'student_code'),
            sorter: (a, b) => a.student_code - b.student_code,
        },
        {
            title: 'Họ tên',
            key: 'full_name',
            dataIndex: 'full_name',
            align: 'center',
            ...getColumnSearchProps('Họ tên', 'full_name'),
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
        },
        {
            title: 'Lớp',
            key: 'student_class_id',
            dataIndex: ['student_class_id', "1"], // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
            align: 'center',
            filters: !classNeedFilter?filter.class_list:classInCohort,
            filterSearch: true,
            sorter: (a, b) => a.student_class_id[0] - b.student_class_id[0],
        },
        {
            title: 'Khoá',
            key: 'student_cohort_id',
            dataIndex: ['student_cohort_id', "1"], // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
            align: 'center',
            filters: filter.cohort_list,
            filterSearch: true,
            sorter: (a, b) => a.student_cohort_id[0] - b.student_cohort_id[0],
        },
        {
            title: 'Đã nộp học phí',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            filters: [
                {text: 'Đã đóng', value: true},
                {text: 'Chưa đóng', value: false}
            ],
            sorter: (a, b) => a.status - b.status,
            render: (value) => {
                if (value==true) return <CheckOutlined />
            }
        },
        {
            title: 'Kỳ học',
            key: 'semester_id',
            dataIndex: ['semester_id', '1'],
            align: 'center',
            filters: filter.semester_list,
            sorter: (a, b) => a.semester_id[0] - b.semester_id[0],
        },
        {
            title: 'Thời gian cập nhật',
            key: 'write_date',
            dataIndex: 'write_date',
            align: 'center',
            render: (updateDate) => dayjs(updateDate, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
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
                                <EditOutlined className='text-slate-900 font-[300]'/>
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
                                        onCancel() {},
                                    };
                                    await modal.confirm(config);
                                }}
                            >
                                <DeleteOutlined style={{ color: '#ffffff' }} />
                            </Button>    
                        </Tooltip>
                    </Space>    
                )
            }
        }
    ]
    return (
        <>
            <Table  columns={columns}
                    dataSource={studentList}
                    onChange={onTableChange}
                    scroll={{
                        x:1300, // Not working
                    }}
                    pagination={{
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize); // Might have unintended side effects
                            console.log(totalPages);
                        },
                        pageSize: pageSize,
                        total: totalPages*pageSize,
                        showSizeChanger: true
                    }}
                    rowKey={(record) => record.id}
                    onRow={(record, index) => {
                        return({
                            onClick: event => {
                                console.log(`${record.student_code} clicked`);
                                setInfoModalRecord(record);
                                showInfoModal();
                            }
                        })
                    }}    
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectedRowKeysChange,
                    }}
                    />
            <ShowInfo open={infoModalOpen}
                        onCancel={() => setInfoModalOpen(false)}
                        record={infoModalRecord} />
            <EditStudent open={editModalOpen} 
                        onCancel={() => setEditModalOpen(false)} 
                        reload={triggerReload}
                        record={editModalRecord} 
                        selections={{semester_list: filter.semester_list}}/> 

            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </>
    )
}

export default StudentFeeTable;