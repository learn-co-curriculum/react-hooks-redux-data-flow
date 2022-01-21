// run this file from the console with "node index.js"

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

console.log(state);

state = changeState(state, { type: "counter/increment" });

console.log(state);

state = changeState(state, { type: "counter/decrement" });

console.log(state);
