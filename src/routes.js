import { createBrowserRouter } from "react-router-dom";
import SendFile from "./Routes/SendFile";
import DownloadFile from "./Routes/DownloadFile";
import useConnection from "./hooks/useConnection";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <SendFile />,
    },
    {
        path: "/downloadfile/:id",
        element: <DownloadFile />,
    },
]);


export default routers