const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

const taskTitle = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

function createTask(title) {
  const newTask = {
    title: title,
    completed: false
  };

  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(newTask),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(data => {
      const taskItem = createTaskElement(data);
      taskList.appendChild(taskItem);

      taskTitle.value = '';
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function readTasks() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      taskList.innerHTML = '';

      data.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function updateTask(taskId, completed, title) {
  const updatedTask = {
    title: title,
    completed: completed
  };

  fetch(`${apiUrl}/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedTask),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      const taskItem = document.getElementById(`task_${taskId}`);
      if (completed) {
        taskItem.classList.add('completed');
      } else {
        taskItem.classList.remove('completed');
      }
      taskItem.innerText = title;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function deleteTask(taskId) {
  fetch(`${apiUrl}/${taskId}`, {
    method: 'DELETE',
  })
    .then(response => {
      const taskItem = document.getElementById(`task_${taskId}`);
      taskList.removeChild(taskItem);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function createTaskElement(task) {
  const taskItem = document.createElement('li');
  taskItem.id = `task_${task.id}`;
  taskItem.innerText = task.title;
  if (task.completed) {
    taskItem.classList.add('completed');
  }

  taskItem.addEventListener('click', () => {
    updateTask(task.id, !task.completed, task.title);
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteTask(task.id);
  });
  taskItem.appendChild(deleteButton);

  const updateButton = document.createElement('button');
  updateButton.innerText = 'Update';
  updateButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const newTitle = prompt('Enter a new title:', task.title);
    if (newTitle !== null) {
      updateTask(task.id, task.completed, newTitle.trim());
    }
  });
  taskItem.appendChild(updateButton);

  return taskItem;
}

addButton.addEventListener('click', () => {
  const title = taskTitle.value;
  if (title !== '') {
    createTask(title);
  }
});

readTasks();
