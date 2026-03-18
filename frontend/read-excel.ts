import * as XLSX from 'xlsx';
import * as fs from 'fs';

const workbook = XLSX.readFile('../context/Pruebas perfiles.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(JSON.stringify(data, null, 2));
