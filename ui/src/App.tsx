import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Stream from "./components/Stream";
import { ActivityIndicatorDemo } from "./components/Chat/ActivityIndicator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/stream" element={<Stream />} />
        <Route path="/activity" element={<ActivityIndicatorDemo />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
