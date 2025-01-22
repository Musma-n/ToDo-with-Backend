import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function App() {
  const BASEE_URL = "https://todo-api-orcin.vercel.app";

  const [todos, setTodos] = useState([]);

  const getTodo = async () => {
    try {
      const res = await axios(`${BASEE_URL}/api/v1/todos`);
      const todosFromServer = res?.data?.data;
      setTodos(todosFromServer);
    } catch (err) {
      err.response?.data?.message || "unknown error";
    }
  };
  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();

    const todoValue = event.target.children[0].value;

    try {
      await axios.post(`${BASEE_URL}/api/v1/todo`, {
        todo: todoValue,
      });
      getTodo();
      event.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Faild to add todo");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await axios.delete(`${BASEE_URL}/api/v1/todo/${todoId}`);
      console.log("response", res);

      toast.success(res?.message || "Todo deleted successfully");

      getTodo();
    } catch (err) {}
  };

  const editTodo = async (event, todoId) => {
    event.preventDefault();

    const todoValue = event.target.children[0].value;

    try {
      await axios.patch(`${BASEE_URL}/api/v1/todo/${todoId}`, {
        todoContent: todoValue,
      });
      
      toast.success("Todo edited successfully");
      getTodo();
      event.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Faild to edit todo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 flex items-center justify-center">
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
    <h1 className="text-4xl font-semibold text-indigo-700 text-center mb-8">
      Todo App
    </h1>

    {/* Input Section */}
    <form onSubmit={addTodo} className="mb-6 flex flex-col gap-4">
      <input
        type="text"
        required
        placeholder="Enter your task"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 transition-all duration-200"
      />
      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200">
        Add Task
      </button>
    </form>

    {!todos?.length && (
      <p className="text-center text-gray-500">
        No tasks available. Add your tasks here!
      </p>
    )}

    {/* Todo List */}
    <ul className="mt-8 space-y-6">
      {todos?.map((todo, index) => (
        <li
          key={todo.id}
          className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-indigo-100 hover:to-pink-100 transition-all duration-200"
        >
          {!todo.isEditing ? (
            <span className="text-gray-700 font-medium">{todo.todoContent}</span>
          ) : (
            <form
              onSubmit={(e) => editTodo(e, todo.id)}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                defaultValue={todo.todoContent}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200"
              >
                Save
              </button>
            </form>
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
                className="text-indigo-600 hover:text-indigo-700 focus:outline-none transition-all duration-200"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => {
                  const newTodos = todos.map((todo) => {
                    todo.isEditing = false;
                    return todo;
                  });
                  setTodos([...newTodos]);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
              >
                Cancel
              </button>
            )}
            {!todo.isEditing ? (
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-700 focus:outline-none transition-all duration-200"
              >
                Delete
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
}
