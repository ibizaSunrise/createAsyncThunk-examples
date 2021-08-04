import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//createAsyncThunk
export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async function (_, { rejectWithValue, getState }) {
        console.log(getState().todos.todos)
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
            if (!response.ok) {
                throw new Error('Server Error')
            }
            const data = await response.json();
            return data;

        } catch (e) {
            return rejectWithValue(e.message)
        }

    }
)

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async function (id, { rejectWithValue, dispatch }) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Can\'t delete task. Server edrror.');
            }

            dispatch(removeTodo(id))
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const toggleStatus = createAsyncThunk(
    'todos/toggleStatus',
    async function (id, { rejectWithValue, dispatch, getState }) {
        const todo = getState().todos.todos.find(todo => todo.id === id)
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    completed: !todo.completed,
                })
            })
            if (!response.ok) {
                throw new Error('Can\'t toggle status. Server error.');
            }
            const data = await response.json();
            console.log(data)
            dispatch(toggleTodoComplete(id))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addNewTodo = createAsyncThunk(
    'todos/addNewTodo',
    async function (text, { rejectWithValue, dispatch }) {
        try {
            const todo = {
                title: text,
                userId: 1,
                completed: false,
            }

            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo)
            })
            if (!response.ok) {
                throw new Error('Can\'t add task. Server error.');
            }

            const data = await response.json();
            //the same id and key: 201
            dispatch(addTodo(data))


        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)
//helper
const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload
}

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null
    },
    reducers: {
        addTodo(state, action) {
            state.todos.push(action.payload)
        },
        removeTodo(state, action) {
            state.todos = state.todos.filter(el => el.id !== action.payload)
        },
        toggleTodoComplete(state, action) {
            let toggledTodo = state.todos.find(todo => todo.id === action.payload);

            if (toggledTodo) toggledTodo.completed = !toggledTodo.completed;
        },
    },
    extraReducers: {
        [fetchTodos.pending]: (state, action) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchTodos.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.todos = action.payload
        },
        [fetchTodos.rejected]: setError,
        [deleteTodo.rejected]: setError,
        [toggleStatus.rejected]: setError,
        [addNewTodo.rejected]: setError

    }

})



const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;

export default todoSlice.reducer;