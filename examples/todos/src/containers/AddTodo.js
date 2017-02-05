import React from 'react'
import { connect } from 'react-redux'

let AddTodo = ({ dispatch }) => {
  let input
  let todoId = 1
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch({type:'todos.addTodo',id:todoId++,text:input.value})
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
AddTodo = connect()(AddTodo)

export default AddTodo
