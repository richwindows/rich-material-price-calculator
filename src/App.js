import React from 'react';
import OrderForm from './components/OrderForm';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Production Calculation
              </h1>
              <p className="mt-1 text-blue-50">
                Professional Window & Door Manufacturing Solutions
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center">
              <div className="flex items-center text-blue-50 bg-blue-500/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">New Production Order</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Fill in the specifications below to calculate production measurements.
                </p>
              </div>
              <OrderForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Production Calculation. All rights reserved.
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <p className="text-xs text-gray-400">
                Professional Window & Door Manufacturing Solutions
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
