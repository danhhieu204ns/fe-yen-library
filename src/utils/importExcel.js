import dayjs from 'dayjs';
import { read, utils } from 'xlsx';

/*
translateObj: {
    "Excel Column name": {
        key: "key",
        type: "number/string/date"
    }
} 
exception: Cho phép các cột đc liệt kê mà ko có tên trong translateObj
*/
// Will silently fail if not careful!!!
function importExcelToJson(data, parser, exception=[]){
    return new Promise((resolve, reject) => {
        let message = [];
        let processedData;
        try{
            const workbook = read(data, {cellDates: true});
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const raw_data = utils.sheet_to_json(worksheet, {raw:true});
            console.log(raw_data);
            let invalidHeader = false;
            let parsedData = raw_data.map((entry, index) => {
                if (invalidHeader) return;
                let newEntry = {};
                let entryMap = new Map(Object.entries(entry)); // Convert obj to map for easy iteration
                console.log(entryMap);
                for(let [key, value] of entryMap){
                    let parsedName = parser[key];
                    if(!parsedName){
                        if(!exception.includes(key)){
                            message.push(`Tên cột "${key}" không hợp lệ! Vui lòng tải file mẫu để sử dụng!`);    
                            invalidHeader = true;
                        } 
                        continue;
                    }

                    if (parsedName.type=='number'){
                        if(isNaN(value)){
                            message.push(`Cột "${key}" dòng ${index+2}: Phải là 1 số!`);
                            continue;
                        }
                        newEntry[parsedName.key] = Number(value);
                    } 
                    else if (parsedName.type=='date') {
                        console.log(value instanceof Date);
                        if (!(value instanceof Date)){
                            message.push(`Cột "${key}" dòng ${index+2}: Đảm bảo rằng các ô ngày được format ở dạng Date!`);
                            continue;
                        } 
                        newEntry[parsedName.key] = dayjs(value).format('YYYY-MM-DD');
                    }
                    else newEntry[parsedName.key] = String(value);
                }
                return newEntry;
            })

            processedData = parsedData;
        }
        catch(e){
            console.log(e);
            message.push(e);
        }   
        
        if (message.length==0) resolve(processedData);
        else reject(message.join('\n'));
    })
    
}

export default importExcelToJson;