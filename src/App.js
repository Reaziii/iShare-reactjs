import "./App.css";
import SendFile from "./Routes/SendFile";
import useConnection from "./hooks/useConnection";
function App() {
    const connection = useConnection(0);
    return <SendFile connection={connection} />;
}

export default App;
