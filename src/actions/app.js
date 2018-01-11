export const NAVIGATE = 'NAVIGATE';
export const SHOW_404 = 'SHOW_404';

export const navigate = (path) => {
  return {
    type: NAVIGATE,
    path
  };
};

export const show404 = (path) => {
  return {
    type: SHOW_404,
    path
  };
};
