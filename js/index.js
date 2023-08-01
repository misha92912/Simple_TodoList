
let todos = null;
let todosElem = null;
document.addEventListener('DOMContentLoaded', async () => {
    
    todos = new Todos();
    await todos.init()
    todosElem = document.querySelector('.todos');
    showTodos(todos.todos);
});

document.forms.addTodo
    .addEventListener('submit', async function(event) {
        event.preventDefault();

        todos = new Todos();
        await todos.init();
        const value = this.elements.todo.value.trim();
        if (!value) { return; }
        const id = Date.now();
        const completed = false;
        const selected = false;
        const deleted = false;
        const hidden = false;
        todos.push({ title: value, id, completed, selected, deleted, hidden });
        showTodos(todos.todos);

        this.reset();
    });

function showTodos(todos) {
    todosElem.innerHTML = '';
    todos = [...todos.filter((obj)=>{return !obj['completed']}), ...todos.filter((obj)=>{return obj['completed']})]
    todos.forEach((todo) => 
        todosElem.append((new TodoComponent(todo)).element));
}

















