import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Toaster, toast } from 'sonner'


const AddColumn = () => {
    const getTable = "http://localhost:8000/columnName";
    const { selectedTableName, setSelectedTableName } = useContext(Context);
    const [columnNames, setColumnNames] = useState([]);
    const [rowData, setRowData] = useState([{ id: 0, values: {} }]); 
    const navigate = useNavigate(); 

    useEffect(() => {
        axios.post(getTable, { tablename: selectedTableName })
            .then((response) => {
                console.log(response.data);
                setColumnNames(response.data['column']);
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
        toast.info("hds")
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(rowData);
        
        axios.post("http://localhost:8000/postdata",
        {
            values : rowData,
            tableName : selectedTableName
        })
            .then(response => {
                if(response.status === 202) {
                    let val = response.data['message'] + " on row " + response.data['Rowcount']
                    toast.error(val)
    
                } else {
                    console.log("Data sent successfully:", response.data);
                    toast.success('Data added')
                    navigate('/');
                   
                }
            })
            .catch(error => {
                console.error("Error sending data:", error);
                toast.error('Someting went wrong')
            });
    };
    
    
    return (
        <div>
             <Toaster position="top-right" richColors/>
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
                            {rowData.map((row, index) => (
                                <tr key={row.id}>
                                    {columnNames.map(columnName => (
                                        <td key={columnName}>
                                            <TextField
                                                value={row.values[columnName] || ''}
                                                onChange={(event) => handleInputChange(row.id, columnName, event.target.value)}
                                            />
                                        </td>
                                    ))}
                                    {index === rowData.length - 1 && (
                                        <td>
                                            <Button type="button" onClick={handleAddRow}>
                                               
                                                <AddCircleIcon />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button type="submit" variant="contained">Submit</Button>
                    </div>
          
                </form>
        </div>
    );
};

export default AddColumn;
