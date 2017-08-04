# 简介
使用redux写react项目时，我们通常把action及reducer分开来写，action type跟reducer的对应关系并不强，redux-shape的作用是让actionType跟reducer对应起来，reducer定义完成后，actionType也随之对应。
实际上redux-shape的灵感来自于[dvajs](https://github.com/dvajs/dva)，redux-shape的reducer写法跟dvajs是差不多一样的，只是redux-shape是一个非常轻量的工具(只有40多行代码)，而dvajs是一个框架（更像是redux+redux-shape+redux-saga+react-router的集合）。使用dvajs的项目，可以比较简单地重新使用redux-shape进行重构。

# 安装
```
npm install --save redux-shape
```

# 例子
- [redux-shape-example](https://github.com/awayisblue/redux-shape-example)

# 概念
`redux-shape` 有以下两个概念：

### leaf
leaf定义了**shape**里的叶子节点，我们会在leaf里写**state**及**reducer**

```js
let leaf = {
    state:"",
    reducers:{
    	changeText(state,action){
          let text = action.text
          return text;
    	},
    	clearText(state,action){
    	  return '';
    	}
    }
}
```

### shape
`shape` 使用 `leaf`来定义你的state形状。
```js
let shape = {
  text:()=>leaf,// leaf在定义时，需要由函数返回
}
```

# 如何使用
```js
  import {createStore,combineReducers} from 'redux'
  import reduxShape from 'redux-shape'
  let leaf = {
	state:"",
	reducers:{
		changeText(state,action){
		  let text = action.text
		  return text;
		},
		clearText(state,action){
		  return '';
		}
	}
  }
  let shape = {
	  text:()=>leaf,// a leaf should be returned inside a function.
  }
  let reducer = reduxShape(combineReducers,{shape:shape,delimiter:'.'})
  let store = createStore(reducer)
```

上面的代码使用redux-shape创建了一个redux store(如果你要使用dva风格的actionType，就把delimiter换成`/`)，注意我们需要把redux里的combineReducers函数传给redux-shape。
到此，调用 `store.getState()`会得到下面的对象：

```js
{
	text:''
}
```
你可以很轻易地改变state:
```js
store.dispatch({type:'text.changeText',text:'I am a text'})
```
这样，你的state就变成了：
```js
{
	text:'I am a text'
}
```

# Action类型
在你使用redux-shape创建了store之后，actionType也随之确定了，actionType遵循以下的规则：

```
<shapeProperty><delimiter><reducerName>
```
当我们定义下来面的shape时，
```js
let shape = {
  text:()=>leaf,// a leaf should be returned inside a function.
}
```

你可以通过`store.dispatch({type:'text.changeText',text:'some text'})`来改变你的text, 通过`store.dispatch({type:'text.clearText'})`来清除text的内容。

### 对嵌套state的支持
尽管嵌套state在react中是不推荐使用的，甚至在redux中都比较难找到构造嵌套state的方法，但redux-shape还是支持了这种写法（你应该尽量避免使用嵌套state），假如你定义了一个如下的嵌套state：

```
let nestedShape = {
	a:{
		text:()=>leaf
	},
	b:{
		text:()=>leaf
	}
}
```

调用 `store.getState()`会得到下面的对象：

```js
{
    a:{
        text:''
    },
    b:{
        text:''
    }
}
```

你就可以通过`store.dispatch({type:'a.text.changeText',text:'some text'})`改变`state.a.text`，通过 `store.dispatch({type:'b.text.changeText',text:'some text'})`改变 `state.b.text`

# 最后
如果上面的你还看不太懂，比较推荐的还是直接看用redux-shape写的[例子](https://github.com/awayisblue/redux-shape-example)。





