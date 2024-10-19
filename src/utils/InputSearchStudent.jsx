import { Select, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useStudentApi } from 'src/services/studentService';
import DetailSearchModal from './DetailSearchModal';

let timeout;

export function InputSearchStudent(props){
    const [searchData, setSearchData] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [detailSearchModalOpen, setDetailSearchModalOpen] = useState(false);

    const studentService = useStudentApi();

    useEffect(() => {
        setSearchText(props?.placeholder?props.placeholder:"");
    }, [props?.placeholder])

    const searchStudentByApi = async (value_name, value_code="") => {
        let body = {
            student_code: "",
            full_name: "",
            student_class_id: [],
            phone_number: "",
            email: "",
            sex: [],
            date_of_birth: "2024-08-22",
            status: []
        }
        try {
            body.student_code = value_code;
            body.full_name = value_name;
        }
        catch{
            throw("No such field");
        }
        console.log(body);
        let res = await studentService.searchStudent(body, 1, 10);
        return (res?.data?.student_info);
    }

    const handleSearch = async (value) => {
        let num = value.replace(/[^0-9]/g, ''); // Lỗi khi MSV chứa chữ
        let text = value.replace(/[0-9]/g, '');
        if(num==='' && text===''){
            setSearchData([]);
            if(timeout){
                clearTimeout(timeout);
                timeout = null;
            }
            return;
        } 
        // Nếu đang có timeout (search chờ thực hiện) => Huỷ và reset timeout với input mới (Tránh gọi nhiều request)
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(async () => {
            let res = await searchStudentByApi(text, num);
            console.log(res);
            setSearchData(res);    
        }, 500)
    }

    const onDetailSearchCallback = (record) => {
        setSearchText(`${record?.full_name} (${record?.student_code})`);
        let data = {
            student_id: record?.id,
            student_code: record?.student_code,
            full_name: record?.full_name,
            student_class_id: record?.student_class_id[1]
        }
        props.callback(data);
        setDetailSearchModalOpen(false)
    }

    return (
        <>
            <Select
                {...props}  
                showSearch          
                defaultActiveFirstOption={false}
                filterOption={false}
                notFoundContent={null}
                value={searchText}
                onSearch={handleSearch}
                onChange={(value) => {
                    console.log(value)
                    setSearchText(value);
                    let value_split = value.split(',');
                    let data = {
                        student_id: value_split[0],
                        student_code: value_split[1],
                        full_name: value_split[2],
                        student_class_id: value_split[3]
                    }
                    props.callback(data);
                }}
                dropdownRender={(menu) => {
                    return (
                        <div>
                            {menu}
                            <div>
                                <Button type='default' 
                                        className='font-semibold' 
                                        style={{width: '100%'}} 
                                        onClick={() => {
                                            console.log("Detail Search Modal clicked")
                                            setDetailSearchModalOpen(true)
                                            }}
                                        >Tìm kiếm thêm...</Button>
                            </div>
                            
                        </div>     
                    )
                }}
                options={searchData.map((entry) => {
                    return {
                        value: `${entry?.id},${entry?.student_code},${entry?.full_name},${entry?.student_class_id[1]}`,
                        label: `${entry?.full_name} (${entry?.student_code})`
                    }
                })} />  
            <DetailSearchModal open={detailSearchModalOpen} onCancel={() => setDetailSearchModalOpen(false)} callback={onDetailSearchCallback} />
        </>
        
    )
}
