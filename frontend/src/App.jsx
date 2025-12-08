import { useEffect } from "react";
import { initAll } from "govuk-frontend";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    document.body.className +=
      " js-enabled" +
      ("noModule" in HTMLScriptElement.prototype
        ? " govuk-frontend-supported"
        : "");
    initAll();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
