class Todos {
    TODOS = 'MY_TODOS';
    #todos = [];
    lsd = null;

    constructor() {
        this.lsd = new LSD(this.TODOS);
    }

    async init() {
        const initData = this.lsd.read();
        if (initData) {
            this.#todos = initData;
        } else {
            this.lsd.write ([
                {"title": "ADD - добавить задание \n✔️ отметить выполненное задание \n✏️ отредактировать текст задания \n❌ удалить задание","id":`1`, "completed": false, "selected": false}
            ]);
            this.init()
        };
    }


    push(obj) {
        if (!('title' in obj) || !('id' in obj)) {
            return;
        }

        if (this.lsd.write([obj, ...this.#todos])) {
            this.#todos.unshift(obj);
        }
    }


    get todos() {
        return this.#todos;
    }
}
