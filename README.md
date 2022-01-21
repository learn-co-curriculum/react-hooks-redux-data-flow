# Using Pure Functions to Update Application State

## Learning Goals

- Define what a pure function is
- Explain the fundamentals of the Redux flow
- Explain how pure functions update our application state

## Introduction

So far we know that all of our state is in a JavaScript object, and that our
actions are in another JavaScript object called an action. In this lesson, we
will learn the specifics of how Redux uses the action to update state.

## Functions to the Rescue

Let's take a look at an example:

```js
let state = { count: 0 };
let action = { type: "counter/increment" };
```

Somehow I want to apply this action to the current state so that at the end our
state is updated to look like the following: `state -> {count: 1}`.

This seems easy enough. We can simply write a function that takes in our
previous state and our action, and depending on that action produces a new
state. Here's what it could look like:

```js
function changeState(state, action) {
  if (action.type === "counter/increment") {
    return { count: state.count + 1 };
  }
}
```

That's pretty straightforward code. If the action's type property is the String
`'counter/increment'` then go ahead and increment the value of `count` and
return the new state.

The important piece of information we looked at to determine how to change the
state was `action.type`. Actions always need a `type` property so the function
knows what to do. If you can imagine a whole bunch of different actions that
change the state in different ways — `'counter/decrement'`,
`'counter/incrementByTen'` and so on — it shouldn't be hard to see how that code
could become very messy with a bunch of `if`s and `else if`s. Instead, it is
customary to use a `switch case` statement.

```js
function changeState(state, action) {
  switch (action.type) {
    case "counter/increment":
      return { count: state.count + 1 };
  }
}
```

This makes it very explicit that `action.type` is the information we are
switching on to make our decision about how to change the state.

We'll talk about this in depth later, but it is important that when we change
the state we never return `null` or `undefined`. We'll cover this by adding a
`default` case to our function.

```js
function changeState(state, action) {
  switch (action.type) {
    case "counter/increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}
```

This way, no matter what, when accessing the Redux state we'll always get some
form of the state back.

```js
let state = { count: 0 };
let action = { type: "counter/increment" };

state = changeState(state, action);
// => {count: 1}
```

Ok, so if you copy and paste that code into a JavaScript console, you'll see
that the function works just as we'd expect. The state and action are passed to
our `changeState function`, which hits the `'counter/increment'` case statement.
Then it takes the state's count of zero, adds one to it, and returns a new
object `{ count: 1 }`.

Now let's have this function respond to another action, decrease count. Try
giving it a shot yourself before looking at the answer.

```js
function changeState(state, action) {
  switch (action.type) {
    case "counter/increment":
      return { count: state.count + 1 };
    case "counter/decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

let state = { count: 0 };

state = changeState(state, { type: "counter/increment" });
// => {count: 1}

state = changeState(state, { type: "counter/decrement" });
// => {count: 0}
```

Ok! That my friends, is the crux of Redux. To summarize:

```txt
Action & Current State -> Function -> Updated State
```

Because our function is combining two pieces of information — our current state
and an action — and reducing this combination into one value, we say that it
_reduces_ the two into one updated state. For this reason, we call this function
a reducer:

```txt
Action & Current State -> Reducer -> Updated State
```

As you learn more about Redux, things may become more complex. Just remember
that this flow is always at the core of Redux. An **action** gets sent to a
**reducer** which then updates the state of the application.

## Reducers are pure functions

An important thing to note about reducers is that they are pure functions. Let's
remember the characteristics of pure functions:

1. The return value of a pure function is determined solely by its input values.

2. Pure functions have no side effects. By this we mean pure functions do not
   have any effect outside of the function itself. They only return a value.

> Note: The reason we like pure functions so much is because if a function has
> no side effects and always returns the same value given the same input, it
> becomes really predictable. In addition, the lack of side effects means that
> the functions are also contained, and can be used safely without affecting the
> rest of your application.

```js
function reducer(state, action) {
  switch (action.type) {
    case "counter/increment":
      return { count: state.count + 1 };
    case "counter/decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

Let's take these two characteristics of pure functions in turn, and ensure that
we are adhering to them here.

The first characteristic of pure functions means that given the same input to
the function, I will always receive the same output from that function. That
seems to hold; given a specific state object like `{count: 2}` and an action
object like `{type: 'counter/decrement'}`, will I always get back the same
value? Yes. Given those two arguments, the output will always be `{count: 1}`.

As for the 'no side effects' characteristic, there's something pretty subtle
going on in our reducer. The object returned is not the same object that is
passed as an argument to the function, but rather a new object that is
constructed each time our reducer is called. Do you see why? Take a close look
at the line that says `return {count: state.count + 1}`. This line is
constructing a new JavaScript object and setting its count attribute equal to
the previous state's count plus one. So we adhere to the constraints of a pure
function by not changing any value that is defined outside of the function.

## Conclusion

In this lesson, we learned more about how updates to state are handled in Redux.
Specifically, we learned that state is updated by a special type of function
known as a reducer, which contains a switch/case statement. The reducer takes as
arguments the current state and an **action**, which is a simple JavaScript
object that contains a `type` attribute. Then, based on the action `type`, the
reducer executes the matching `case` of the `switch` statement to update state.

In Redux, reducers are pure functions, which means that given the same arguments
of state and action, they will always produce the same new state. It also means
that our reducer never updates the previous state object, but rather creates a
new updated object.
