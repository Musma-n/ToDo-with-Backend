import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5002;

const todos = [];

app.use(express.json()); // To parse incoming JSON requests
app.use(cors({
  origin: ['https://todo-list-with-backend.netlify.app', 'http://localhost:5173',"https://to-do-with-backend-three.vercel.app/"],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type',
}));

// Get all todos
app.get('/api/v1/todos', (req, res) => {
  const message = todos.length === 0 ? 'No todos found' : 'Todos retrieved successfully';
  res.status(200).json({ data: todos, message });
});

// Add a new todo
app.post('/api/v1/todo', (req, res) => {
  const { todo } = req.body;

  // Handle case where the todo content is missing
  if (!todo) {
    return res.status(400).json({ message: 'Todo content is required' });
  }

  const newTodo = {
    todoContent: todo,
    id: String(new Date().getTime()),
  };

  todos.push(newTodo);
  res.status(201).json({ message: 'Todo added successfully', data: newTodo });
});

// Update an existing todo
app.patch('/api/v1/todo/:id', (req, res) => {
  const { id } = req.params;
  const { todoContent } = req.body;

  // Handle case where todo content is missing
  if (!todoContent) {
    return res.status(400).json({ message: 'New todo content is required' });
  }

  let isFound = false;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].todoContent = todoContent;
      isFound = true;
      break;
    }
  }

  if (isFound) {
    res.status(200).json({
      message: 'Todo updated successfully',
      data: { id, todoContent },
    });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/api/v1/todo/:id', (req, res) => {
  const { id } = req.params;

  let isFound = false;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {


      todos.splice(i, 1);

      isFound = true;
      break;
    }
  }

  if (isFound) {
    res.status(200).json({ message: 'Todo deleted successfully' });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Catch-all route for unrecognized paths
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

