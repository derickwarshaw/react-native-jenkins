import { PropTypes as pt } from 'react';

// react-navigation types (https://reactnavigation.org/docs/navigators/navigation-prop)
export const navigationStateType = pt.shape({
  key: pt.string.isRequired,
  routeName: pt.string.isRequired,
  path: pt.string,
  params: pt.object
});

export const navigationType = pt.shape({
  dispatch: pt.func.isRequired,
  goBack: pt.func.isRequired,
  navigate: pt.func.isRequired,
  setParams: pt.func.isRequired,
  state: navigationStateType.isRequired
});
