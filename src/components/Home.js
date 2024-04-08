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
        event.preventDefault(); // Prevent default form submission behavior
        console.log(selectedTableName);
        navigate("/addColumn");
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
                    <Button type="submit" variant="contained">Table Name</Button>
                </div>
            </form>
        </div>
    );
}

export default Home;
