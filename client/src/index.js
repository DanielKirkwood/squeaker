// react
import React from 'react';
import ReactDOM from 'react-dom';

// redux
import { store } from './redux/store';
import { Provider } from 'react-redux';

// components
import App from './components/App';

// semantic ui css
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
