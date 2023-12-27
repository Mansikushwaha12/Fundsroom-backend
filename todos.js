document.getElementById('addTodoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
  
    try {
      const response = await fetch(`/todos/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        alert('ToDo added successfully');
      } else {
        alert('Failed to add ToDo');
      }
    } catch (error) {
      console.error('Failed to add ToDo:', error);
    }
  });
  
  window.addEventListener('load', async () => {
    try {
      const response = await fetch(`/todos/${userId}`);
      if (response.ok) {
        const todos = await response.json();
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        todos.forEach(todo => {
          const li = document.createElement('li');
          li.textContent = `${todo.title} - ${todo.description}`;
          todoList.appendChild(li);
        });
      } else {
        alert('Failed to fetch ToDos');
      }
    } catch (error) {
      console.error('Failed to fetch ToDos:', error);
    }
  });
  