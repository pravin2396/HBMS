import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen overflow-hidden flex bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto min-w-0">
            <AppRoutes />
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-slate-900 text-slate-100 border border-slate-800 shadow-xl rounded-xl"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
