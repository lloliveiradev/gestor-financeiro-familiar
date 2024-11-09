const ExcelJS = require('exceljs');
const { Stream } = require('stream');
class Excel {
    async xlsxFile(header, data, worksheet_name) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(worksheet_name ?? 'Worksheet 1');
        if (header) worksheet.columns = header;
        worksheet.addRows(data);
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    };

    async csvFile(header, data, delimiter = ';', linebreak = '\r\n') {
        let csv;
        csv = header.map(column => column.header).join(delimiter) + linebreak;
        csv += data.map(row => {
            return header.map(column => {
                let value = row[column.key];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""');
                    value = '"' + value + '"';
                };
                return value;
            }).join(delimiter);
        }).join(linebreak);
        const buffer = Buffer.from(csv, 'utf8');
        return buffer;
    };

    async readFile(buffer) {
        let workbook = new ExcelJS.Workbook();
        const stream = new Stream.PassThrough();
        stream.end(buffer);
        workbook = await workbook.xlsx.read(stream);
        const rows = workbook.worksheets[0].getSheetValues();
        return rows;
    };
};

module.exports = Excel;