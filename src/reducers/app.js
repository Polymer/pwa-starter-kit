import { NAVIGATE, SHOW_404 } from '../actions/app.js';

const app = (state = {}, action) => {
  switch (action.type) {
    case NAVIGATE:
      const path = action.path === '/' ? '/view1' : action.path;
      const page = path.slice(1);
      return {
        ...state,
        page: page
      };
    case SHOW_404:
      return {
        ...state,
        page: 'view404'
      };
    default:
      return state;
  }
}

export default app;
