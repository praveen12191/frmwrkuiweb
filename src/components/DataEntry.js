import axios from "axios";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Toaster, toast } from "sonner";
import ScriptToast from "./ScriptTost";
import PopUp from "./PopUp";

const DataEntry = () => {
  const [columnDetails, setColumnDetails] = useState({});
  const [formData, setFormData] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [hoveredTable, setHoveredTable] = useState(null);
  const [scripts, setScripts] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const url = "https://frmwrkuiserverq.onrender.com/columnDetail";
    axios
      .get(url)
      .then((response) => {
        setColumnDetails(response.data);
        const initialFormData = {};
        Object.keys(response.data).forEach((tableName) => {
          initialFormData[tableName] = {};
          response.data[tableName].forEach((columnName) => {
            initialFormData[tableName][columnName] = "";
          });
        });
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // const handleTableHover = (tableName) => {
  //     setHoveredTable(tableName);
  //     setIsLoading(true);
  //     axios.post('https://frmwrkuiserverq.onrender.com/columnName', { tablename: tableName})
  //         .then(response => {
  //             const tableSuggestions = response.data['uniqueDate'];
  //             setSuggestions(prevSuggestions => ({
  //                 ...prevSuggestions,
  //                 [tableName]: tableSuggestions
  //             }));
  //             setIsLoading(false);
  //         })
  //         .catch(error => {
  //             console.error("Error fetching suggestions:", error);
  //             setIsLoading(false);
  //         });
  // };

  const handleTableHover = (tableName, columnName) => {
    setHoveredTable(tableName);
    setIsLoading(true);

    // Pass the current form data of the table to filter suggestions
    const previousData = formData[tableName]; // Get previous inputs like col1 value

    axios
      .post("https://frmwrkuiserverq.onrender.com/columnDetails", {
        tablename: tableName,
        previousData: previousData, // Send previous column values
      })
      .then((response) => {
        const tableSuggestions = response.data["uniqueDate"];
        setSuggestions((prevSuggestions) => ({
          ...prevSuggestions,
          [tableName]: tableSuggestions,
        }));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
        setIsLoading(false);
      });
  };

  const handleInputChange = (event, tableName, columnName, value) => {
    const inputValue = value !== undefined ? value : event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [tableName]: {
        ...prevState[tableName],
        [columnName]: inputValue,
      },
    }));
  };

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://frmwrkuiserverq.onrender.com/submitData", formData)
      .then((response) => {
        if (response.status === 200) {
          setScripts(response.data.scripts);
          setIsPopupOpen(true);
          toast.success("Data inserted successfully");
        }
        if (response.status === 203) {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toast.error("Error submitting data");
      });
  };

  return (
    <div className="columnNames">
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit}>
        {Object.keys(columnDetails).map((tableName, index) => (
          <div className="help" key={index} style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              {tableName.toUpperCase()}
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {columnDetails[tableName].map((columnName, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "150px",
                  }}
                >
                  <label>{columnName}</label>
                  <Autocomplete
                    value={formData[tableName][columnName] || ""}
                    onChange={(event, newValue) =>
                      handleInputChange(event, tableName, columnName, newValue)
                    }
                    onInputChange={(event, newInputValue) =>
                      handleInputChange(
                        event,
                        tableName,
                        columnName,
                        newInputValue
                      )
                    }
                    options={suggestions[tableName]?.[columnName] || []}
                    getOptionLabel={(option) => `${option}`}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        onClick={() => handleTableHover(tableName)}
                        {...params}
                        placeholder={columnName}
                        style={{ padding: "20px", width: "100%" }}
                      />
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="d-flex">
          <Button className="buttons" type="submit">
            Submit
          </Button>
        </div>
      </form>

      {isLoading && (
        <div
          style={{
            position: "absolute",
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress color="primary" size={20} />
        </div>
      )}

      <PopUp isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <ScriptToast scripts={scripts} />
      </PopUp>
    </div>
  );
};

export default DataEntry;
