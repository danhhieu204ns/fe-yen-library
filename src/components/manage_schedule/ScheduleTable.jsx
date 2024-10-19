import { Table, Space, Button, Modal, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { yellow, red } from '@ant-design/colors';
import { useEffect, useState } from 'react';

import { useScheduleApi } from 'src/services/manageScheduleService';
import { useFilterApi } from 'src/services/filterService';
import EditSchedule from './EditSchedule';
import ShowInfo from './ShowInfo';
import { getColumnSearchProps} from 'src/utils/searchByApi';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function ScheduleTable({
    selectedRowKeyCallback,
    setTotalEntry,
    filter,
    reload
}
) {
    const [scheduleList, setScheduleList] = useState([]);
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
    const [filteredCohort, setFilteredCohort] = useState([]);
    const [filterRequestBody, setFilterRequestBody] = useState();

    const [subjectInSemester, setSubjectInSemester] = useState();
    const [subjectNeedFilter, setSubjectNeedFilter] = useState(false);
    const [classInCohort, setClassInCohort] = useState();
    const [classNeedFilter, setClassNeedFilter] = useState(false);

    const [searchMode, setSearchMode] = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const scheduleService = useScheduleApi();
    const filterService = useFilterApi();

    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        if (!isFirstRender){
            console.log("Reload triggered");
            triggerReload();    
        }  
    }, [reload]);

    useEffect(() => {
        const fetchScheduleData = async () => {
            const result = await scheduleService.getAllScheduleByPage(currentPage, pageSize);
            setScheduleList(result?.data?.teaching_schedule_ids);
            setTotalPages(result?.data?.total_pages);
            setTotalEntry(result?.data?.total_data);
        }

        if (!searchMode) fetchScheduleData();

    }, [reloadToggle, currentPage, pageSize, searchMode])

    useEffect(() => {
        const fetchFilteredScheduleData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await scheduleService.searchSchedule(filterRequestBody, currentPage, pageSize);
            setScheduleList(res?.data?.teaching_schedule_info);
            setTotalEntry(res?.data?.total_data);
            setTotalPages(res?.data?.total_pages);
        }

        if (searchMode) fetchFilteredScheduleData(); // Chỉ chạy khi trong search mode
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

    const deleteSchedule = async (id) => {
        const result = await scheduleService.deleteScheduleById(id);
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
        cleanedFilters.room = cleanedFilters.room?cleanedFilters.room[0]:null;
        setFilteredSemester(filters.semester_id);
        setFilteredCohort(filters.student_cohort_id);
        setCurrentFilters(cleanedFilters);
    }

    const columns = [
        {
            title: 'Lớp',
            key: 'student_class_id',
            dataIndex: ['student_class_id', "1"], // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
            align: 'center',
            filters: !classNeedFilter?filter?.class_list:classInCohort,
            filterSearch: true,
            sorter: (a, b) => a.student_class_id[0] - b.student_class_id[0],
        },
        {
            title: 'Khoá',
            key: 'student_cohort_id',
            dataIndex: ['student_cohort_id', '1'],
            align: 'center',
            width: '90px',
            filters: filter?.cohort_list,
            sorter: (a, b) => a.student_cohort_id[0] - b.student_cohort_id[0],
        },
        {
            title: 'Môn học',
            key: 'subject_id',
            dataIndex: ['subject_id', '1'],
            align: 'center',
            filters: !subjectNeedFilter?filter?.subject_list:subjectInSemester,
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
            title: 'Phòng học',
            key: 'room',
            dataIndex: 'room',
            align: 'center',
            ...getColumnSearchProps('Phòng học', 'room'),
            sorter: (a, b) => String(a.room).localeCompare(String(b.room)),
        },
        {
            title: 'Buổi giảng dạy',
            key: 'teaching_session',
            dataIndex: 'teaching_session',
            align: 'center',
            filters: [
                {text:'Sáng thứ 2', value:'Sáng thứ 2'},
                {text:'Chiều thứ 2', value:'Chiều thứ 2'},
                {text:'Sáng thứ 3', value:'Sáng thứ 3'},
                {text:'Chiều thứ 3', value:'Chiều thứ 3'},
                {text:'Sáng thứ 4', value:'Sáng thứ 4'},
                {text:'Chiều thứ 4', value:'Chiều thứ 4'},
                {text:'Sáng thứ 5', value:'Sáng thứ 5'},
                {text:'Chiều thứ 5', value:'Chiều thứ 5'},
                {text:'Sáng thứ 6', value:'Sáng thứ 6'},
                {text:'Chiều thứ 6', value:'Chiều thứ 6'},
                {text:'Sáng thứ 7', value:'Sáng thứ 7'},
                {text:'Chiều thứ 7', value:'Chiều thứ 7'},
            ],
            sorter: (a, b) => String(a.teaching_session).localeCompare(String(b.teaching_session)),
        },
        {
            title: 'Danh sách giảng viên',
            key: 'lecturer_ids',
            dataIndex: 'lecturer_ids',
            align: 'center',
            filters: filter?.lecturer_list,
            filterSearch: true,
            render: (record) => {
                return(
                    <div className='flex flex-wrap justify-start gap-2'>
                        {record.map(entry => {
                            return(
                                <Tag key={entry.id} className='text-sm rounded-lg bg-white p-1'>
                                    {entry.display_name}
                                </Tag>    
                            )
                        })}
                    </div>
                )
            }
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
                                        content: `Bạn có chắc muốn xoá lịch giảng dạy?`,
                                        onOk() {
                                            deleteSchedule(record.id);
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
                dataSource={scheduleList}
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
            <EditSchedule open={editModalOpen} 
                        onCancel={() => setEditModalOpen(false)} 
                        reload={triggerReload}
                        record={editModalRecord} 
                        selections={{subject_list: filter.subject_list, semester_list: filter.semester_list, class_list: filter.class_list}}/>
            <ShowInfo open={infoModalOpen}
                    onCancel={() => setInfoModalOpen(false)}
                    record={infoModalRecord} />
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </>
    )
}

export default ScheduleTable;