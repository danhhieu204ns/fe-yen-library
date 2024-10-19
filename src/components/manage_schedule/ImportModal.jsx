import { Button, Modal, Space, Typography, Upload, message } from "antd";
import {  UploadOutlined } from '@ant-design/icons';
import importExcelToJson from "src/utils/importExcel";

import { useEffect, useState } from "react";
import exportExcelFromJson from "src/utils/exportExcel";
import { useScheduleApi } from "src/services/manageScheduleService";


function ImportModal(props){
    const [uploadData, setUploadData] = useState();
    const [fileList, setFileList] = useState([]);

    const [uploading, setUploading] = useState(false);
    
    const [modal, contextHolder] = Modal.useModal();

    const scheduleService = useScheduleApi();

    useEffect(() => {
        setFileList([]);
        setUploading(false);
    }, [props.open])

    const translateObj = {
        "Lớp": {
            key: "class_name",
            type: "string"
        },
        "Mã môn học": {
            key:"subject_code",
            type:"string"
        },
        "Phòng học": {
            key:"room",
            type:"string"
        },
        "Buổi giảng dạy": {
            key:"teaching_session",
            type:"string"
        },
        "Danh sách giảng viên": {
            key:"list_lecturer",
            type:"string"
        },
    }

    const parseExcel = async (file) => {
        console.log("Parsing excel file");
        let buffer = await file.arrayBuffer();

        try{
            let parsedData = await importExcelToJson(buffer, translateObj, ["Tên môn học"]);
            console.log(parsedData);
            let cleanData = parsedData.map((entry) => {
                entry.list_lecturer = entry.list_lecturer.trim().split('\n');
                return entry;
            });
            console.log(cleanData);
            setUploadData(cleanData);
        }
        catch(e){
            console.log(e);
            error(e);
            setFileList([]);
        }
    }

    const uploadToServer = async () => {
        if(!uploadData){
            props.onCancel();
            return;
        }
        setUploading(true);
        let body = {
            data: uploadData
        }
        let res = await scheduleService.importSchedule(body);
        console.log(res);
        setUploading(false);
        if (res.status==200) success(props.onCancel);
        else error(res.message);
    }

    const error = async (message) => {
        messageArray = message.split('\n');
        let config = {
            title: 'Nhập thất bại',
            content: (
                    <div>
                        <Typography>Đã có lỗi xảy ra</Typography>
                        {messageArray.map((entry) => {
                            return (
                                <Typography>{entry}</Typography>
                            )
                        })}
                    </div>
                ),
        };
        await modal.error(config);
    };

    const success = (cancel) => {
        let config = {
            title: 'Nhập thành công',
            content: 'Thông tin lịch giảng dạy đã được nhập từ file thành công!',
            onOk() {
                cancel();
                if (props.reload != null) props.reload();
            },
        };
        modal.success(config);
    };

    const generateTemplate = () => {
        let cols = ["Lớp", "Mã môn học", "Tên môn học", "Phòng học", "Buổi giảng dạy", "Danh sách giảng viên"]
        exportExcelFromJson([{}], cols, "mau_lich_giang_day.xlsx")
    }

    return(
        <Modal title="Nhập từ Excel" 
                open={props.open} 
                onCancel={props.onCancel} 
                onOk={uploadToServer}
                footer={(_, { OkBtn, CancelBtn }) => {
                    return(
                        <div className="flex justify-between">
                            <div>
                                <Button type='primary' onClick={generateTemplate}>Tải mẫu</Button>    
                            </div>
                            <div className="flex justify-around gap-2">
                                <Button onClick={props.onCancel}>Cancel</Button>
                                <Button type ="primary" onClick={uploadToServer} loading={uploading}>OK</Button>
                            </div>
                        </div>
                    )
                }}>
            <Upload name='file' 
                    maxCount={1}
                    onRemove={(file) => {
                        setFileList([]);
                        setUploadData(null);
                    }}
                    beforeUpload={(file) => {
                        setFileList([file]);
                        parseExcel(file);
                        return false;
                    }}
                    fileList={fileList}
            >
                <Space>
                    <Typography>Tải lên file Excel: </Typography>
                    <Button icon={<UploadOutlined />}>Tải lên</Button>    
                </Space>
                
            </Upload>    
            {contextHolder}
        </Modal>
    )
}

export default ImportModal;