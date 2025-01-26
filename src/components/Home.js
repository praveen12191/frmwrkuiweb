import { Autocomplete, TextField, Button } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";


const Home = () => {
    const [tableName, setTableName] = useState([]);
    const getTable = "http://localhost:8000/tableName";
    const navigate = useNavigate();
    const { selectedTableName, setSelectedTableName } = useContext(Context);

    useEffect(() => {
        axios.get(getTable)
            .then((response) => {
                setTableName(response.data);
            })
            .catch((error) => {
                console.error("Error fetching table names:", error);
            });
    }, []);

    const callColumn = (event) => {
        event.preventDefault(); 
        console.log(selectedTableName);
        navigate("/addColumn");
    }
    const viewTable = (event)=>
    {
        event.preventDefault(); 
        navigate("/viewTable");
    }


    return ( 
        <div className="home">
            <form onSubmit={callColumn}>
                <div className="centered-content">
                    <Autocomplete
                        className="auto"
                        value={selectedTableName}
                        onChange={(event, newValue) => {
                            setSelectedTableName(newValue);
                        }}
                        options={tableName}
                        renderInput={(params) => <TextField {...params} label="Table Name" variant="outlined" />}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* <Button type="submit" variant="contained">Insert Value</Button> */}
                        <Button onClick={viewTable} variant="contained">View Table</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Home;
