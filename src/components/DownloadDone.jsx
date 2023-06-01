import React from "react";

const DownloadDone = () => {
    return (
        <div className="root-box">
            <i
                style={{
                    fontSize: 80,
                    color: "lightgreen",
                }}
                className="fa-solid fa-check"
            ></i>
            <p>Download completed</p>
        </div>
    );
};

export default DownloadDone;
