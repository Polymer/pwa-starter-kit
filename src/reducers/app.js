import { NAVIGATE } from '../actions/app.js';

const app = (state = {}, action) => {
  switch (action.type) {
    case NAVIGATE:
      const path = action.path === '/' ? '/view1' : action.path;
      const page = action.path.slice(1);
      return {
        ...state,
        page: page
      };
    default:
      return state;
  }
}

export default app;
