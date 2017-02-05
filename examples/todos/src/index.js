import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reduxShape from 'redux-shape'
import shape from './shape'
const reducer = reduxShape({shape})

const store = createStore(reducer)
const unsubscribe = store.subscribe(()=>{
	console.log(store.getState())
})
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
