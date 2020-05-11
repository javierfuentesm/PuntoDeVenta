const reducer = (
  state = {
    productos: [],
  },
  action
) => {
  switch (action.type) {
    case "FETCH_PRODUCTOS":
      return {
        ...state,
        productos: action.payload,
      };

    case "LOG_OUT":
      state = undefined;
      break;
    default:
      return state;
  }
};

export default reducer;
