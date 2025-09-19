import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface TodoState {
  id: string;
  todotext: string;
  completed: boolean;
}

const initialState: TodoState[] = [];

export const TodosSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.push({ id: action.payload, todotext: action.payload, completed: false });
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<TodoState>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          todotext: action.payload.todotext,
          completed: action.payload.completed,
        };
      }
    },
    completeTodo: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state[index].completed = true;
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state[index].completed = !state[index].completed;
      }
    },
    completeAllTodos: (state) => {
      for (let i = 0; i < state.length; i++) {
        state[i].completed = true;
      }
    },
    clearTodos: (state) => {
      state = [];
    },
    clearCompleted: (state) => {
      return state.filter((todo) => !todo.completed);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addTodo,
  deleteTodo,
  editTodo,
  completeTodo,
  completeAllTodos,
  clearTodos,
  clearCompleted,
  toggleTodo,
} = TodosSlice.actions;

export default TodosSlice.reducer;
