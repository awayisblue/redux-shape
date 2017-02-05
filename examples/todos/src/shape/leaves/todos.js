const todos = {
  state:[],
  reducers:{
    addTodo:(state,action)=>{
      let newTodo = {
        id:action.id,
        text:action.text,
        completed:false
      }
      return [...state,newTodo]
    },
    toggleTodo:(state,action)=>{
      return state.map(t=>t.id===action.id?{...t,completed:!t.completed}:t)
    }
  }
}
export default todos
