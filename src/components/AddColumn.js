import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Toaster, toast } from "sonner";
import { Context } from "../App";
import Autocomplete from "@mui/material/Autocomplete";

const AddColumn = () => {
  const getTable = "https://frmwrkuiserverq.onrender.com/columnName";
  const { selectedTableName } = useContext(Context);
  const [columnNames, setColumnNames] = useState([]);
  const [rowData, setRowData] = useState([{ id: 0, values: {} }]);
  const [suggestions, setSuggestions] = useState({});
  const [key, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(getTable, { tablename: selectedTableName })
      .then((response) => {
        setColumnNames(response.data["column"]);
        setSuggestions(response.data["uniqueDate"]);
      })
      .catch((error) => {
        console.error("Error while fetching column names:", error);
      });
  }, [selectedTableName]);

  const handleInputChange = (rowId, columnName, value) => {
    setRowData((prevData) => {
      const newData = prevData.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            values: {
              ...row.values,
              [columnName]: value,
            },
          };
        }
        return row;
      });
      return newData;
    });
  };

  const handleAddRow = () => {
    const newRowId = rowData.length;
    setRowData((prevData) => [...prevData, { id: newRowId, values: {} }]);
    toast.info("Row added");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://frmwrkuiserverq.onrender.com/postdata", {
        values: rowData,
        tableName: selectedTableName,
      })
      .then((response) => {
        if (response.status === 202) {
          setKeys(response.data["keys"]);
          setValues(response.data["datas"]);
          let val =
            response.data["message"] + " on row " + response.data["Rowcount"];
          toast.error(
            <div>
              <p>{val}</p>
            </div>
          );
        } else {
          console.log("Data sent successfully:", response.data);
          toast.success("Data added");
          setTimeout(() => {
            navigate("/");
          }, 5000);
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        toast.error("Something went wrong");
      });
  };
  // const handleYes = (response) => {
  //     console.log(key,values,'hejej');
  //     axios.post("https://frmwrkuiserverq.onrender.com/updatedata", {
  //         TableName: selectedTableName,
  //         ColumnName : columnNames,
  //         key : key,
  //         datas : values
  //     }).then(response => {
  //         if(response.status === 200) {
  //             toast.success('Data get updated')
  //         }
  //     })
  //     .catch(error => {
  //         console.error("Error sending data:", error);
  //         toast.error('Something went wrong')
  //     });
  // };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit}>
        <div className="centered-content" style={{ width: "80%" }}>
          <table>
            <thead>
              <tr>
                {columnNames.map((columnName) => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text" style={{ marginLeft: "200px" }}>
              {rowData.map((row, index) => (
                <tr key={row.id}>
                  {columnNames.map((columnName) => (
                    <td
                      key={columnName}
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Autocomplete
                          value={row.values[columnName] || ""}
                          onChange={(event, newValue) =>
                            handleInputChange(row.id, columnName, newValue)
                          }
                          onInputChange={(event, newInputValue) =>
                            handleInputChange(row.id, columnName, newInputValue)
                          }
                          options={suggestions[columnName] || []}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              style={{
                                width: "200px",
                                height: "40px",
                                marginTop: "20px",
                              }}
                            />
                          )}
                        />
                      </div>
                    </td>
                  ))}
                  {index === rowData.length - 1 && (
                    <td>
                      <Button
                        className="addButton"
                        type="button"
                        onClick={handleAddRow}
                        style={{ marginTop: "30px" }}
                      >
                        <AddCircleIcon />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            className="buttons"
            type="submit"
            variant="contained"
            style={{ marginTop: "30px" }}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddColumn;
