import React, { Component } from 'react';
import {Form, FormGroup, Input, Button, Label, Col, Row } from 'reactstrap';
import axios from 'axios';

export default class AddPage extends Component {

	constructor() {
		super();
		this.state = {
			name: '',
			link: '',
			status: 'noresponse',
			showDate: false,
			date: new Date().getTime()
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleStatus = this.handleStatus.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDate = this.handleDate.bind(this);
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	handleStatus(event) {
		const id = event.target.id;
		this.setState({status: id});
	}

	handleDate(event) {
		const {showDate} = this.state;
		this.setState({showDate: !showDate});
	}

	async handleSubmit(event) {
		event.preventDefault();
		const request = {
			name: this.state.name,
			link: this.state.link,
			status: this.state.status,
		};
		if (this.state.showDate)
			request.date = this.state.date;
		const response = await axios.post('/api/add', request);
		if (response.data.success)
			console.log('Hooray!')
		else
			console.error('Booooo');
	}

	render() {
		return(
		<div className="page-container">
			<div className="fullsize center">
				<Form className="fullsize center vertical">
					<FormGroup row>
						<Row>
							<Col sm={3}>
								<Label>name</Label>
							</Col>
							<Col sm={8}>
								<Input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
							</Col>
							<Col sm={3}>
								<Label>link</Label>
							</Col>
							<Col sm={8}>
								<Input type="text" name="link" value={this.state.link} onChange={this.handleChange}/>
							</Col>
						</Row>
					</FormGroup>
					<FormGroup row>
			        	<FormGroup className="label-margin" check>
			        	    <Label check>
								<Input id="noresponse" type="radio" name="status" onChange={this.handleStatus}/>{' '}
									No Response
			        	    </Label>
          				</FormGroup>
          				<FormGroup className="label-margin" check>
            				<Label check>
								<Input id="responded" type="radio" name="status" onChange={this.handleStatus} />{' '}
									Responded
            				</Label>
          				</FormGroup>
          				<FormGroup className="label-margin" check>
            				<Label check>
              					<Input id="interview" type="radio" name="status" onChange={this.handleStatus}/>{' '}
									Interview
            				</Label>
          				</FormGroup>
	  					<FormGroup className="label-margin" check>
            				<Label check>
              					<Input id="rejected" type="radio" name="status" onChange={this.handleStatus}/>{' '}
									Rejected
            				</Label>
          				</FormGroup>
					</FormGroup>
					<FormGroup row>
							<Label>Not Today</Label>
							<Input type="checkbox" name="showDate" value={this.state.showDate} onChange={this.handleDate} />
						{this.state.showDate ? 	<Input id="date" name="date" type="date" onChange={this.handleChange}/> :
						null}
					</FormGroup>
					<Row>
						<Col >
							<Button onClick={this.handleSubmit} block color="info">Add Record</Button>
						</Col>
					</Row>
				</Form>
			</div>
		</div>
		);
	}
}
