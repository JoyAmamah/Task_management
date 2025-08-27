import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DarkModeToggle from "./components/DarkModeToggle";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "./seo/SEO";

const TaskList = lazy(() => import("./components/TaskList"));

const App = () => {
  return (
    <>
      <HelmetProvider>

    <Suspense fallback={<p>Loading...</p>}>
     <div className="min-h-screen bg-white  ">
      <SEO/>
      <header className="flex justify-between items-center p-4 shadow">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <DarkModeToggle />
        </header>
      <Routes>
        <Route path="/" element={<TaskList />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      </div>
      </Suspense>
      </HelmetProvider>
    </>
  );
};

export default App;
