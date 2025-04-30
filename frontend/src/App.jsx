import "./App.css";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Outlet />
      <Toaster/>
    </div>
  );
}

export default App;
