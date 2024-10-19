import { Modal } from "antd";
import { useState, useEffect } from "react";
import StudentTable from "src/components/manage_student/StudentTable";

import { useFilterApi } from "src/services/filterService";

function DetailSearchModal(props){
    const [studentList, setStudentList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [reloadToggle, setReloadToggle] = useState(false); // Toggle this variable to reload

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState();

    const [searchMode, setSearchMode] = useState(false);

    const filterService = useFilterApi();

    useEffect(() => {
        const fetchClassData = async () => {
            console.log('Fetching classes inside Modal!');
            const result = await filterService.getAllClass();
            let classMapped = result?.data?.student_class_ids.map((entry) => {
                console.log('Creating class selection!');
                return {
                    text: entry.class_name,
                    value: entry.id,
                    label: entry.class_name,
                };
            });
            setClassList(classMapped);
        };
        fetchClassData();
    }, []);

    const onTableClickCallback = (record) => {
        props.callback(record)
    }

    return (
        <Modal destroyOnClose title="Tìm kiếm chi tiết" open={props.open} onCancel={props.onCancel} onOk={props.onCancel} width='70%'>
            <div className="flex justify-center overflow-scroll">
                <StudentTable 
                    popupMode={true}
                    hiddenColumns={['actions', 'dia_chi_tt', 'ho_va_ten_cha', 'ho_va_ten_me', 'so_dien_thoai_cha', 'so_dien_thoai_me']}
                    callback={onTableClickCallback}
                    filter={{class_list: classList}}
                />    
            </div>
        </Modal>    
    )
    
}

export default DetailSearchModal;