import React, { Component } from 'react'
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';

export default class InterviewForm extends Component {

    constructor() {
        super();

        this.state = {
            type: '',
            status: '',
            date: new Date().toISOString().slice(0,10),
            jobRef: ''
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    onSubmitHandler(e) {
        e.preventDefault();
        console.log('ready to send this data: ', this.state);
    }

    render() {
        return (
			<Container>
				<Form>
					<FormGroup row>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Label for="type">Type</Label>
						</Col>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Input
                                id="type" name="type"
                                value={this.state.type} onChange={this.onChangeHandler}
                            />
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Label for="status">Status</Label>
						</Col>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Input
                                id="status" name="status"
                                value={this.state.status} onChange={this.onChangeHandler}
                            />
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Label for="interviewDate">Date</Label>
						</Col>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Input
                                type="date" id="interviewDate" name="date"
                                value={this.state.date} onChange={this.onChangeHandler}
                            />
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Label for="jobname">Job name</Label>
						</Col>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Input
                                id="jobname" name="jobRef"
                                value={this.state.jobRef} onChange={this.onChangeHandler}/>
						</Col>
					</FormGroup>
					<Row>
						<Col xs={12} sm={{size: 3, offset: 10}} md={{size: 2, offset: 10}} lg={{size: 2, offset: 10}}>
							<Button onClick={this.onSubmitHandler} id="button-submit" block>Submit</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		);
  }
}
