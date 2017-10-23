const expect = require('chai').expect
const reduxShape = require('../lib/index').default
const combineReducers = require('redux').combineReducers
const createStore = require('redux').createStore

describe('#redux-shape',function(){
    let leaf = {
        state:"",
        reducers:{
            change(state,action){
                let text = action.text
                return text;
            },
            clear(state,action){
                return '';
            }
        }
    }

    let mockShape =  {
        text:()=>leaf,// a leaf should be returned inside a function.
    }
    let wrongShape =  {
        text:1,
    }
    it('should throw error when shape property is not a function or object',function(){
        var fn = function(){
            let reducers = reduxShape(combineReducers,{shape:wrongShape})
        }
        expect(fn).to.throw(Error)
    })
    it('should throw error when combineReducers is not a function',function(){
        var fn = function(){
            let reducers = reduxShape(null,{shape:mockShape})
        }
        expect(fn).to.throw(Error)
    })
    it('should throw error when config is not an Object',function(){
        var fn = function(){
            let reducers = reduxShape(combineReducers,null)
        }
        expect(fn).to.throw(Error)
    })
    it('should throw error when config not contains \'shape\' property',function(){
        var fn = function(){
            let reducers = reduxShape(combineReducers,{})
        }
        expect(fn).to.throw(Error)
    })

    it('should return reducers as a function when combineReducers and config are correct',function(){

            let reducers = reduxShape(combineReducers,{shape:mockShape})


        expect(reducers).to.satisfy(function(reducers){
            return typeof reducers === 'function'
        })
    })

})

describe('#store',function(){
    let leaf = {
        state:"",
        reducers:{
            change(state,action){
                let text = action.text
                return text;
            },
            clear(state,action){
                return '';
            }
        }
    }

    let mockShape =  {
        text:()=>leaf,// a leaf should be returned inside a function.
    }
    let reducer = reduxShape(combineReducers,{
        shape:mockShape,
        custom:{
            custom:(state='',action)=>{
                if(action.custom)return action.custom
                return state
            }
        }
    })
    let store = createStore(reducer)
    let dispatch = store.dispatch
    let getState =  store.getState

    it('should get correct state shape',function(){
        let state = getState()
        expect(state).to.satisfy((state)=>{
            
            return state.text == ''&&state.custom==''
        })
    })
    it('should satisfy that state changes after dispatching an action',function(){
        dispatch({type:'text.change',text:'change text'})
        let state = getState()
        expect(state).to.satisfy((state)=>{
            return state.text == 'change text'
        })
    })
    it('should satisfy that state not changes after dispatching an action that not exists',function(){
        dispatch({type:'text.notExists',text:'I am a text'})
        let state = getState()
        expect(state).to.satisfy((state)=>{
            return state.text == 'change text'
        })
    })
    it('should get correct result when custom config is specified',function(){
        dispatch({type:'custom',custom:'I am a text'})
        let state = getState()
        expect(state).to.satisfy((state)=>{
            return state.custom == 'I am a text'
        })
    })

})

