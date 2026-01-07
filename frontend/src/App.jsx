import { useEffect } from "react";
import { initAll } from "govuk-frontend";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ViewTasks from "./pages/ViewTasks";
import ViewTask from "./pages/ViewTask";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";
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
          <Route path="/view" element={<ViewTasks />} />
          <Route path="/view/:id" element={<ViewTask />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
