// Library Code

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

function app (state, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action)
    }
}

// create store
const store = crateStore(app)

store.subscribe(() => {
    console.log('The new State is : ', store.getState())
})

// action dispatchers
store.dispatch(addTodoAction({
    todo: {
        id: 0,
        name: 'Learn Redux',
        complete: false
    }
}))

store.dispatch(addTodoAction({
    todo: {
        id: 1,
        name: 'Learn Javascript',
        complete: true
    }
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
    id: 0,
    name: "Learn Redux"
}))

store.dispatch(addGoalAction({
    id: 1,
    name: "Lose 20 Kg"
}))

store.dispatch(removeGoalAction(0))