import { formatDate } from './utils/date-utils.js';

document.addEventListener('DOMContentLoaded', () => { //empezamos con un DOMContenLoaded para cargar la información lo primero
    let toDoList = []; // Array para almacenar las tareas


    // Obtenemos referencias de nodos principales
    const form = document.getElementById('form');
    const undoneTasks = document.getElementById('undone-tasks');
    const wipTasks = document.getElementById('wip-tasks');
    const doneTasks = document.getElementById('done-tasks');


    // Agregar un event listener al formulario
    form.addEventListener('submit', addTask);

    function addTask(e) {
        e.preventDefault(); // Prevenir el envío del formulario para poder revisarlo antes

        // Separamos los bloques de contenido por constantes: 
        const newTask = {
            taskName: document.getElementById('task').value,
            taskDescription: document.getElementById('task-info').value,
            deadline: document.getElementById('deadline').value,
            priority: document.getElementById('priority').value,
            taskStatus: document.getElementById('task-status').value 
        };

        // Validar que todos algunos campos estén completos
        if (!newTask.taskName || !newTask.priority || !newTask.taskStatus) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Formateamos la fecha usando date-fns
        const formattedDate = formatDate(newTask.deadline); 


        // Creamos un nuevo nodo para generar la card de la tarea
        const taskCard = document.createElement('article');
        //A este nodo le añadimos la clase general para poder darle estilo
        taskCard.classList.add('task-card');
        taskCard.setAttribute('draggable', 'true'); //Añadimos el evento de drag al nodo
        taskCard.innerHTML = //Creamos la estructura del nodo generado
            `
            <article>
                <div class="task-info">
                    <p class="task-name">${newTask.taskName}</p>
                    <p class="task-definition">${newTask.taskDescription}</p>
                    <p class="deadline">${formattedDate}</p> 
                </div>
            </article>
            `;

         // Asignar eventos de "drag" a la tarjeta de la tarea
         taskCard.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", newTask.taskName); // Guardamos el nombre de la tarea
            event.target.classList.add("dragging");
        });

        taskCard.addEventListener("dragend", (event) => {
            event.target.classList.remove("dragging");
        });

        // Creamos la constante statusColumns para asignar la tarea a la columna correspondiente según el estado
        const statusColumns = {
            undone: undoneTasks,
            wip: wipTasks,
            done: doneTasks
        };
        
        // LÓGICAS 
        // Agregamos la tarea al HTML a la columna correspondiente con appendchild
        statusColumns[newTask.taskStatus].appendChild(taskCard);
        // Cambiar color nombre tarea con classList
        const taskNameElement = taskCard.querySelector('.task-name'); //Entramos en el nodo creado y obtenemos el nombre
        const priorityClass = `priority-${newTask.priority}` //
        taskNameElement.classList.add(priorityClass) //Añadimos la clase al nombre

      

        // Agregar la tarea al array
        toDoList.push(newTask);
        console.log('Tus tareas son:', toDoList);

        // Limpiamos los campos del formulario
        document.getElementById('task').value = '';
        document.getElementById('task-info').value = '';
        document.getElementById('deadline').value = '';
        document.getElementById('priority').value = '';
        document.getElementById('task-status').value = 'undone';
    }

    //Constante para el evento de drop 

    const statusColumns = [undoneTasks, wipTasks, doneTasks];

    statusColumns.forEach(column => {
        column.addEventListener("dragover", (event) => {
            event.preventDefault(); //Permitimos el drop
        });
        column.addEventListener("drop", (event) => {
            event.preventDefault(); //Permitimos el drop
            const draggingTask = document.querySelector(".dragging");
            if(draggingTask) {
                event.target.appendChild(draggingTask);

                const taskName = draggingTask.querySelector('.task-name').textContent;
                const updatedTask = toDoList.find(task => task.taskName === taskName);
                if (updatedTask) {
                    updatedTask.taskStatus = event.target.id; // Cambia el estado según la columna de destino
                    console.log(`Tarea "${taskName}" movida a ${updatedTask.taskStatus}`);
                }

            }
        });
    })


});
