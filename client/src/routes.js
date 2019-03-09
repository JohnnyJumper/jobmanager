import React from 'react';
import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom';
import AddPage from './pages/AddPage/AddPage';
import StatPage from './pages/StatPage';
import View from './pages/View/View';
import {Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

function NotFoundPage() {
  return (
    <div>
      The page you have requested isn't registered on our records
    </div>
  )
}


class DeveloperLinks extends React.Component {
	constructor(){
		super();
		this.state = {
			dropdownOpen: false
		}
		this.toggle = this.toggle.bind(this);
	}

	toggle(){
		this.setState(prevState => ({dropdownOpen: !prevState.dropdownOpen}));
	}


 render(){
	return (
			<Container className="devbar">
				<Row>
					<Col xs={12} sm={7} md={4} lg={4}>
						<span className="devbar-link"><Link to="/">AddPage</Link></span>
					</Col>
					<Col xs={12} sm={7} md={4} lg={4}>
						<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
							<DropdownToggle caret className="devbar-link">
								<span className="devbar-link">Details</span>
							</DropdownToggle>				
							<DropdownMenu className="devbar-dropdown">
									<DropdownItem header>Basics</DropdownItem>
									<DropdownItem><Link to="/view/jobs">jobs</Link></DropdownItem>
									<DropdownItem><Link to="/view/interviews">interviews</Link></DropdownItem>
									<DropdownItem><Link to="/view/companies">companies</Link></DropdownItem>
							</DropdownMenu>
							</Dropdown>
					</Col>
					<Col xs={12} sm={7} md={4} lg={4}>
							<span className="devbar-link"><Link to="/stats">StatPage</Link></span>
					</Col>
				</Row>
			</Container>
		);
	}
}


const RouteComponent = () => (
    <Router>
		<Container>
			<Row>
				<Col>
					<DeveloperLinks />
				</Col>
			</Row>
			<Row className="parrentView">
				<Col>
					<Switch>
						<Route exact path="/" component={AddPage} />
						<Route path="/stats" component={StatPage} />
						<Route path="/view/:category" component={View} />
						<Route component={NotFoundPage} />
					</Switch>
				</Col>
			</Row>
		</Container>
    </Router>
)

export default RouteComponent;