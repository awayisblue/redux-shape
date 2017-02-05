import { connect } from 'react-redux'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'showAll':
      return todos
    case 'showCompleted':
      return todos.filter(t => t.completed)
    case 'showActive':
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = (state) => ({
  todos: getVisibleTodos(state.todos,state.visibilityFilter)
})

const mapDispatchToProps = (dispatch)=>({
  onTodoClick: (id)=>dispatch({type:'todos.toggleTodo',id})
})

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
