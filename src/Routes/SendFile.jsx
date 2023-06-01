import React, { useEffect, useRef, useState } from "react";
import useConnection from "../hooks/useConnection";
import useFirestore from "../hooks/useFirestore";
import QRCode from "qrcode";
import DownloadingFile from "../components/DownloadingFile";
import Disconnected from "../components/Disconnected";
import DownloadDone from "../components/DownloadDone";
const SendFile = () => {
    const [file, setFile] = useState(null);
    const [savedOfferData, setSavedOfferData] = useState(null);
    const connection = useConnection(0);
    const firestore = useFirestore();
    const [state, setState] = useState("upload");
    const handleAnswer = (id) => {
        firestore.addOfferSnapShotListener(id, (answer) => {
            connection.addAnswer(JSON.parse(answer), (err, res) => {
                if (err) console.log(err);
                else console.log(answer);
            });
        });
    };

    const saveOfferInFireStore = (offer) => {
        firestore.saveOfferAndFile(
            offer,
            { name: file.name, size: file.size },
            (err, res) => {
                if (err) {
                    console.log("[offer saved failed]", err);
                } else {
                    setSavedOfferData(res);
                    handleAnswer(res.id);
                    setState("waitforanswer");
                }
            }
        );
    };

    const createOffer = () => {
        connection.createOffer((err, offer) => {
            if (err) {
                console.error("[offer creation failed]", err);
            } else {
                saveOfferInFireStore(offer);
            }
        });
    };

    useEffect(() => {
        if (file !== null) {
            connection.handleOnStatechange();
            connection.setFile(file);
            connection.addEventListener("downloadstarted", (status) => {
                setState(status);
            });
            createOffer();
        }
    }, [file]);





    return (
        <div className="root-body">
            {state === "upload" && <FileUploadeBox setFile={setFile} />}
            {state === "waitforanswer" && (
                <ShowFileToUpload file={file} id={savedOfferData.id} />
            )}
            {state === "downloadstarted" && (
                <DownloadingFile value={20} connection={connection} />
            )}
            {state === "disconnected" && <Disconnected />}
            {state === "downloadcompleted" && <DownloadDone />}
        </div>
    );
};

const FileUploadeBox = ({ setFile }) => {
    const fileref = useRef();

    return (
        <div
            onClick={() => {
                if (fileref.current) {
                    fileref.current.click();
                }
            }}
            className="root-box"
        >
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <p>Upload file to send</p>
            <input
                ref={fileref}
                hidden
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />
        </div>
    );
};

const ShowFileToUpload = ({ id, file }) => {
    const canvasRef = useRef();

    const link = window.location.host + "/downloadfile/" + id;
    useEffect(() => {
        const qrcode = require("qrcode");
        qrcode.toDataURL(canvasRef.current, link, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("qrcode showing");
            }
        });
    }, []);
    return (
        <div className="root-box2">
            <input
                onClick={() => {
                    window.navigator.clipboard
                        .writeText(link)
                        .then(() => alert("Link Copied"));
                }}
                className="show-link"
                type="text"
                readOnly
                value={link}
            />

            <div
                style={{
                    marginTop: "10px",
                    width: "100%",
                }}
            >
                <p>{file.name}</p>
                <p
                    style={{
                        fontSize: "14px",
                        marginTop: "6px",
                    }}
                >
                    {parseFloat(file.size / 1000000).toFixed(2)} MB
                </p>
            </div>
            <canvas
                style={{
                    height: "100px",
                    widows: "100px",
                }}
                height={"100"}
                width={"100"}
                ref={canvasRef}
                className="canvas"
            />
            <button
                onClick={() => {
                    window.location.reload();
                }}
                className="button"
            >
                Cancel upload
            </button>
        </div>
    );
};

export default SendFile;
