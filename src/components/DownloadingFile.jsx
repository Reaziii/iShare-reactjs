import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

const DownloadingFile = ({ connection }) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
        connection.addEventListener("downloadstatus", (res) => {
            setValue(res.percentage);
        });
    }, []);
    return (
        <div style={{ position: "relative" }} className="root-box">
            <CircularProgress variant="determinate" size={200} value={value} />

            <div
                style={{
                    position: "absolute",
                    fontSize: 30,
                }}
            >
                {parseInt(value)}%
            </div>
        </div>
    );
};

export default DownloadingFile;
