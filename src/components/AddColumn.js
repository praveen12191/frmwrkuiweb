import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";

const AddColumn = () => {
    const getTable = "http://localhost:8000/columnName";
    const { selectedTableName, setSelectedTableName } = useContext(Context);
    const [columnNames, setColumnNames] = useState([]);
    const [rowData, setRowData] = useState([{ id: 0, values: {} }]); 
    const navigate = useNavigate();
    const value = "sjhs"

    useEffect(() => {
        axios.post(getTable, { tablename: selectedTableName })
            .then((response) => {
                console.log(response.data);
                setColumnNames(response.data);
            })
            .catch((error) => {
                console.error("Error while fetching column names:", error);
            });
    }, [selectedTableName]);

    const handleInputChange = (rowId, columnName, value) => {
        setRowData(prevData => {
            const newData = prevData.map(row => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        values: {
                            ...row.values,
                            [columnName]: value
                        }
                    };
                }
                return row;
            });
            return newData;
        });
    };

    const handleAddRow = () => {
        const newRowId = rowData.length; // Generate new row id
        setRowData(prevData => [
            ...prevData,
            { id: newRowId, values: {} } // Add new row with empty values
        ]);
    };

   
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(rowData);
        alert('Date added Successfully')
        axios.post("http://localhost:8000/postdata",
        {
            values : rowData,
            tableName : selectedTableName
        })
            .then(response => {
                console.log("Data sent successfully:", response.data);
        
            })
            .catch(error => {
                console.error("Error sending data:", error);
                
            });
        navigate('/')
    };
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="centered-content">
                    <table>
                        <thead>
                            <tr>
                                {columnNames.map(columnName => (
                                    <th key={columnName}>{columnName}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rowData.map(row => (
                                <tr key={row.id}>
                                    {columnNames.map(columnName => (
                                        <td key={columnName}>
                                            <TextField
                                                value={row.values[columnName] || ''}
                                                onChange={(event) => handleInputChange(row.id, columnName, event.target.value)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button type="submit" variant="contained" onClick={handleAddRow}>Add Row</Button>
                    <Button type="submit" variant="contained">Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default AddColumn;
