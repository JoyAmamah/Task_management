import { Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DarkModeToggle from "./components/DarkModeToggle";

const App = () => {
  return (
    <>
     <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
    </>
  );
};

export default App;
