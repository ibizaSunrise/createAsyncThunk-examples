import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async function (_, {rejectWithValue, getState}) {
        console.log(getState().todos.todos)
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
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

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null
    },
    reducers: {
        addTodo(state, action) {
            console.log(state)
            console.log(action)
            state.todos.push({
                id: new Date().toString(),
                title: action.payload.text,
                completed: false,
            })
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
        [fetchTodos.rejected]: (state, action) => {
            state.status = 'rejected';
            state.error = action.payload
         },

    }

})


export const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;

export default todoSlice.reducer;