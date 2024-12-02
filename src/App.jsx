import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function App() {
  const [file, setFile] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        processFileData(data);
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const processFileData = (data) => {
    const updated = data.map((row) => {
      const articleTitle = row['Article Title'] || '';
      row['Generated PageName'] = generatePageName(articleTitle);
      return row;
    });
    setUpdatedData(updated);
  };

  const generatePageName = (title) => {
    return title
      .replace(/&nbsp;|[\u00A0]/g, ' ')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 100);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UpdatedData');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), 'UpdatedData.xlsx');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Page Name Fixer</h1>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      {updatedData && <button onClick={handleDownload}>Download Updated File</button>}
    </div>
  );
}

export default App;

