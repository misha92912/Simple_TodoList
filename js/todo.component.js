const selectAll = document.querySelector('.select-all');
selectAll.style.display = 'none';
const timeNow = new Date().toLocaleString();

class TodoComponent {
    #elem = null;

    constructor(todo) {
        this.#init(todo);
    }

    #init(todo) {
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        const time = document.createElement('span');
        
        const buttonsContainer = document.createElement('div');
        const done = document.createElement('span');
        const selectLabel = document.createElement('label');
        const selectInput = document.createElement('input');
        const del = document.createElement('span');
        const edit = document.createElement('span');
        const lsArr = JSON.parse((localStorage.getItem('MY_TODOS'))) ;
        
        buttonsContainer.classList.add('unselectable', 'buttons-container');
        time.classList.add('unselectable', 'time');
        done.setAttribute('class', 'done');
        del.setAttribute('class', 'delete');
        edit.setAttribute('class', 'edit');
        
        selectLabel.setAttribute('class', 'select');
        selectLabel.setAttribute('for', `select_${todo.id}`);
        selectInput.setAttribute('name', `select_${todo.id}`);
        selectInput.setAttribute('type', 'checkbox');
        div.setAttribute('data-id', todo.id);
        div.classList.add('todo');

        if(todo['completed']){
            done.style.backgroundColor = 'rgba(17, 174, 0, 0.7)';
            div.style.opacity = 0.75;
            h3.style.textDecoration = 'line-through'
        }
        if(todo['deleted']){
            del.style.backgroundColor = 'red';
            done.style.display = 'none'
            edit.style.display = 'none'
        }
        
        if(todo['hidden']){
            div.style.display = 'none'
        }
        if(todo['selected']){
            selectLabel.style.backgroundColor = 'rgb(0, 132, 226)'; 
            div.style.outline = '5px solid rgb(0, 132, 226)';
            selectAll.style.display = 'block';
            selectInput.checked = true;
        }
        

        h3.innerText = todo.title;
        if(Number.isInteger(todo.id)){
            time.innerText = new Date(todo.id).toLocaleString();
        } else {
            time.innerText = timeNow;
        }

        del.innerText = '❌'
        done.innerText = '✔️'
        edit.innerText = '✏️'

        
        del.addEventListener('click', ({target})=>{
            const id = target.parentNode.parentNode.dataset.id;
            const el  = lsArr.find(element => {return +element['id'] === +id});
            let newArr  = lsArr.filter(element => {return +element['id'] !== +id});
            
            if(el['selected']){
                deleteAllSelected()
            }else updateTodoList(newArr);
        })
        done.addEventListener('click', ({target})=>{
            
            const id = target.parentNode.parentNode.dataset.id
            const el  = lsArr.find(element => {return +element['id'] === +id});
            el['completed']
                ? el['completed'] = false 
                : el['completed'] = true;
            let newArr  = lsArr.filter(element => {return +element['id'] !== +id});
            newArr.unshift(el)
            
            if(el['selected']){
                doneAllSelected(el['completed'])
            }else updateTodoList(newArr);
        })
        edit.addEventListener('click', editTodo)
        
        function editTodo({target}){
            edit.style.backgroundColor = 'white';
            edit.removeEventListener('click', editTodo);
            
            const id = target.parentNode.parentNode.dataset.id
            const h3 = target.parentNode.parentNode.getElementsByTagName('h3')[0]
            const cloneH3Clear = h3.cloneNode(false)
            const cloneH3Full = h3.cloneNode(true)
            h3.innerHTML = `<textarea>${h3.innerText}</textarea>`
            
            edit.addEventListener('click', compliteEdit)
            h3.addEventListener('keypress', compliteEdit)
            
            function compliteEdit(event){
                if (event.target.classList[0] === "edit" || event.key === 'Enter' && !event.shiftKey) {
                    const textarea = target.parentNode.parentNode.getElementsByTagName('textarea')[0]
                    h3.innerHTML = cloneH3Clear.innerHTML
                    const newArr  = lsArr.map(element => {
                        if(+element['id'] === +id){
                            textarea.value.length >= 1
                                ? element['title'] = textarea.value
                                : element['title'] = cloneH3Full.innerText
                        }
                        return element
                    });
                    updateTodoList(newArr);
                } else return;

                edit.removeEventListener('click', compliteEdit)
                h3.removeEventListener('keypress', compliteEdit)
                edit.addEventListener('click', editTodo)
                edit.style.backgroundColor = ''
            }
        }


        div.addEventListener('click', selectTodo)
        function selectTodo(event){
            event.preventDefault()
            if( event.target.classList[0] === 'select'
                || event.target.localName ==='h3'
                || event.target.classList[0] === 'todo' ){
                
                let todo;

                event.target.classList[0] === 'todo'
                    ? todo = event.target
                    : todo = event.target.parentElement
                const id = todo.dataset.id;
                let bool = checkSelector(todo)
                if(event.ctrlKey){
                    const newArr  = lsArr.map(element => {
                        if (+element['id'] === +id){
                            element['selected'] = bool
                        }
                        return element
                    });
                    updateTodoList(newArr);
                } else {
                    const newArr  = lsArr.map(element => {
                        if (+element['id'] === +id){
                            element['selected'] = bool
                        } else {
                            element['selected'] = false
                        }
                        return element
                    });
                    updateTodoList(newArr);
                }
                
            }
            
            
            function checkSelector(todo){
                const checkbox = todo.getElementsByTagName('input')[0]
                
                checkbox.checked
                    ? checkbox.checked = false
                    : checkbox.checked = true

                return checkbox.checked
            }
        }
        selectAll.addEventListener('click', selectAllFunc);
        buttonsContainer.append(del, edit, done);
        
        div.append(time, h3, buttonsContainer, selectLabel, selectInput);

        this.#elem = div;
    }

    get element() {
        return this.#elem;
    }
}

function selectAllFunc(lsArr){
    lsArr = JSON.parse((localStorage.getItem('MY_TODOS'))) ;
    const bool = lsArr.find(element => {return !element['selected']});
    const newArr = lsArr.map(element => {
        element['selected'] = Boolean(bool);
        return element;
    })
    updateTodoList(newArr);
}

function updateTodoList(array){
    localStorage.setItem('MY_TODOS', `[${array.map((obj)=>{return JSON.stringify(obj)})}]`);
    showTodos(array);

    array.find(element => element['selected'])
        ? selectAll.style.display = 'block'
        : selectAll.style.display = 'none'
}

function doneAllSelected(bool){
    lsArr = JSON.parse((localStorage.getItem('MY_TODOS'))) ;
    const newArr = lsArr.map(element => {
        if (element['selected']){
            element['completed'] = bool
        }
        return element
    });
    updateTodoList(newArr)
}

function deleteAllSelected(bool){
    lsArr = JSON.parse((localStorage.getItem('MY_TODOS'))) ;
    const newArr = lsArr.filter(element => {
        if (!element['selected']){
            return element
        }
    });
    updateTodoList(newArr)
}
