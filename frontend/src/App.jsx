import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./services/Auth/Loginform";  
import TodoList from "./services/Todo/TodoList";    
import RegisterForm from "./services/Auth/RegisterForm"; 
import UserSettings from "./services/User/UserSettings";  
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <a href="/" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">Todo App</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} /> 
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
          <Route
          path="/user-settings"
          element={
            <PrivateRoute>
              <UserSettings />
            </PrivateRoute>
          }
        />
          <Route path="/" element={<Navigate to="/todos" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;