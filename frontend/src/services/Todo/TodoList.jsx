// Update the header section in TodoList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const navigate = useNavigate();
  
  // Get username from localStorage
  const username = JSON.parse(localStorage.getItem('user'))?.username || 'User';

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Todo App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/user-settings')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {username}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>


      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
   
        <div className="bg-white shadow rounded-lg mb-6">
          <form onSubmit={handleAddTodo} className="p-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Todo
              </button>
            </div>
          </form>
        </div>

        {/* Todo list */}
        <div className="bg-white shadow rounded-lg">
          {todos.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No todos yet. Add some above!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map(todo => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span
                      className={`ml-3 ${
                        todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;