import { toast } from "sonner";
import React from "react";
import axios from "axios";

const ScriptToast = ({ scripts }) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(scripts.join("\n"))
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy");
      });
  };
  const submitdata = () => {
    let url = "https://frmwrkuiserverq.onrender.com/submitdata";
    axios.post(url, {
      Scripts: scripts,
    });
  };

  return (
    <div style={{ padding: "10px", maxWidth: "400px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={copyToClipboard}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "#007BFF",
          }}
        >
          Copy
        </button>
        <button
          onClick={() => toast.dismiss()}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "#FF0000",
          }}
        >
          Close
        </button>
      </div>
      <div style={{ marginTop: "10px", maxHeight: "300px", overflowY: "auto" }}>
        {scripts &&
          scripts.map((script, index) => (
            <pre
              key={index}
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                marginBottom: "10px",
              }}
            >
              {script}
            </pre>
          ))}
      </div>
    </div>
  );
};

export default ScriptToast;
