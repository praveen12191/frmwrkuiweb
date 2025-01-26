import { TextField, IconButton, CircularProgress, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import ScriptToast from "./ScriptTost";
import PopUp from "./PopUp";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Toaster, toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";
import { Toast } from "bootstrap";

const ViewTable = () => {
  const getTable = "http://localhost:8000/columnName";
  const { selectedTableName } = useContext(Context);
  const [columnNames, setColumnNames] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [filters, setFilters] = useState({});
  const [insertValue, setInsertValue] = useState({});
  const [scripts, setScripts] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [newRowData, setNewRowData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNewRow, setShowNewRow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(getTable, {
          tablename: selectedTableName,
        });
        const columns = response.data["column"];
        setColumnNames(columns);

        const rows = response.data["tableData"].map((row) => {
          return columns.reduce((acc, col, index) => {
            acc[col] = row[index];
            return acc;
          }, {});
        });
        setRowData(rows);
      } catch (error) {
        console.error("Error while fetching column names:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTableName]);

  const handleFilterChange = (columnName, value) => {
    setFilters({ ...filters, [columnName]: value });
    setInsertValue((prevInsertValue) => ({
      ...prevInsertValue,
      [columnName]: value,
    }));
  };

  const insertStatement = () => {
    const url = "http://localhost:8000/InsertData";
    axios
      .post(url, {
        TableName: selectedTableName,
        ColumnValue: insertValue,
      })
      .then((response) => {
        console.log(response.data);
        setScripts(response.data.scripts);
        setIsPopupOpen(true);
      });
  };

  const handleEdit = (rowIndex) => {
    console.log(rowIndex);

    // Get the row data from the filtered data, not the full rowData
    const rowToEdit = filteredRowData[rowIndex];
    console.log(rowToEdit);

    setEditRow(rowIndex); // Set the index of the row being edited
    setEditData({ ...rowToEdit }); // Set the edit data to the values of the selected row
  };

  const handleDelete = async (idx) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this row?"
    );
    console.log(idx);
    

    if (userConfirmed) {
      let val = filteredRowData[idx];
      let url = "http://localhost:8000/deleteValue";

      try {
        const res = await axios.post(url, {
          TableName: selectedTableName,
          ColumnValue: val,
        });

        toast.success("Column Deleted");
        setRowData((prevData) => prevData.filter((row, index) => JSON.stringify(row) !== JSON.stringify(val)))
        
        console.log(idx, rowData);
        setScripts(res.data.scripts);
        setIsPopupOpen(true);
      } catch (error) {
        console.error("Error deleting row:", error);
        toast.error("Error deleting row");
      }
    }
  };

  const handleSave = async (rowIndex) => {
    let url = "http://localhost:8000/updateData";
    const oldData = filteredRowData[rowIndex];
    axios
      .post(url, {
        oldData,
        newData: editData,
        tableName: selectedTableName,
      })
      .then((response) => {
        toast.success("Column updated successfully");
        console.log(rowIndex);
        setRowData((prevData) =>
          prevData.map((row, index) =>
            JSON.stringify(row) === JSON.stringify(oldData) ? editData : row
          )
        );
        setScripts(response.data.scripts);
        setIsPopupOpen(true);
        setEditRow(null);
      })
      .catch((error) => {
        console.error("Error updating row:", error);
        toast.error("Error updating row");
      });
  };

  const handleAddNewRow = () => {
    setShowNewRow(true);
    const blankRow = columnNames.reduce((acc, col) => {
      acc[col] = "";
      return acc;
    }, {});
    setNewRowData(blankRow);
  };

  const handleEditChange = (columnName, value) => {
    setEditData({
      ...editData,
      [columnName]: value,
    });
  };

  const handleNewRowChange = (columnName, value) => {
    setNewRowData({
      ...newRowData,
      [columnName]: value,
    });
  };

  const handleSubmitNewRow = () => {
    const url = "http://localhost:8000/InsertValue"; // Adjust the endpoint as needed
    console.log(selectedTableName, newRowData);

    axios
      .post(url, {
        TableName: selectedTableName,
        ColumnValue: newRowData,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          toast.error(response.data.message);
        } else {
          setScripts(response.data.scripts);
          setIsPopupOpen(true);
          setRowData((prevData) => [...prevData, newRowData]); // Add the new row to the table
          setShowNewRow(false); // Hide the input fields after submission
          setNewRowData({});
        }
      })
      .catch((error) => {
        toast.error("Error adding new row");
        console.error("Error:", error);
      });
  };

  const filteredRowData = rowData.filter((row) =>
    Object.keys(filters).every((columnName) => {
      const filterValue = filters[columnName] || "";
      return (
        filterValue === "" ||
        (row[columnName] &&
          row[columnName]
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()))
      );
    })
  );
  console.log(columnNames);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Make sure this is rendered */}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="centered-content">
          <table className="custom-table">
            <thead>
              <tr>
                {columnNames.map((columnName, index) => (
                  <th key={index}>
                    <TextField
                      size="small"
                      variant="outlined"
                      placeholder={columnName}
                      value={filters[columnName] || ""}
                      onChange={(e) =>
                        handleFilterChange(columnName, e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton size="small" className="icon">
                            <FilterListIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </th>
                ))}
              </tr>
              <tr>
                <td
                  colSpan={columnNames.length + 1}
                  style={{ textAlign: "center" }}
                >
                  <Button onClick={insertStatement}>Insert Scripts</Button>
                  <Button onClick={handleAddNewRow}>Add New Column</Button>
                </td>
              </tr>
            </thead>
            <tbody>
              {showNewRow && (
                <tr>
                  {columnNames.map((columnName, index) => (
                    <td key={index}>
                      <TextField
                        size="small"
                        value={newRowData[columnName] || ""}
                        onChange={(e) =>
                          handleNewRowChange(columnName, e.target.value)
                        }
                        placeholder={`Enter ${columnName}`}
                      />
                    </td>
                  ))}
                  <td>
                    <Button onClick={handleSubmitNewRow}>Add</Button>
                  </td>
                </tr>
              )}
              {filteredRowData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columnNames.map((columnName) => (
                    <td key={columnName}>
                      {editRow === rowIndex ? (
                        <TextField
                          value={editData[columnName] || ""}
                          onChange={(e) =>
                            handleEditChange(columnName, e.target.value)
                          }
                          size="small"
                        />
                      ) : (
                        row[columnName]
                      )}
                    </td>
                  ))}
                  <td>
                    {editRow === rowIndex ? (
                      <IconButton onClick={() => handleSave(rowIndex)}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <div>
                        <IconButton onClick={() => handleEdit(rowIndex)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(rowIndex)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PopUp isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <ScriptToast scripts={scripts} />
      </PopUp>
    </div>
  );
};

export default ViewTable;
