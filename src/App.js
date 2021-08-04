import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {addNewTodo, deleteTodo, toggleStatus, fetchTodos} from './store/todoSlice'


function App() {
  const [text, setText] = useState('')
  const {status, error, todos} = useSelector(state => state.todos)
  const dispatch = useDispatch()

  function handlerClickAddTodo(){
    dispatch(addNewTodo(text))
    setText('')
  }

  function handleRemoveClick(e,id){
    e.preventDefault()
    dispatch(deleteTodo(id))
  }

  useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  return (
    <>
    <div className="App">
      <input type="text" value = {text} onChange = {e => setText(e.target.value)} />
      <button onClick = {handlerClickAddTodo}>add</button>
    </div>

    {status === 'loading' && <h2>Loading...</h2>}
    {error && <h2>An error occurred while processing your request: {error}</h2>}

    {todos.map(el => <div key = {el.id}>
      <input type="checkbox" checked = {el.completed} onChange = {() => dispatch(toggleStatus(el.id))}/>
      <span>{el.title}</span>
      <button onClick = {(e) => handleRemoveClick(e,el.id)}>X</button>
      </div>)}
    </>
  );
}

export default App;
