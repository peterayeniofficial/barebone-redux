// Library Code

// generate id helper function
function generateId () {
    return Math.random().toString(36).substring(2) + (new Date().getTime().toString(36))
}

function crateStore (reducer) {
    // The store should have four parts

    // The state
    let state
    let listeners = []
   
    // Get the state
    const getState = () => state

    // Listen to changes on the state
    const subscribe = (listener) => {
        listeners.push(listener)
        return () => {
            listeners = listeners.filter((l) => l !== listener) 
        }
    }

    // Update the state
    // Rule 1
    // Only an event can change the state of the store
    // Rule 2
    // The function that returns the new state needs to be a pure function
    const dispatch = (action) => {
        state = reducer(state, action)
        listeners.forEach((listener) => listener())
    }

    return {
        getState,
        subscribe,
        dispatch
    }
}

// App Code

const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GAOL = 'REMOVE_GOAL'

// Action Creators
function addTodoAction (todo) {
    return {
        type: ADD_TODO,
        todo
    }
}

function removeTodoAction (id) {
    return {
        type: REMOVE_TODO,
        id
    }
}

function toggleTodoAction (id) {
    return {
        type: TOGGLE_TODO,
        id
    }
}

function addGoalAction (goal) {
    return {
        type: ADD_GOAL,
        goal
    }
}

function removeGoalAction (id) {
    return {
        type: REMOVE_TODO,
        id
    }
}

// todos reducer
function todos (state = [], action) {
    switch(action.type){
        case ADD_TODO:
            return state.concat([action.todo])
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo :
            Object.assign({}, todo, {complete: !todo.complete}))
        default:
            return state

    }
}

// goals reducer
function goals (state = [], action) {
    switch(action.type) {
        case ADD_GOAL:
            return state.concat([action.goal])
        case REMOVE_GAOL:
            return state.filter((goal) => goal.id !== action.id)
        default:
            return state
    }
}

function app (state = {}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action)
    }
}

// create store
const store = crateStore(app)

// update DOM
store.subscribe(() => {
    const {goals, todos} = store.getState()

    document.getElementById('goals').innerHTML = ''
    document.getElementById('todos').innerHTML = ''


    goals.forEach(addGoalToDom)
    todos.forEach(addTodoToDom)
})

// action dispatchers

// DOM code
function addTodo () {
    const input = document.getElementById('todo')
    const name = input.value
    input.value = ''

    store.dispatch(addTodoAction({
        name,
        complete: false,
        id: generateId()

    }))
}


function addGoal () {
    const input = document.getElementById('goal')
    const name = input.value
    input.value = ''

    store.dispatch(addGoalAction({
        name,
        id: generateId()
    }))

}

document.getElementById('todoBtn').addEventListener('click', addTodo)
document.getElementById('goalBtn').addEventListener('click', addGoal)

function createRemoveButton (onClick) {
    const removeBtn = document.createElement('button')
    removeBtn.innerHTML = 'X'
    removeBtn.addEventListener('click', onClick)
    return removeBtn
}

function addTodoToDom (todo) {
    const node = document.createElement('li')
    const text = document.createTextNode(todo.name)

    const removeBtn =  createRemoveButton(() => {
        store.dispatch(removeTodoAction(todo.id))
    })
    node.appendChild(text)
    node.appendChild(removeBtn)
    node.style.textDecoration = todo.complete ? 'line-through' : 'none'
    node.addEventListener('click', () => {
        store.dispatch(toggleTodoAction(todo.id))
    })

    document.getElementById('todos').appendChild(node)

}

function addGoalToDom (goal) {
    const node = document.createElement('li')
    const text = document.createTextNode(goal.name)

    const removeBtn = createRemoveButton(() => {
        store.dispatch(removeGoalAction(goal.id))
    })

    node.appendChild(text)
    node.appendChild(removeBtn)

    document.getElementById('goals').appendChild(node)
    
}



