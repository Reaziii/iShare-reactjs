import React from "react";

const Disconnected = () => {
    return (
        <div className="root-box">
            <i
                style={{
                    fontSize: 80,
                    color: "red",
                }}
                className="fa-solid fa-triangle-exclamation"
            ></i>
            <p>Peer disconnected</p>
        </div>
    );
};

export default Disconnected;
