"use client";

import React, { useEffect, useState } from "react";
import { handleFileChange, handleExport } from "../../helpers/stockHelper";
import AddRowButton from "@/components/addRow";

const StocksTable = () => {
  const [firstSheetData, setFirstSheetData] = useState([]);

  return (
    <div>
      <div className="flex items-center">
        <label
          htmlFor="fileUpload"
          className="inline-block px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md m-2"
        >
          Upload File
        </label>
        <input
          id="fileUpload"
          type="file"
          className="hidden"
          onChange={(e) => {
            handleFileChange(e).then((finalData) => {
              if (finalData.length > 0) setFirstSheetData(finalData);
            });
          }}
        />
        {firstSheetData && firstSheetData.length > 0 && (
          <div className="flex items-center">
            <button
              onClick={() => handleExport(firstSheetData)}
              className="inline-block px-4 py-2 cursor-pointer bg-green-500 text-white rounded-md m-2"
            >
              Export
            </button>
            <AddRowButton
              firstSheetData={firstSheetData}
              setFirstSheetData={setFirstSheetData}
            />
          </div>
        )}
      </div>
      <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
        <tbody>
          {firstSheetData &&
            firstSheetData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      border: "1px solid black",
                      padding: "5px",
                      color: "black",
                      fontWeight: rowIndex === 0 ? "bold" : "normal",
                    }}
                  >
                    {cellIndex === 0 && rowIndex !== 0
                      ? new Date(
                          (cell - (25567 + 2)) * 86400 * 1000
                        ).toLocaleDateString()
                      : (cellIndex === 3 || cellIndex === 4) &&
                        typeof cell === "number"
                      ? `${cell.toFixed(2).replace(".", ",")} TRY`
                      : cell}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StocksTable;
