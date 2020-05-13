const reducer = (
  state = {
    productos: [],
    ordenes: [],
  },
  action
) => {
  switch (action.type) {
    case "FETCH_PRODUCTOS":
      return {
        ...state,
        productos: action.payload,
      };
    case "FETCH_ORDENES":
      return {
        ...state,
        ordenes: action.payload,
      };

    case "LOG_OUT":
      state = undefined;
      break;
    default:
      return state;
  }
};

export default reducer;
