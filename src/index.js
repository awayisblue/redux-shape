
let defaultConfig = {
    delimiter:'.',
}
let _combineReducers
let _appliedConfig
let convert = (leaf,prefix,delimiter)=>{
    let reducer = leaf.reducers
    let initState = leaf.state
    let actionReducers = []
    let keys = Object.getOwnPropertyNames(reducer)
    for(let i=0;i<keys.length;i++){
        let key = keys[i]
        actionReducers.push({
            actionType: prefix+delimiter+key,
            reducer:reducer[key]
        })
    }
    return (state=initState,action)=>{
        let actionReducer = actionReducers.find((actionReducer)=>action.type==actionReducer.actionType)
        if(actionReducer)return actionReducer.reducer(state,action)
        return state
    }
}

let  generateReducer = (shape,prefix,delimiter,custom)=>{
    let keys = Object.getOwnPropertyNames(shape)
    let combine = {}
    for(let i=0;i<keys.length;i++){
        let key = keys[i]
        let property = shape[key]
        let actualPrefix = prefix?(prefix+delimiter+key):key
        let type = typeof property
        if(type=='object'){
            combine[key] = generateReducer(property,actualPrefix,delimiter)
        }else if(type=='function'){
            combine[key] = convert(property(),actualPrefix,delimiter)
        }else{
            throw new Error('unsupported property type, should be object or function')
        }
    }
    if(custom){
        if(typeof custom!=='object'){
            throw new Error('custom in config should be an object')
        }
        let keys = Object.getOwnPropertyNames(custom)
        for(let i=0;i<keys.length;i++){
            let key = keys[i]

            let reducer = custom[key]
            if(typeof reducer!=='function'){
                throw new Error('custom reducer should be functions')
            }
            combine[key] = reducer
        }
    }
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
    let {shape,delimiter,custom} = _appliedConfig
    return generateReducer(shape,'',delimiter,custom)
}