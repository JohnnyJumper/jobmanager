import React, { Component } from 'react'
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';

import {graphql, compose} from 'react-apollo';
import {addCompany, addJob, getCompanyFromJobForm} from '../../queries/queries';

class JobForm extends Component {

    constructor() {
        super();

        this.state = {
			companyName: '',
			link: '',
            title: '',
            date: new Date().toISOString().slice(0, 10),
            responded: false,
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(event) {
        this.setState({
            [event.target.name]:event.target.value
        });
    };

 async onSubmitHandler(e) {
        e.preventDefault();
		const companyQuery = await this.props.getCompanyFromJobForm.refetch({
				companyName: this.state.companyName
		});
		const companyExist = await companyQuery.data.company;
		let companyID;
		if (!companyExist) {
			let addedCompany = await this.props.addCompanyQuery({
				variables: {
					name: this.state.companyName,
					link: this.state.link
				}
			});
			companyID = await addedCompany.data.addCompany.id;
		} else {
			companyID = await companyQuery.data.company.id;
		}
			const job = await this.props.addJobQuery({
				variables: {
					title: this.state.title,
					date: this.state.date,
					responded: this.state.responded,
					companyID
				}
		});
		this.setState({
			companyName: '',
			link: '',
            title: '',
            date: new Date().toISOString().slice(0, 10),
            responded: false,
		})
	
    }

    render() {
        return (
    		<Container>
    			<Form onSubmit={this.onSubmitHandler}>
    				<FormGroup row>
    					<Col xs={12} sm={6} md={6} lg={6}>
    						<Label for="companyName">Company name</Label>
    					</Col>
    					<Col xs={12} sm={6} md={6} lg={6}>
                            <Input 
                                id="companyName" name="companyName"
                                value={this.state.companyName} onChange={this.onChangeHandler}
                            />
    					</Col>
        				</FormGroup>
    				<FormGroup row>
    					<Col xs={12} sm={6} md={6} lg={6}>
    						<Label for="link">Company link</Label>
    					</Col>
    					<Col xs={12} sm={6} md={6} lg={6}>
                            <Input 
                                id="link" name="link"
                                value={this.state.link} onChange={this.onChangeHandler}
                            />
    					</Col>
        				</FormGroup>
    				<FormGroup row>
    					<Col xs={12} sm={6} md={6} lg={6}>
       						<Label for="title">Position title</Label>
    					</Col>
    					<Col xs={12} sm={6} md={6} lg={6}>
    						<Input
                                id="title" name="title"
                                value={this.state.title} onChange={this.onChangeHandler}
                            />
        					</Col>
    				</FormGroup>

    				<FormGroup row>
    					<Col xs={12} sm={6} md={6} lg={6}>
    						<Label for="date">Date</Label>
    					</Col>
        					<Col xs={12} sm={6} md={6} lg={6}>
    						<Input
                                type="date" id="date" name="date"
                                value={this.state.date} onChange={this.onChangeHandler}
                            />
    					</Col>
    				</FormGroup>

    				<FormGroup row>
    					<Col xs={10} sm={6} md={6} lg={6}>
       						<Label for="responded">Responded</Label>
    					</Col>
    					<Col xs={2} sm={6} md={6} lg={6} className="right">
    						<Input
                                type="checkbox" id="responded" name="responded"
                                onChange={(e) => this.setState({responded: e.target.checked})}
                            />
    					</Col>
    				</FormGroup>
        				<Row>
    					<Col xs={12} sm={{size: 3, offset: 10}} md={{size: 2, offset: 10}} lg={{size: 2, offset: 10}}>
    						<Button id="button-submit" block>Submit</Button>
    					</Col>
    				</Row>
    			</Form>
    		</Container>
        )
    }
}

export default compose(
	graphql(addCompany, {name: 'addCompanyQuery'}),
	graphql(addJob, {name: 'addJobQuery'}),
	graphql(getCompanyFromJobForm, {
		name: 'getCompanyFromJobForm',
	})
)(JobForm)