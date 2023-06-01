import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import firestore from "../firebase/firebase";

const useFirestore = () => {
    const waitforanswerlisteners = [];
    const addOfferSnapShotListener = (id, callback) => {
        const docRef = doc(firestore, "RTCconnection", id);
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (data.answer) {
                    callback(data.answer)
                }
            } else {
                console.log("Document does not exist");
            }
        });
    };

    const saveOfferAndFile = async (offer, file, callback) => {
        try {
            const data = await addDoc(collection(firestore, "RTCconnection"), {
                offer: JSON.stringify(offer),
                fileName: file.name,
                fileSize: file.size,
            });
            if (callback) callback(null, data);
            callback = null;
            
        } catch (err) {
            callback(err, null);
        }
    };

    const addEventListeners = (type, callback) => {
        if (type === "waitforanswer") {
            waitforanswerlisteners.push(callback);
        }
    };

    const getOfferSdpAndFile = async (docid, callback) => {
        try {
            const rtcConnectionDocRef = doc(firestore, "RTCconnection", docid);
            getDoc(rtcConnectionDocRef).then((res) => {
                if (res.exists()) {
                    callback(null, res.data());
                } else {
                    callback("not exists", null);
                }
            });
        } catch (err) {
            callback(err, null);
        }
    };

    const saveAnswer = async (docid, answer, callback) => {
        try {
            const _doc = doc(firestore, "RTCconnection", docid);
            await updateDoc(_doc, {
                answer,
            });
            if (callback) callback(null, "saved");
            callback = null;
        } catch (err) {
            callback(err, null);
        }
    };

    return {
        saveOfferAndFile,
        addEventListeners,
        getOfferSdpAndFile,
        saveAnswer,
        addOfferSnapShotListener
    };
};

export default useFirestore;
