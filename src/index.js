
let defaultConfig = {
    delimiter:'.',
}
let _combineReducers
let _appliedConfig
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
    keys.forEach((key)=>{
        let property = shape[key]
        let actualPrefix = prefix?(prefix+delimiter+key):key
        if(typeof property!=='function'){
            combine[key] = generateReducer(property,actualPrefix,delimiter)
        }else{
            combine[key] = convert(property(),actualPrefix,delimiter)
        }
    })
    return _combineReducers(combine)
}

export default (combineReducers,config)=>{
    if(typeof combineReducers !=='function'){
        throw new Error('combineReducers should be a function imported from redux!')
    }
    if(typeof config !=='object' ){
        throw new Error('config must be an Object!')
    }
    if(!config['shape']){
        throw new Error('config must contain your shape definition!')
    }
    _appliedConfig = Object.assign({},defaultConfig,config)
    _combineReducers = combineReducers
    let {shape,delimiter} = _appliedConfig
    return generateReducer(shape,'',delimiter)
}