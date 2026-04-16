const XLSX = require('xlsx');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

const TECH_COLUMNS = [
  'Business_Unit','SP/Manaus','Group_Macro','Group_Mid','Group_Micro',
  'EmployeeID','EmployeeJobTitle','InternalGrade','EmployeeGroup',
  'Estado','Cidade','Gender','HireDate','BirthDate','ManagerEmployeeID',
  'Monthly_Salary','Monthly_FixedAdditives','SalariesPerYear',
  'ICP_Target','ICP_Paid','ILP_Target','ILP_Paid',
  'SB','RDA','Layer','Span',
  'ManagerJobTitle','ManagerGroup','ManagerLayer',
  'IEG','AUX_IEG1','AUX_IEG2'
];

function mapRow(values) {
  const obj = {};

  TECH_COLUMNS.forEach((col, i) => {
    obj[col] = values[i] ?? null;
  });

  return obj;
}

function processExcel(filePath) {
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

  if (rows.length < 3) {
    throw new Error('Arquivo inválido. Estrutura mínima não encontrada.');
  }

  const data = [];

  // 🔹 Ignora linha 1 e 2 → começa da linha 3 (índice 2)
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];

    if (row.some(v => v !== null && v !== undefined && v !== '')) {
      data.push(mapRow(row));
    }
  }

  return { data };
}

function processCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, { skip_empty_lines: false });

  if (records.length < 3) {
    throw new Error('Arquivo inválido. Estrutura mínima não encontrada.');
  }

  const data = [];

  // 🔹 Ignora linha 1 e 2 → começa da linha 3 (índice 2)
  for (let i = 2; i < records.length; i++) {
    const row = records[i];

    if (row.some(v => v !== null && v !== undefined && v !== '')) {
      data.push(mapRow(row));
    }
  }

  return { data };
}

async function processUploadFile(filePath, ext) {
  try {
    const result =
      ext === 'csv'
        ? processCSV(filePath)
        : processExcel(filePath);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return result;

  } catch (err) {

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw err;
  }
}

function convertTypes(row) {

  function excelDateToISO(serial) {
    // Excel usa 30 de dezembro de 1899 como base (serial 0)
    // Há um bug conhecido: Excel trata 1900 como bissexto (não é)
    // Para datas >= 60, precisamos subtrair 1 dia
    // Usamos Date.UTC() que é seguro e não tem problemas de timezone
    
    let daysToAdd = serial;
    
    // Ajuste para o bug do Excel (1900 não é bissexto)
    if (serial >= 60) {
      daysToAdd = serial - 1;
    }
    
    // Base: 30 de dezembro de 1899 (1899-12-30) em UTC
    // Date.UTC() retorna timestamp UTC, sem problemas de timezone
    const baseTimestamp = Date.UTC(1899, 11, 30); // mês é 0-indexed (11 = dezembro)
    const targetTimestamp = baseTimestamp + (daysToAdd * 86400000); // 86400000 ms = 1 dia
    
    // Cria data em UTC e formata como YYYY-MM-DD
    const date = new Date(targetTimestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // mês é 0-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }
  
  function parseMDYYYYToISO(dateStr) {
    // Parse formato M/D/YYYY ou MM/DD/YYYY para ISO YYYY-MM-DD
    // Sem usar new Date() para evitar problemas de timezone
    
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Validação básica
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 1900 || year > 2100) return null;
    
    // Validação de dias no mês
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const maxDays = (month === 2 && isLeapYear(year)) ? 29 : daysInMonth[month - 1];
    if (day > maxDays) return null;
    
    // Retorna formato ISO YYYY-MM-DD
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  
  function isValidISODate(dateStr) {
    // Valida formato ISO YYYY-MM-DD
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoRegex.test(dateStr)) return false;
    
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const maxDays = (month === 2 && isLeapYear(year)) ? 29 : daysInMonth[month - 1];
    
    return day <= maxDays;
  }

  function normalizeNumber(value) {
    if (value === null || value === undefined || value === '') return null;

    if (typeof value === 'string') {
      // remove separador de milhar e troca vírgula decimal
      const normalized = value.replace(/\./g, '').replace(',', '.');
      return Number(normalized);
    }

    return Number(value);
  }

  function normalizeDate(value) {
    if (!value) return null;

    // Se for número, é data serial do Excel
    if (typeof value === 'number') {
      // Verifica se é um número que pode ser uma data do Excel (entre 1 e ~50000)
      // Datas do Excel geralmente estão nesse range
      if (value > 0 && value < 100000) {
        return excelDateToISO(value);
      }
      // Se for um número muito grande, provavelmente não é data
      return null;
    }

    // Se for string, processa
    if (typeof value === 'string') {
      // Remove espaços
      const trimmed = value.trim();
      if (!trimmed) return null;

      // 1. Verifica se já está em formato ISO YYYY-MM-DD
      if (isValidISODate(trimmed)) {
        return trimmed;
      }

      // 2. Tenta parsear como número (caso venha como string "34230")
      const numValue = Number(trimmed);
      if (!isNaN(numValue) && numValue > 0 && numValue < 100000) {
        return excelDateToISO(numValue);
      }

      // 3. Tenta parsear como formato M/D/YYYY (americano)
      const mdYYYYResult = parseMDYYYYToISO(trimmed);
      if (mdYYYYResult) {
        return mdYYYYResult;
      }

      // 4. Tenta outros formatos comuns (DD/MM/YYYY, etc) como fallback
      // Mas sem usar new Date() para evitar timezone
      // Se tiver formato de data com barras, tenta DD/MM/YYYY
      if (trimmed.includes('/')) {
        const parts = trimmed.split('/');
        if (parts.length === 3) {
          const part1 = parseInt(parts[0], 10);
          const part2 = parseInt(parts[1], 10);
          const part3 = parseInt(parts[2], 10);
          
          // Se a primeira parte > 12, provavelmente é DD/MM/YYYY
          if (part1 > 12 && part1 <= 31 && part2 >= 1 && part2 <= 12) {
            const day = part1;
            const month = part2;
            const year = part3;
            
            if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
              const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
              const maxDays = (month === 2 && isLeapYear(year)) ? 29 : daysInMonth[month - 1];
              if (day <= maxDays) {
                return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              }
            }
          }
        }
      }
    }

    return null;
  }

  return {
    ...row,

    HireDate: normalizeDate(row.HireDate),
    BirthDate: normalizeDate(row.BirthDate),

    Monthly_Salary: normalizeNumber(row.Monthly_Salary),
    Monthly_FixedAdditives: normalizeNumber(row.Monthly_FixedAdditives),
    SalariesPerYear: normalizeNumber(row.SalariesPerYear),
    ICP_Target: normalizeNumber(row.ICP_Target),
    ICP_Paid: normalizeNumber(row.ICP_Paid),
    ILP_Target: normalizeNumber(row.ILP_Target),
    ILP_Paid: normalizeNumber(row.ILP_Paid),
    SB: normalizeNumber(row.SB),
    RDA: normalizeNumber(row.RDA),
    Span: normalizeNumber(row.Span),
    IEG: normalizeNumber(row.IEG),
    AUX_IEG1: normalizeNumber(row.AUX_IEG1),
    AUX_IEG2: normalizeNumber(row.AUX_IEG2),
  };
}


module.exports = {
  processUploadFile,
  convertTypes,
  TECH_COLUMNS
};
