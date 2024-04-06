import { Grid, Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
    const table = ['sds']
    const [tableName,setTableName] = useState([])
    const getTable = "http://localhost:8000/tableName"
    useEffect(()=>{
        axios.get(getTable).then((data)=>{
           setTableName(data.data)
           console.log(tableName);
        })
    },[])
    
    

    const [selectedTableName, setSelectedTableName] = useState('');
    return ( 
        <div className="home">
            <form>
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
                </div>
            </form>
        </div>
     );
}
 
export default Home;
