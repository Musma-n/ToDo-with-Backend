import axios from 'axios';
import { useEffect, useState } from 'react';

export default function App() {
  const BASE_URL = 'http://localhost:5002';

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const getTodos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/todos`);
      setTodos(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();

    if (!newTodo.trim()) return; // Prevent adding empty todos

    try {
      await axios.post(`${BASE_URL}/api/v1/todo`, { todo: newTodo });
      setNewTodo(''); // Clear input field
      getTodos(); // Refresh todo list
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/todo/${id}`);
      getTodos(); // Refresh todo list after deletion
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-indigo-600 text-center mb-6">
          Todo App
        </h1>

        {/* Input Section */}
        <form onSubmit={addTodo} className="mb-6 flex space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter your task"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Add Task
          </button>
        </form>

        {/* Todo List */}
        <ul className="mt-6 space-y-4">
          {todos?.length > 0 ? (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-200"
              >
                <span className="text-gray-700">{todo.todoContent}</span>
                <div className="space-x-3">
                  <button className="text-indigo-600 hover:text-indigo-700 focus:outline-none">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center">No tasks available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}