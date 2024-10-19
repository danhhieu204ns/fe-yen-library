import { Button, Modal, Space, Typography, Upload, message } from "antd";
import {  UploadOutlined } from '@ant-design/icons';
import importExcelToJson from "src/utils/importExcel";

import { useEffect, useState } from "react";
import exportExcelFromJson from "src/utils/exportExcel";
import { useFeeApi } from "src/services/feeService";


function ImportModal({
    open,
    onCancel,
    reload
}){
    const [uploadData, setUploadData] = useState();
    const [fileList, setFileList] = useState([]);

    const [uploading, setUploading] = useState(false);
    
    const [modal, contextHolder] = Modal.useModal();

    const feeService = useFeeApi();

    useEffect(() => {
        setFileList([]);
        setUploading(false);
    }, [open])

    const translateObj = {
        "Mã sinh viên": {
            key: "student_code",
            type: "string"
        },
    }

    const parseExcel = async (file) => {
        console.log("Parsing excel file");
        let buffer = await file.arrayBuffer();

        try{
            let parsedData = await importExcelToJson(buffer, translateObj, ["Họ tên"]);
            console.log(parsedData);
            setUploadData(parsedData);
        }
        catch(e){
            error(e);
            setFileList([]);
        }
    }

    const uploadToServer = async () => {
        if(!uploadData){
            onCancel();
            return;
        }
        setUploading(true);
        let body = {
            data: uploadData
        }
        let res = await feeService.importPaidStudent(body);
        console.log(res);
        setUploading(false);
        if (res.status==200) success(onCancel);
        else error(res.message);
    }

    const error = async (message) => {
        let messageArray = message.split('\n');
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
            content: 'Thông tin của sinh viên đã được nhập từ file thành công!',
            onOk() {
                cancel();
                if (reload != null) reload();
            },
        };
        modal.success(config);
    };

    const generateTemplate = () => {
        let cols = ["Mã sinh viên", "Họ tên"]
        exportExcelFromJson([{}], cols, "mau_sinh_vien_da_nop_hoc_phi.xlsx")
    }

    return(
        <Modal title="Nhập từ Excel" 
                open={open} 
                onCancel={onCancel} 
                onOk={uploadToServer}
                footer={(_, { OkBtn, CancelBtn }) => {
                    return(
                        <div className="flex justify-between">
                            <div>
                                <Button type='primary' onClick={generateTemplate}>Tải mẫu</Button>    
                            </div>
                            <div className="flex justify-around gap-2">
                                <Button onClick={onCancel}>Cancel</Button>
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