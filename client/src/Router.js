import React from 'react';
import {Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom';
import UpdatePage from './pages/UpdatePage';
import StatPage from './pages/StatPage';
import AddPage from './pages/AddPage';

const links = [
	{
		url: '/',
		name: 'add'
	}, 
	{
		url: '/update',
		name: 'update',
	},
	{
		url: '/stat',
		name: 'statistics'
	}
];

const RouterComponent = () => (
	<Router>
		<React.Fragment>
			<div className="navbar">
				{links.map((link, index) => (
					<div className="navbutton" key={index}>
						<Link to={link.url}>
							<span className="link">{link.name}</span>
						</Link>
					</div>
				))}
				<span id="navbar-text">Nav Bar</span>
			</div>
			<Switch>
					<Route exact path="/" component={AddPage} />
					<Route path="/update" component={UpdatePage} />
					<Route path="/stat" component={StatPage} />
			</Switch>
		</React.Fragment>
	</Router>
)

export default RouterComponent;