import React, { Component } from 'react'

import JobForm from './JobForm';
import InterviewForm from './InterviewForm';
import {Container} from 'reactstrap';

export default class AddPage extends Component {

  render() {
	return (
		<Container className="addpage">
		 	 <Container className="addentry">
			  	<JobForm />
			</Container>
			<Container className="addentry">
				<InterviewForm />
			</Container>
		</Container>
    )
  }
}
