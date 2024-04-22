import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ViewTable = () => {
    const getTable = "http://localhost:8000/columnName";
    const { selectedTableName, setSelectedTableName } = useContext(Context);
    const [columnNames, setColumnNames] = useState([]);
    const [rowData, setRowData] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        axios.post(getTable, { tablename: selectedTableName })
            .then((response) => {
                console.log(response.data['tableData']);
                setColumnNames(response.data['column']);
                setRowData(response.data['tableData']);
            })
            .catch((error) => {
                console.error("Error while fetching column names:", error);
            });
       
    }, [selectedTableName]);

    return (
        <div>
            <div className="centered-content">
                <table className="custom-table">
                    <thead>
                        <tr>
                            {columnNames.map((columnName, index) => (
                                <th key={index}>{columnName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rowData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cellData, cellIndex) => (
                                    <td key={cellIndex}>{cellData}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTable;
