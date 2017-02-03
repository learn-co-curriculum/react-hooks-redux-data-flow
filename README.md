Using Pure Functions To Update Application State
==============

In this lesson, you will learn the following:
* Learn how pure functions update our application state.
* Learn the fundamentals of the redux flow.
* Learn how to adhere to the constraints of a pure function.

## Review

So far we know that all of our state is in a javascript object, and that our actions are in another javascript object called an action.  Somehow the action updates our state.

Let's take a look at an example:

```javascript
let state = {count: 0}
let action = {type: 'INCREASE_COUNT'}
```

Somehow I want to send this action to the state so that at the end my state is updated to look at the following:

`state -> {count: 1}`

But how??

## Function To The Rescue

This seems easy enough.  Why not just write a function that takes in our previous state, takes in our action, and depending on that action produces a new state.  Here's what it could look like:

```javascript
function changeState(state, action) {
  if (action.type === 'INCREASE_COUNT') {
    return {count: state.count + 1 }
  }
}
```

That's pretty straightforward code.  If the action's type property is the String `'INCREASE_COUNT'` then go ahead and increment and return the new state.

The important piece of information we looked at to determine how to change the state was `action.type`.  Actions always need a `type` property so the function knows what to do. If you can imagine a whole bunch of different actions that change the state in different ways, `'DECREASE_COUNT'`, `'INCREASE_COUNT_BY_TEN'` and so on, it shouldn't be hard to see how that code could become very messy with a bunch of `if`s and `else if`s.  Instead, it is customary to use a `switch case` statement.

```javascript
function changeState(state, action){
  switch (action.type) {
    case 'INCREASE_COUNT':
      return {count: state.count + 1}
  }
}
```

This makes it very explicit and clear that `action.type` is the information we are switching on to make our decision on how to change the state.

We'll talk about this more in-depth later, but it is important that when we change the state we never return `null` or `undefined`.  We'll cover this by adding a `default` case to our function.

```javascript
function changeState(state, action){
  switch (action.type) {
    case 'INCREASE_COUNT':
      return {count: state.count + 1}
    default:
      return state;
  }
}
```

And that's it!

```javascript
let state = {count: 0}
let action = {type: 'INCREASE_COUNT'}

changeState(state, action)
// => {count: 1}
```

Ok, so if you copy and paste that code into a javascript console, you'll see that we the function works just as expect. The state and action are passed to our changeState function, which hits the 'INCREASE_COUNT' case statement.  Then it takes the state's count of zero, adds one to it, and returns a new object {count: 1}.  

Now let's have this function respond to another action, decrease count.  Give it a shot, the answer is below.


```javascript
function changeState(state, action){	  
  switch (action.type) {
    case 'INCREASE_COUNT':
      return {count: state.count + 1}
    case 'DECREASE_COUNT'
    	return {count: state.count - 1}
    default:
      return state;
  }
}
    let state = {count: 0}

changeState(state, {type: 'INCREASE_COUNT'})
	// => {count: 1}
changeState(state, {type: 'DECREASE_COUNT'})
	// => {count: -1}
```

Ok! That my friends, is the crux of redux. To summarize:

`Action -> Function -> Updated State`

And let's give this function a name.  Because it is combining two pieces of information and reducing this combination into one value, we'll say that it reduces the state and the action into one updated state.  We call this function a reducer.  So:

`Action -> Reducer -> Updated State`

As you learn more about redux, things may become more complex.  Just remember that at the core of redux is always this flow.  An action gets sent to a reducer which then updates the state of the application.

## TWIST
You may notice a problem.  Which is that while we can call the changeState reducer to increase the count from zero to one, if we call change state again we keep returning a count as one.  In other words, we are not persisting this change of state.  Just ignore this problem for now, we'll tackle it in an upcoming section.

## Reducers are pure functions

```javascript
function reducer(state, action){	  
    switch (action.type) {
      case 'INCREASE_COUNT':
        return {count: state.count + 1}
      case 'DECREASE_COUNT'
      	return {count: state.count - 1}
      default:
        return state;
    }
  }
```

An important thing to note about reducers is that they are pure functions.  Let's remember the characteristics of pure functions:

1. Pure functions are only determined by their input values
2. Pure Functions have no side effects.  By this we mean pure functions do not have any effect outside of the function.  They only return a value.

> Note: The reason we like pure functions so much is because if a function has no effect outside of the object, and if the function always returns the same value given a specific input, this means that our functions become really predictable.  In addition, the lack of side effects means that the functions are also contained, and can be used safely without effecting the rest of your application.

Ok, so let's take these two characteristics of pure functions in turn, and ensure that we are adhering to them here.

Ok, so the first characteristic of pure functions means that given the same input of the function, I will always receive the same output from that function. That seems to hold, given a specific state object like {count: 2} and an action object like {type: 'DECREASE_COUNT'} will I always get back the same value?  Yes. Given those two arguments, the output will always be {count: 1}.

As for the no side effects, there's something a pretty subtle going on in our reducer.  The object returned is not the same object that is passed as an argument to the function, but rather a new object that is constructed each time our reducer is called.  Do you see why?  Take a close look at the line that says `return {count: state.count + 1}`.  This line is constructing a new javascript object and setting its count attribute to equal the previous state's count plus one.  So we adhere to the constraints of a pure function by not changing any value that is defined outside of the function.

## Summary

1. We hold our application's state in one plain old javascript object, and we update that state by passing both an action, and the old state to our reducer.  Our reducer returns to us our new state.
2. So to change our state we (1) create an **action**, an action is just a plain object with a `type` key (2) and pass the action as an argument when we call the **reducer**, which is just a function with a switch/case statement, which (3) produces a new state.
3. Our reducer is a pure function which means that given the same arguments of state and action, it will always produce the same new state.  Also it means that our reducer never updates the previous state, but rather creates a new state object.
