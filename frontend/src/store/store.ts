import { configureStore } from '@reduxjs/toolkit'
import classSlice from './slices/classSlice'
import counterSlice from './slices/counterSlice'
import schoolSlice from './slices/schoolSlice'
import studentSlice from './slices/studentSlice'
import teacherSlice from './slices/teacherSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    school: schoolSlice,
    teacher: teacherSlice,
    student: studentSlice,
    class: classSlice
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
