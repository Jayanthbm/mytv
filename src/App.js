import { BrowserRouter,Routes,Route, } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import VideoPage from "./Pages/VideoPage";
import "plyr-react/plyr.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={< HomePage />} />
        <Route path="/video/:id" element={<VideoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
