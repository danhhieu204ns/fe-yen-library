import { Button, Checkbox, Col, Popover, Row, Space } from "antd";
import {
    EyeInvisibleOutlined,
    CaretDownOutlined
} from '@ant-design/icons';

import { useState } from "react";


function HideDropdown({
    columns=[{label:'', value:''}],
    onChange=()=>{}
}){
    const [checked, setChecked] = useState([]); // Don't put state inside a component that will get rerendered

    const CheckboxGroup = () => {
        const onCheckedChange = (checkedValues) => {
            setChecked([...checkedValues]);
            onChange(checkedValues);
        }

        return (
            <Checkbox.Group onChange={onCheckedChange} value={checked}>
                <Space direction="vertical" className="max-h-48 overflow-auto">
                    {columns.map((column) => {
                        return(
                            <Checkbox key={column.value} value={column.value}>
                                {column.label}
                            </Checkbox>   
                        )   
                    })}              
                </Space>     
            </Checkbox.Group>    
        )
    }

    return (
        <Popover content={<CheckboxGroup/>} trigger='click' placement="bottomLeft">
            <Button type='primary' icon={<EyeInvisibleOutlined/>}>Ẩn {<CaretDownOutlined />}</Button>  
        </Popover>
    )
}

export default HideDropdown;