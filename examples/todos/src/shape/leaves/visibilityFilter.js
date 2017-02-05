

const visibilityFilter = {
	state:'showAll',
	reducers:{
		setVisibilityFilter:(state,action)=>{
			return action.filter
		}
	}
}
export default visibilityFilter