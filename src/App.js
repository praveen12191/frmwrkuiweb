import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import AddColumn from './components/AddColumn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createContext, useEffect, useState } from "react"
import ViewTable from './components/ViewTable';
export const Context = createContext()

function App() {

  const [selectedTableName, setSelectedTableName] = useState('');
  return (
    <Context.Provider value={{ selectedTableName, setSelectedTableName }}>
    <BrowserRouter>
      <div>
        {/* Navigation links can be added here if needed */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addColumn" element={<AddColumn />} />
          <Route path="/viewTable" element={<ViewTable />} />
        </Routes>
      </div>
    </BrowserRouter>
    </Context.Provider>
  );
}

export default App;
