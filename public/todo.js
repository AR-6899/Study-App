// console.log('Todo script running')
const add_btn = document.querySelector('.add-btn');
const add_task = document.querySelector('.add-task');
const todo_list = document.querySelector('.todo-list');

const getList = async (done) => {
    let x;
    if (done == 0)
        x = await fetch('/todo');
    else
        x = await fetch(`/todo/${done}`);
    let response = x.json();
    return response;
}

const assignEvents = (task, checkbox, delete_btn) => {
    checkbox.addEventListener('click', async () => {
        let newVal = !task.isDone;
        let options = {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        };

        let p = await fetch(`/todo/${newVal}`, options);
        let response = await p.json();
        console.log(response);
        todo_list.innerHTML = "";
        renderList();
    })

    delete_btn.addEventListener('click', async () => {
        let options = {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        };

        let p = await fetch(`/todo`, options);
        let response = await p.json();
        console.log(response);
        todo_list.innerHTML = "";
        renderList();
    })
}

const createTask = (task) => {
    let checkbox = document.createElement('button')
    checkbox.className = 'checkbox';
    if (task.isDone)
        checkbox.innerHTML = `<span class="material-symbols-outlined">done</span>`;

    let desc = document.createElement('div');
    desc.className = 'task';
    desc.innerHTML = `${task.description}`;

    let delete_btn = document.createElement('button');
    delete_btn.className = 'delete-btn';
    delete_btn.innerHTML = `<span class="material-symbols-outlined">delete</span>`;

    let taskBox = document.createElement('div');
    taskBox.className = `taskbox`;
    taskBox.append(checkbox);
    taskBox.append(desc);
    taskBox.append(delete_btn);
    todo_list.append(taskBox);
    assignEvents(task, checkbox, delete_btn);
}

const renderList = async () => {
    let list, list1, list2;
    list = await getList('true');
    list1 = Array.from(list);
    list = await getList('false');
    list2 = Array.from(list);

    for (let i of list1) {
        createTask(i);
    }

    for (let i of list2) {
        createTask(i);
    }
}

add_btn.addEventListener('click', async () => {
    if (add_task.value) {
        let task = {
            "description": `${add_task.value}`,
            "isDone": false
        };

        let options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(task)
        };

        let p = await fetch(`/todo`, options);
        let response = await p.json();
        console.log(response);
        todo_list.innerHTML = "";
        add_task.value = "";
        renderList();
    }
})

renderList();