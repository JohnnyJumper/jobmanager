import React, { Component } from 'react'

import JobForm from './JobForm';
import InterviewForm from './InterviewForm';
import {Container, Row, Col} from 'reactstrap';

export default class AddPage extends Component {

  render() {
	return (
		<Container className="addpage">
		 	 <Container className="addentry">
				<Row>
					<Col className="centered-title">
						<span>Job Form</span>
					</Col>
				</Row>
				<Row>
			  	<JobForm />
				</Row>
			</Container>
			<Container className="addentry">
				<Row>
					<Col className="centered-title">
						<span>Interview Form</span>
					</Col>
				</Row>
				<Row>
					<InterviewForm />
				</Row>
			</Container>
		</Container>
    )
  }
}
