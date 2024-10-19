import { Table, Space, Button, Modal, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { yellow, red } from '@ant-design/colors';
import { useEffect, useState } from 'react';

import { useFilterApi } from 'src/services/filterService';
import { useAbsentApi } from 'src/services/absentService';
import dayjs from 'dayjs';
import ShowInfo from './ShowInfo';
import { getColumnSearchProps } from 'src/utils/searchByApi';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function AbsentSubjectTable({
    selectedRowKeyCallback,
    setTotalEntry,
    reload,
    filter
}) {
    const [absentSubjectList, setAbsentSubjectList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState();

    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoModalRecord, setInfoModalRecord] = useState(null);

    const [currentFilters, setCurrentFilters] = useState();
    const [filteredSemester, setFilteredSemester] = useState([]);
    const [filteredCohort, setFilteredCohort] = useState([]);
    const [filterRequestBody, setFilterRequestBody] = useState();

    const [subjectInSemester, setSubjectInSemester] = useState();
    const [subjectNeedFilter, setSubjectNeedFilter] = useState(false);
    const [classInCohort, setClassInCohort] = useState();
    const [classNeedFilter, setClassNeedFilter] = useState(false);

    const [searchMode, setSearchMode] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
        const fetchAbsentSubjectData = async () => {
            const result = await absentService.getAllAbsentSubjectByPage(currentPage, pageSize);
            setAbsentSubjectList(result?.data?.student_subject_absent_ids);
            setTotalPages(result?.data?.total_pages);
            setTotalEntry(result?.data?.total_data);
        }

        if(!searchMode) fetchAbsentSubjectData();

    }, [reloadToggle, currentPage, pageSize, searchMode])

    useEffect(() => {
        const fetchFilteredAbsentSubjectData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await absentService.searchAbsentSubject(filterRequestBody, currentPage, pageSize);
            setAbsentSubjectList(res?.data?.student_subject_absent_ids);
            setTotalEntry(res?.data?.total_data);
            setTotalPages(res?.data?.total_pages);
        }

        if (searchMode) fetchFilteredAbsentSubjectData(); // Chỉ chạy khi trong search mode
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
    }, [JSON.stringify(currentFilters)]);

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
    }, [filteredCohort]);

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
        
        filters.student_code = filters.student_code?filters.student_code[0]:null;
        filters.full_name = filters.full_name?filters.full_name[0]:null;

        setFilteredCohort(filters.student_cohort_id);
        setFilteredSemester(filters.semester_id);
        setCurrentFilters(filters);
    }

    const columns = [
        {
            title: 'Mã sinh viên',
            key: 'student_code',
            dataIndex: 'student_code', // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
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
            sorter: (a, b) => a.student_class_id[0] - b.student_class_id[0],
        },
        {
            title: 'Khoá',
            key: 'student_cohort_id',
            dataIndex: ['student_cohort_id', "1"], // Data comes in form: [1, CNTT 15 - 01] => Need nested path (Which probably use student_class_id.get(1) under the hood)
            align: 'center',
            filters: filter.cohort_list,
            sorter: (a, b) => a.student_class_id[0] - b.student_class_id[0],
        },
        {
            title: 'Tổng số tiết vắng',
            key: 'total_lesson_absent',
            dataIndex: 'total_lesson_absent',
            align: 'center',
            sorter: (a, b) => a.total_lesson_absent - b.total_lesson_absent,
        },
        {
            title: 'Phần trăm vắng',
            key: 'percent_absent',
            dataIndex: 'percent_absent',
            align: 'center',
            sorter: (a, b) => a.percent_absent - b.percent_absent,
            render: (percent) => (Math.round(parseFloat(percent) * 100) / 100).toFixed(2) + '%'
        },
        {
            title: 'Môn học',
            key: 'subject_id',
            dataIndex: ['subject_id', '1'],
            align: 'center',
            filters: !subjectNeedFilter?filter.subject_list:subjectInSemester,
            sorter: (a, b) => a.subject_id[0] - b.subject_id[0],
        },
        {
            title: 'Kỳ học',
            key: 'semester_id',
            dataIndex: ['semester_id', '1'],
            align: 'center',
            filters: filter.semester_list,
            sorter: (a, b) => a.semester_id[0] - b.semester_id[0],
        },
    ]
    return (
        <>
            <Table  columns={columns}
                dataSource={absentSubjectList}
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
            {contextHolder /* Modal hook context holder. Should not be placed inside column or modal will trigger onRow??? */} 
        </>
    )
}

export default AbsentSubjectTable;