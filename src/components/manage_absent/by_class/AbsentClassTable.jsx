import { Table, Space, Button, Modal, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { yellow, red } from '@ant-design/colors';
import { useEffect, useState } from 'react';

import { useAbsentApi } from 'src/services/absentService';
import { useFilterApi } from 'src/services/filterService';
import dayjs from 'dayjs';
import ShowInfo from './ShowInfo';
import { getColumnSearchDateProps } from 'src/utils/searchByApi';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

function AbsentClassTable({
    reload,
    setTotalEntry,
    selectedRowKeyCallback,
    filter
}) {
    const [absentClassList, setAbsentClassList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState();

    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoModalRecord, setInfoModalRecord] = useState(null);

    const [currentFilters, setCurrentFilters] = useState();
    const [filteredCohort, setFilteredCohort] = useState([]);
    const [filterRequestBody, setFilterRequestBody] = useState();

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
        const fetchAbsentClassData = async () => {
            const result = await absentService.getAllAbsentClassByPage(currentPage, pageSize);
            setAbsentClassList(result?.data?.student_class_absent_ids);
            setTotalPages(result?.data?.total_pages);
            setTotalEntry(result?.data?.total_data);
        }

        if (!searchMode) fetchAbsentClassData()

    }, [reloadToggle, currentPage, pageSize, searchMode]);

    useEffect(() => {
        const fetchFilteredScheduleData = async () => {
            console.log("Fetching data by filter")
            console.log(filterRequestBody);
            let res = await absentService.searchAbsentClass(filterRequestBody, currentPage, pageSize);
            setAbsentClassList(res?.data?.student_class_absent_ids);
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
    }, [JSON.stringify(currentFilters)]);

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

        setFilteredCohort(filters.student_cohort_id);
        setCurrentFilters(filters);
    }

    const columns = [
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
            title: 'Ngày',
            key: 'date_absent',
            dataIndex:  'date_absent',
            align: 'center',
            ...getColumnSearchDateProps('Ngay', 'date_absent'),
            sorter: (a, b) => String(a.date_absent).localeCompare(b.date_absent),
            render: (text) => dayjs(text, "YYYY-MM-DD").format("DD/MM/YYYY").toString()
        },
        {
            title: 'Số lượng vắng',
            key: 'number_absent',
            dataIndex: 'number_absent',
            align: 'center',
            sorter: (a, b) => a.number_absent - b.number_absent,
        },
        {
            title: 'Danh sách vắng',
            key: 'student_absent_ids',
            dataIndex: 'student_absent_ids',
            align: 'center',
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
    ]
    return (
        <>
            <Table  columns={columns}
                dataSource={absentClassList}
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

export default AbsentClassTable;