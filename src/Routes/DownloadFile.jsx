import { getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFirestore from "../hooks/useFirestore";
import useConnection from "../hooks/useConnection";
import DownloadingFile from "../components/DownloadingFile";
import Disconnected from "../components/Disconnected";
import DownloadDone from "../components/DownloadDone";

const DownloadFile = () => {
    const id = useParams().id;
    const firestore = useFirestore();
    const connection = useConnection(1);
    const [status, setStatus] = useState("showdetails");
    const [details, setDetails] = useState({});
    const updateAnswer = (answer) => {
        firestore.saveAnswer(id, JSON.stringify(answer), (err, res) => {
            if (err) {
                console.log(err);
            } else console.log(res);
        });
    };

    const createAnswer = () => {
        connection.createAnswer(JSON.parse(details.offer), (err, answer) => {
            if (err) {
                console.log(err);
            } else {
                updateAnswer(answer);
            }
        });
    };

    const fetchData = () => {
        firestore.getOfferSdpAndFile(id, (err, res) => {
            if (!err) {
                setDetails({ ...res });
            }
        });
    };

    useEffect(() => {
        connection.addEventListener("downloadstatus", (status) => {
            setStatus("downloadstarted");
        });
        connection.addEventListener("downloadstarted", (status) => {
            setStatus(status);
        });
        fetchData();
    }, []);

    return (
        <div className="root-body">
            {status === "showdetails" && (
                <FileDetails details={details} handleDownload={createAnswer} />
            )}
            {status === "downloadstarted" && (
                <DownloadingFile connection={connection} />
            )}
            {status === "disconnected" && <Disconnected />}
            {status === "downloadcompleted" && <DownloadDone />}
        </div>
    );
};

const FileDetails = ({ details, handleDownload }) => {
    return (
        <div
            style={{ justifyContent: "unset", padding: 20 }}
            className="root-box2"
        >
            <div style={{ width: "100%" }}>
                <p>{details.fileName}</p>
                <p style={{ fontSize: 14 }}>
                    {parseFloat(details.fileSize / 1000000).toFixed(2)} MB
                </p>
            </div>

            <button
                onClick={handleDownload}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "orange",
                    marginTop: 50,
                }}
            >
                <p>Download</p>{" "}
                <i
                    style={{ marginLeft: 30, fontSize: 16 }}
                    className="fa-solid fa-cloud-arrow-down"
                ></i>
            </button>
        </div>
    );
};

export default DownloadFile;
