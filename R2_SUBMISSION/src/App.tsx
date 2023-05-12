import './App.css';
import { Route, Routes } from "react-router-dom";
import { SIDEBAR_DATA } from "./components/Sidebar/SidebarItems";
import Sidebar from "./components/Sidebar";
import { Item } from "./components/Routes/[item]";

function App() {
  return (
    <div id="main">
      <Sidebar>
        <Routes>
          <Route path="/" element={<Item page="homepage" />} />
          <Route path="/templates/CreateTemplate" element={<Item page="createTemplate" />} />
          <Route path="/templates/EditTemplate/:temID" element={<Item page="editTemplate" />} />
          <Route path="/meditations/CreateMeditation/" element={<Item page="createMeditation" />} />
          <Route path="/meditations/EditMeditation/:medID" element={<Item page="editMeditation" />} />
          {SIDEBAR_DATA &&
            SIDEBAR_DATA.map((item, index) => {
              return <Route
                key={index}
                path={item.path}
                element={<Item page={item.name} />}
              />
            })}
        </Routes>
      </Sidebar>
    </div>
  );
}

export default App;
