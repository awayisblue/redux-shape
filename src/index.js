import {combineReducers} from 'redux'
let defaultConfig = {
    prefix:'',
    delimiter:'.',
}
let convert = (leaf,prefix,delimiter)=>{
    let reducer = leaf.reducers
    let initState = leaf.state
    let actionReducers = []
    Object.keys(reducer).forEach((key)=>{
        actionReducers.push({
            actionType: prefix+delimiter+key,
            reducer:reducer[key]
        })
    })
    return (state=initState,action)=>{
        let actionReducer = actionReducers.find((actionReducer)=>action.type==actionReducer.actionType)
        if(actionReducer)return actionReducer.reducer(state,action)
        return state
    }
}

let  generateReducer = (shape,prefix,delimiter)=>{
    let keys = Object.keys(shape);
    let combine = {}
    for(let key of keys){
        let property = shape[key]
        let actualPrefix = prefix?(prefix+delimiter+key):key
        if(typeof property!=='function'){
            combine[key] = generateReducer(property,actualPrefix,delimiter)
        }else{
            combine[key] = convert(property(),actualPrefix,delimiter)
        }
    }
    return combineReducers(combine)
}

export default (config={})=>{
    let appliedConfig = Object.assign({},defaultConfig,config)
    return generateReducer(appliedConfig.shape,appliedConfig.prefix,appliedConfig.delimiter)
}