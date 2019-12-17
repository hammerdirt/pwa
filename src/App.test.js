import React from 'react';
import ReactDOM from 'react-dom';
import AppStart from './AppStart';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppStart />, div);
  ReactDOM.unmountComponentAtNode(div);
});
