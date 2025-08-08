import { Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList';

const App = () => {
  return (
     <Routes>
      <Route path="/" element={<TaskList />} />
    </Routes>
  )
}

export default App;