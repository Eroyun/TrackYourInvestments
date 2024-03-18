import { saveAs } from "file-saver";
const XLSX = require("xlsx");

const processData = (data) => {
  const processedData = [];
  let i = 0;
  while (i < data.length) {
    let row = [...data[i]]; // copy the current row
    while (
      i < data.length - 1 &&
      data[i][0] === data[i + 1][0] &&
      data[i][1].trim() === data[i + 1][1].trim() &&
      data[i][3] === data[i + 1][3]
    ) {
      // If the first two items are the same as the next row, sum the rest of the items
      for (let j = 2; j < row.length; j++) {
        if (j !== 3) row[j] += data[i + 1][j];
      }
      i++;
    }
    row[1] = row[1].trim();
    processedData.push(row);
    i++;
  }
  return processedData;
};

const handleFileChange = (event) => {
  if (event.target.files.length === 0) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const finalData = processData(jsonData);
      resolve(finalData);
    };
    reader.onerror = function (e) {
      reject(new Error("File read failed"));
    };
    reader.readAsArrayBuffer(file);
  });
};

const handleExport = (firstSheetData) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(firstSheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;
  saveAs(new Blob([buf], { type: "application/octet-stream" }), "export.xlsx");
};

function addRow(sheetData, newRow) {
  const data = [...sheetData];
  newRow[0] = new Date(newRow[0]).getTime() / (86400 * 1000) + 25567 + 2;
  newRow[1] = newRow[1].trim();
  newRow[3] = parseFloat(newRow[3]);
  newRow[4] = parseFloat(newRow[4]);
  // Find the index where the new row should be inserted
  const index = data.findIndex((row, i) => {
    // If it's the header row, continue to the next row
    if (i === 0) return false;

    row[1] = row[1].trim();

    // If the date and stock are the same, continue to the next row
    if (row[0] === newRow[0] && row[1] === newRow[1]) {
      return false;
    }
    // If the date is later than the new row's date, or the date is the same but the stock is different, insert before this row
    if (row[0] > newRow[0] || (row[0] === newRow[0] && row[1] > newRow[1])) {
      console.log(row[0], newRow[0], row[1], newRow[1]);
      return true;
    }
    // Otherwise, continue to the next row
    return false;
  });

  // If no index was found (i.e., the new row's date and stock are later than all existing dates and stocks), append the new row at the end
  if (index === -1) {
    data.push(newRow);
  } else {
    // Otherwise, insert the new row after all rows with the same date and stock
    const sameDateAndStockIndex = data.lastIndexOf(data[index - 1]);
    data.splice(sameDateAndStockIndex + 1, 0, newRow);
  }

  return data;
}

module.exports = { processData, handleFileChange, handleExport, addRow };
