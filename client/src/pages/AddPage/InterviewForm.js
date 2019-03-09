import React, { Component } from 'react'
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {graphql, compose} from 'react-apollo';
import {addInterview, getJobFromInterviewForm} from '../../queries/queries';


class InterviewForm extends Component {

    constructor() {
        super();

        this.state = {
            type: '',
            status: '',
            date: new Date().toISOString().slice(0,10),
			jobTitle: '',
			companyName: ''
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    async onSubmitHandler(e) {
        e.preventDefault();
		const job = await this.props.getJobFromInterviewForm.refetch({
				title: this.state.jobTitle,
				companyName: this.state.companyName
		});
		const jobID = await job.data.job.id;
		console.log('job ID = ', jobID);
		const interview = await this.props.addInterviewQuery({
			variables: {
				type: this.state.type,
				status: this.state.status,
				date: this.state.date,
				jobID
			}
		});
		console.log('interview = ', interview);
    }

    render() {
        return (
			<Container>
				<Form onSubmit={this.onSubmitHandler}>
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
							<Label for="jobtitle">Job title</Label>
						</Col>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Input
                                id="jobtitle" name="jobTitle"
                                value={this.state.jobTitle} onChange={this.onChangeHandler}/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Label for="companyName">Company name</Label>
						</Col>
						<Col xs={12} sm={6} md ={6} lg={6}>
							<Input
                                id="companyName" name="companyName"
                                value={this.state.companyName} onChange={this.onChangeHandler}/>
						</Col>
					</FormGroup>
					<Row>
						<Col xs={12} sm={{size: 3, offset: 10}} md={{size: 2, offset: 10}} lg={{size: 2, offset: 10}}>
							<Button id="button-submit" block>Submit</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		);
  }
}

export default compose(
	graphql(addInterview, {name: 'addInterviewQuery'}),
	graphql(getJobFromInterviewForm, {name:'getJobFromInterviewForm'})
)(InterviewForm)