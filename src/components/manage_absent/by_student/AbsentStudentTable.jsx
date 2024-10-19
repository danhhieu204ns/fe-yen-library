import { Table, Space, Button, Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { yellow, red } from '@ant-design/colors';
import { useEffect, useState } from 'react';

import { useAbsentApi } from 'src/services/absentService';
import { useFilterApi } from 'src/services/filterService';
import EditStudent from './EditStudent';
import dayjs from 'dayjs';
import ShowInfo from './ShowInfo';
import { getColumnSearchDateProps, getColumnSearchProps} from 'src/utils/searchByApi';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function AbsentStudentTable({
    selectedRowKeyCallback,
    setTotalEntry,
    filter,
    reload,
    hiddenColumns
}) {
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
    const [filteredSemester, setFilteredSemester] = useState([]);
    const [filterRequestBody, setFilterRequestBody] = useState();

    const [subjectInSemester, setSubjectInSemester] = useState();
    const [subjectNeedFilter, setSubjectNeedFilter] = useState(false);

    const [searchMode, setSearchMode] = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const absentService = useAbsentApi();
    const filterService = useFilterApi();

    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender){
            console.log("Reload triggered");
            triggerReload();    
        }  
    }, [reload]);

    useEffect(() => {
        const fetchStudentData = async () => {
            console.log("Fetching data by page!")
            const result = await absentService.getAllAbsentStudentByPage(currentPage, pageSize);
            setStudentList(result?.data?.student_absent_ids);
            setTotalPages(result?.data?.total_pages);
            setTotalEntry(result?.data?.total_data);
        }

        if (!searchMode) fetchStudentData();

    }, [reloadToggle, currentPage, pageSize, searchMode])

    useEffect(() => {
        const fetchFilteredStudentData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await absentService.searchAbsentStudent(filterRequestBody, currentPage, pageSize);
            setStudentList(res?.data?.student_info);
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
            let isFilter = false;
            if(currentFilters==null) return;
            Object.keys(currentFilters).forEach((field) => {
                if (currentFilters[field]){
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

    // Get all subject available in selected semester as filter
    useEffect(() => {
        const getSubjectFilterInSemester = async () => {
            console.log('Get all subject available in semester')
            let res = await filterService.getSubjectInSemester({list_id: filteredSemester});
            let subjectInSemester = res?.data?.subject_ids
            console.log(subjectInSemester);
            let mappedSubject = subjectInSemester.map((entry) => {
                return {
                    text: `${entry?.subject_code} - ${entry?.subject_name}`,
                    value: entry.id
                }
            })
            setSubjectInSemester(mappedSubject);
        }

        if (filteredSemester && filteredSemester.length>0){
            getSubjectFilterInSemester();    
            setSubjectNeedFilter(true);
        } 
        else setSubjectNeedFilter(false);
    }, [filteredSemester])

    const deleteStudent = async (id) => {
        const result = await absentService.deleteAbsentStudentById(id);
    }

    const triggerReload = () => {
        setReloadToggle((prev) => !prev)
    }

    const showInfoModal = () => {
        if (selectedRowKeys.length==0) setInfoModalOpen(true); // Prevent accidental popup when mis-click selection
    }

    const onSelectedRowKeysChange = (newSelectedRowsKey, newSelectedRowsRecord) => {
        setSelectedRowKeys(newSelectedRowsKey);
        selectedRowKeyCallback(newSelectedRowsKey, newSelectedRowsRecord);
        console.log(newSelectedRowsRecord);
    }

    const resetSearch = () => {
        setSearchMode(false);
    };

    const onTableChange = async (pagination, filters, sorter, extra) => {
        console.log(filters);
        let cleanedFilters = filters;
        cleanedFilters.student_code = cleanedFilters.student_code?cleanedFilters.student_code[0]:null;
        cleanedFilters.full_name = cleanedFilters.full_name?cleanedFilters.full_name[0]:null;
        setFilteredSemester(filters.semester_id);
        setCurrentFilters(cleanedFilters);
    }

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
            align: 'center',
            ...getColumnSearchProps("Mã Sinh Viên", "student_code"),
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
            filters: filter?.class_list,
            filterSearch: true,
            sorter: (a, b) => a.student_class_id[0] - b.student_class_id[0],
        },
        {
            title: 'Số tiết vắng',
            key: 'number_lesson_absent',
            dataIndex: 'number_lesson_absent',
            align: 'center',
            width: '90px',
            sorter: (a, b) => a.number_lesson_absent - b.number_lesson_absent,
        },
        {
            title: 'Ngày vắng',
            key: 'date_absent',
            dataIndex:  'date_absent',
            align: 'center',
            ...getColumnSearchDateProps('Ngày vắng', 'date_absent'),
            sorter: (a, b) => String(a.date_absent).localeCompare(b.date_absent),
            render: (text) => dayjs(text, "YYYY-MM-DD").format("DD/MM/YYYY").toString()
        },
        {
            title: 'Môn học',
            key: 'subject_id',
            dataIndex: ['subject_id', '1'],
            align: 'center',
            filters: !subjectNeedFilter?filter.subject_list:subjectInSemester,
            filterSearch: true,
            sorter: (a, b) => a.subject_id[0] - b.subject_id[0],
        },
        {
            title: 'Kỳ học',
            key: 'semester_id',
            dataIndex: ['semester_id', '1'],
            align: 'center',
            filters: filter?.semester_list,
            sorter: (a, b) => a.semester_id[0] - b.semester_id[0],
        },
        {
            title: 'Lý do',
            key: 'reason',
            dataIndex: 'reason',
            align: 'center',
            sorter: (a, b) => String(a.reason).localeCompare(String(b.reason)),
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
            <Table  columns={columns.filter((column) => !hiddenColumns.includes(column.key))}
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
            <EditStudent open={editModalOpen} 
                        onCancel={() => setEditModalOpen(false)} 
                        reload={triggerReload}
                        record={editModalRecord} 
                        selections={{subject_list: filter.subject_list, semester_list: filter.semester_list}}/>
            <ShowInfo open={infoModalOpen}
                    onCancel={() => setInfoModalOpen(false)}
                    record={infoModalRecord} />
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </>
    )
}

export default AbsentStudentTable;