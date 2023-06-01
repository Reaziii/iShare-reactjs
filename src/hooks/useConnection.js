import { useEffect } from "react";

let file = null;
const downloadingStatusListeners = [];
const statusListeners = [];
const useConnection = (type) => {
    let datachannel = null;
    let downloaddone = false;
    const iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
    ];
    let fileBuffer = [];
    let chunks = [];
    let idx = 0;
    const peer = new RTCPeerConnection({
        iceServers,
    });

    useEffect(() => {
        peer.onsignalingstatechange = (e) => {
            if (peer.connectionState === "disconnected" && downloaddone===false) {
                updateDownloadStatus("disconnected");
            }
        };
    }, []);

    const createOffer = async (callback) => {
        try {
            if (
                peer.connectionState === "connected" ||
                peer.connectionState === "connecting"
            ) {
                throw "Wait for connection";
            }
            peer.onicecandidate = (e) => {
                if (e.candidate) {
                    if (callback) callback(null, peer.localDescription);
                    callback = null;
                }
            };
            datachannel = peer.createDataChannel("filesender");
            handleChannel(datachannel);
            const offer = await peer.createOffer();
            peer.setLocalDescription(offer);
        } catch (err) {
            if (callback) callback(err, null);
            callback = null;
        }
    };

    const createAnswer = async (offer, callback) => {
        try {
            if (
                peer.connectionState === "connected" ||
                peer.connectionState === "connecting"
            ) {
                throw "connecting or connected";
            }
            await peer.setRemoteDescription(offer);
            peer.onicecandidate = (e) => {
                if (e.candidate) {
                    if (callback) callback(null, peer.localDescription);
                    callback = null;
                }
            };

            peer.ondatachannel = (event) => {
                handleChannel(event.channel);
            };

            const answer = await peer.createAnswer();
            peer.setLocalDescription(answer);
        } catch (err) {
            if (callback) callback(err, null);
            callback = null;
        }
    };

    const addAnswer = async (answer, callback) => {
        try {
            if (peer.remoteDescription !== null)
                throw "already have remote description";
            await peer.setRemoteDescription(answer);
            callback(null, "added");
        } catch (err) {
            callback(err, null);
        }
    };

    const handleOnStatechange = () => {
        peer.onconnectionstatechange = () => {
            console.log(peer.connectionState);
        };
    };
    const readyFileToSend = () => {
        if (!file) return;
        idx = 0;
        const reader = new FileReader();
        reader.onload = () => {
            fileBuffer = reader.result;
            updateDownloadStatus("downloadstarted")
            datachannel.send(
                JSON.stringify({
                    message: "start",
                    size: fileBuffer.byteLength,
                    name: file.name,
                })
            );
            file = {
                ...file,
                size: fileBuffer.byteLength,
            };
            sendFileInRecursive();
        };
        reader.readAsArrayBuffer(file);
    };

    const sendFileInRecursive = () => {
        let chunksize = 1000;
        if (idx >= fileBuffer.byteLength) {
            datachannel.send(JSON.stringify({ message: "end" }));
            return;
        }
        const end = idx + chunksize * 10;
        while (idx < end) {
            const chunk = fileBuffer.slice(idx, idx + chunksize);
            uploadDownloadProgress(file.size, idx + chunksize);
            idx += chunksize;
            datachannel.send(chunk);
        }
    };

    const chunksFileDownload = (channel) => {
        const blob = new Blob(chunks);
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = file.fileName;
        downloadLink.click();
        channel.send(JSON.stringify({ message: "downloadcompleted" }));
    };

    const handleChannel = (channel) => {
        if (channel) {
            channel.onopen = () => {
                if (type === 0) {
                    readyFileToSend();
                }
            };

            channel.onmessage = (e) => {
                let data = e.data;
                console.log(data);
                if (typeof data === "string") {
                    data = JSON.parse(data);
                    switch (data.message) {
                        case "start":
                            chunks = [];
                            updateDownloadStatus("downloadstarted");
                            file = {
                                fileName: data.name,
                                fileSize: data.size,
                            };
                            return;
                        case "end":
                            chunksFileDownload(channel);
                            updateDownloadStatus("downloadcompleted");
                            return;
                        case "sendNext":
                            sendFileInRecursive();
                            return;
                        case "downloadcompleted":
                            updateDownloadStatus("downloadcompleted");
                            return;
                    }
                } else {
                    chunks.push(data);
                    uploadDownloadProgress(file.fileSize, chunks.length * 1000);
                    if (chunks.length % 10 === 0) {
                        channel.send(JSON.stringify({ message: "sendNext" }));
                    }
                }
            };
        }
    };

    const setFile = (_file) => {
        file = _file;
    };

    const uploadDownloadProgress = (total, sended) => {
        downloadingStatusListeners.forEach((item) =>
            item({
                status: "downloading",
                percentage: parseFloat((sended / total) * 100),
            })
        );
    };

    const updateDownloadStatus = (status) => {
        statusListeners.forEach((item) => item(status));
    };

    const addEventListener = (type, callback) => {
        if (type === "downloadstatus")
            downloadingStatusListeners.push(callback);
        if (type === "downloadstarted") {
            statusListeners.push(callback);
        }
    };

    return {
        createOffer,
        createAnswer,
        addAnswer,
        handleOnStatechange,
        setFile,
        addEventListener,
    };
};

export default useConnection;
