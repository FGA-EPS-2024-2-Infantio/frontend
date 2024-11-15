import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './slices/counterSlice'
import schoolSlice from './slices/schoolSlice'
import teacherSlice from './slices/teacherSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    school: schoolSlice,
    teacher: teacherSlice
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
