// Selecionando input de tarefas
const task = document.querySelector("#task");

// Selecionando botão de criação de tarefas
const createTask = document.querySelector("#createTask");

// Selecionando seção de tarefas não cadastradas
const unregisteredTasks = document.querySelector("#unregisteredTasks");

// Função para salvar dados no localStorage
function saveLocalStorage() {
  const tasks = Array.from(document.querySelectorAll("#registeredTasksId ul li")).map(taskListItem => {
    const checkbox = taskListItem.querySelector(".registeredTasksItemInput");
    const taskDescription = taskListItem.querySelector(".registeredTasksItemDescription").textContent;
    return {
      name: taskDescription,
      checked: checkbox.checked
    };
  });
  localStorage.setItem("tarefas", JSON.stringify(tasks));
}

// Função para criar elementos de tarefas
function createTaskButton(taskData) {
  // Criar um input do tipo checkbox
  const registeredTasksItemInput = document.createElement("input");
  registeredTasksItemInput.setAttribute("type", "checkbox");
  registeredTasksItemInput.setAttribute("class", "registeredTasksItemInput");
  registeredTasksItemInput.checked = taskData.checked;

  // Adicionar evento de mudança ao checkbox para atualizar as tarefas concluídas
  registeredTasksItemInput.addEventListener("change", () => {
    updateCompletedTasksCount();
    saveLocalStorage();
  });

  // Criar um span para a marca do checkbox
  const registeredTasksItemMark = document.createElement("span");
  registeredTasksItemMark.setAttribute("class", "registeredTasksItemMark");

  // Criar um span para a descrição da tarefa
  const registeredTasksItemDescription = document.createElement("span");
  registeredTasksItemDescription.setAttribute("class", "registeredTasksItemDescription");
  registeredTasksItemDescription.appendChild(document.createTextNode(taskData.name));

  // Criar uma imagem de ícone de lixeira para deletar a tarefa
  const trashIcon = document.createElement("img");
  trashIcon.setAttribute("class", "icone-trash");
  trashIcon.setAttribute("src", "assets/images/trash.svg");
  trashIcon.setAttribute("width", "24");
  trashIcon.setAttribute("height", "24");
  trashIcon.setAttribute("alt", "Ícone de lixeira para deletar tarefa");

  // Adicionar evento de clique no ícone de lixeira para remover a tarefa
  trashIcon.addEventListener("click", () => {
    taskList.remove(); // Remove o elemento <li>
    saveLocalStorage(); // Atualiza o localStorage após remover a tarefa
    updateTaskVisibility();
    tasksCreatedCount();
    updateCompletedTasksCount();
  });

  // Criar um label para agrupar os elementos da tarefa
  const registeredTasksItem = document.createElement("label");
  registeredTasksItem.setAttribute("class", "registeredTasksItem");
  registeredTasksItem.append(
    registeredTasksItemInput,
    registeredTasksItemMark,
    registeredTasksItemDescription
  );

  // Criar um elemento <li> para a tarefa
  const taskList = document.createElement("li");
  taskList.append(registeredTasksItem, trashIcon);

  return taskList;
}

// Função para atualizar a visibilidade das tarefas não cadastradas
function updateTaskVisibility() {
  const registeredTasksId = document.querySelector("#registeredTasksId ul");

  if (registeredTasksId.childElementCount === 0) {
    unregisteredTasks.classList.add("show");
    unregisteredTasks.classList.remove("remove");
  } else {
    unregisteredTasks.classList.add("remove");
    unregisteredTasks.classList.remove("show");
  }
}

// Função para atualizar o número de tarefas criadas
function tasksCreatedCount() {
  const registeredTasksId = document.querySelector("#registeredTasksId ul");

  // Selecionando e modificando o contador de tarefas criadas
  const tasksCreated = document.querySelector("#tasksCreated");
  tasksCreated.innerHTML = registeredTasksId.childElementCount;
}

// Função para atualizar o número de tarefas concluídas
function updateCompletedTasksCount() {
  const registeredTasksItemInputs = document.querySelectorAll(".registeredTasksItemInput");
  const completedTasks = Array.from(registeredTasksItemInputs).filter((input) => input.checked).length;

  const tasksCompleted = document.querySelector("#tasksCompleted");
  tasksCompleted.innerHTML = completedTasks;
}

// Função para criar lista de tarefas e atualizações
function createToDoList(inputValue) {
  // Selecionar a área onde posso inserir a lista de tarefas
  const registeredTasksId = document.querySelector("#registeredTasksId ul");

  // Criar um novo item de tarefa e adicionar à lista
  const newTask = createTaskButton({ name: inputValue, checked: false });
  registeredTasksId.appendChild(newTask);

  // Atualizar a visibilidade das tarefas não cadastradas
  updateTaskVisibility();

  // Atualizar o número de tarefas criadas
  tasksCreatedCount();

  // Atualizar o número de tarefas concluídas
  updateCompletedTasksCount();

  // Limpa o campo de input após adicionar nova tarefa
  task.value = "";

  // Removendo class quando o input é preenchido
  task.classList.remove("validateField");
  task.setAttribute("placeholder", "Adicione uma nova tarefa");

  // Salvando dados passados no input em localStorage
  saveLocalStorage();
}

// Função para validar input do formulário
function validateInput() {
  // Adicionando classe para preencher o input
  task.classList.add("validateField");
  task.setAttribute("placeholder", "Por favor, preencha o campo");
}

// Botão para realizar criação da lista de tarefas
createTask.addEventListener("click", (event) => {
  event.preventDefault();

  // Pegando valor que é passado no input
  const inputValue = task.value;

  // Validando campo do input formulário
  if (inputValue === "") {
    validateInput();
  } else {
    createToDoList(inputValue);
  }
});

// Após click no 'enter' adicionar tarefa
task.addEventListener("keypress", function (event) {
  // Pegando valor que é passado no input
  const inputValue = task.value;

  // Controlando para adicionar nova tarefa na lista após clicar no 'enter'
  if (event.key === "Enter") {
    event.preventDefault();

    if (inputValue === "") {
      validateInput();
    } else {
      createToDoList(inputValue);
    }
  }
});

// Função para carregar tarefas salvas no localStorage
function loadTasks() {
  const registeredTasksId = document.querySelector("#registeredTasksId ul");
  const tasks = JSON.parse(localStorage.getItem("tarefas")) || [];

  tasks.forEach(taskData => {
    const taskItem = createTaskButton(taskData);
    registeredTasksId.appendChild(taskItem);
  });

  updateTaskVisibility();
  tasksCreatedCount();
  updateCompletedTasksCount();
}

loadTasks();
