import { writeFile, utils } from 'xlsx';

function exportExcelFromJson(data, row_names, filename){
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.sheet_add_aoa(worksheet, [row_names], { origin: "A1" });

    // Calculate max column size for each field of data
    worksheet["!cols"] = []
    Object.keys(data[0]).forEach((key, index) => {
        let max_width = data.reduce((w, r) => Math.max(w, String(r[key]).length), 10);
        max_width = Math.max(max_width, String(row_names[index]).length); // Fix this
        worksheet["!cols"] = [...worksheet["!cols"], { wch: max_width } ];    
    });
    
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, filename, { compression: true });
}

export default exportExcelFromJson