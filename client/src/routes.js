import React from 'react';
import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import AddPage from './pages/AddPage/AddPage';
import StatPage from './pages/StatPage';
import {Container, Row, Col} from 'reactstrap';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

function NotFoundPage() {
  return (
    <div>
      The page you have requested isn't registered on our records
    </div>
  )
}


function DeveloperLinks() {
    return (
        <div className="devbar">
			<span className="devbar-link"><Link to="/">AddPage</Link></span>
			<span className="devbar-link"><Link to="/stats">StatPage</Link></span>
        </div>
    )
}


const RouteComponent = () => (
    <Router>
		<Container>
			<Row>
				<Col>
					<DeveloperLinks />
				</Col>
			</Row>
			<Row>
				<Col>
					<Switch>
						<Route exact path="/" component={AddPage} />
						<Route path="/stats" component={StatPage} />
						<Route component={NotFoundPage} />
					</Switch>
				</Col>
			</Row>
		</Container>
    </Router>
)

export default RouteComponent;