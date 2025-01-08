import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function App() {
  const BASE_URL = "http://localhost:5001";

  const [todos, setTodos] = useState([]);
  console.log("todo", todos);

  const getTodo = async () => {
    const res = await axios(`${BASE_URL}/api/v1/todos`);
    const todosFromServer = res?.data?.data;
    console.log("todosFromServer ", todosFromServer);
    setTodos(todosFromServer);
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    try {
      event.preventDefault();
      const todoValue = event.target.children[0].value;

      await axios.post(`${BASE_URL}/api/v1/todo`, {
        todo: todoValue,
      });
      getTodo();

      event.target.reset();
    } catch (err) {}
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/todo/${todoId}`);
      toast(res.data?.message);
      getTodo();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-blue-200 to-indigo-400 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-500 transform hover:scale-105">
        <h1 className="text-4xl font-bold text-indigo-600 text-center mb-8 animate__animated animate__fadeIn">
          Todo App
        </h1>

        {/* Input Section */}
        <form onSubmit={addTodo} className="mb-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your task"
            required
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition-all duration-300 hover:border-indigo-600"
          />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all">
            Add Task
          </button>
        </form>

        {!todos?.length && (
          <div className="text-center text-gray-500">No todos available</div>
        )}

        {/* Todo List */}
        <ul className="mt-6 space-y-6">
          {todos?.map((todo, index) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {!todo.isEditing ? (
                <span className="text-gray-700">{todo.todoContent}</span>
              ) : (
                <input
                  type="text"
                  value={todo.todoContent}
                  className="border-2 border-gray-400 p-2 rounded-md"
                />
              )}

              <div className="space-x-4">
                {!todo.isEditing ? (
                  <button
                    onClick={() => {
                      const newTodos = todos.map((todo, i) => {
                        if (i === index) {
                          todo.isEditing = true;
                        } else {
                          todo.isEditing = false;
                        }
                        return todo;
                      });
                      setTodos([...newTodos]);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 focus:outline-none transition-all duration-300"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const newTodos = todos.map((todo, i) => {
                        todo.isEditing = false;
                        return todo;
                      });
                      setTodos([...newTodos]);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 focus:outline-none transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}

                {!todo.isEditing ? (
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-700 focus:outline-none transition-all duration-300"
                  >
                    Delete
                  </button>
                ) : (
                  <button className="text-green-600 hover:text-green-700 focus:outline-none transition-all duration-300">
                    Save
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
