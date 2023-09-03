import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Routing from "./Routes/Routing";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import { useEffect } from "react";
import ReactModal from "react-modal";

function App() {
  useEffect(() => {
    ReactModal.setAppElement('#root');
  }, []);
  return (
    <>
      <ErrorBoundary>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
        <ToastContainer />
      </ErrorBoundary>
    </>
  );
}

export default App;
