const mutation = {
  test(state, payload) {
    state.test = JSON.parse(JSON.stringify(payload));
  } 
  ,add(state,data)
  {
    // state.count=JSON.parse(data)  
  } 
};

export default mutation;
