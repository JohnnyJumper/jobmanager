import React, { Component } from 'react';
import {Button, FormGroup, Label, Input, Col} from 'reactstrap';
import axios from 'axios';



export default class UpdatePage extends Component {

	constructor() {
		super();
		this.state = {
			entries: {},
			selected: '',
			showDate: false,
			date: undefined
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleDate = this.handleDate.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);

		this.UpdateEntry = ({name, link, status, _id: id}) => (
			<div className="update-entry vertical">
				<span className="update-name">{name}</span>
				<a className="update-link" href={link}><span >{link}</span></a>
				<FormGroup>
					<Label className="update-status-text">Status: {status}</Label>
					<Input type="select" name="select" onChange={this.handleChange}>
						<option>noresponse</option>
						<option>responded</option>
						<option>interview</option>
						<option>rejected</option>
					</Input>
				</FormGroup>
				<FormGroup>
							<Label className="update-status-text">Not Today</Label>
					<Col>
							<Input type="checkbox" name="showDate" value={this.state.showDate} onChange={this.handleDate} />
						{this.state.showDate ?<Input id="date" name="date" type="date" onChange={this.handleDateChange}/> :
						null}
					</Col>
				</FormGroup>
					<Button onClick={() => this.update(id)} block color="info">Update</Button>
					<Button onClick={() => this.deleteEntry(id)} block color="danger">Delete</Button>
			</div>
		)

	}

	debug() {console.log(this.state)};


	async componentDidMount() {
		const entries = await axios.get('/api/projects');
		const project = {};
		if (entries.data.success) {
			entries.data.data.map(entry => project[entry._id] = entry)
			this.setState({entries: project}, () => this.debug());
		}
	}

	async deleteEntry(id) {
		const result = await axios.post(`/api/delete/${id}`);
		if (result.data.success) {
			const {entries} = this.state;
			delete entries[id];
			return this.setState({entries});
		}
	}

	handleDate(event) {
		const {showDate} = this.state;
		this.setState({showDate: !showDate});
	}


	async update(id) {
		const update = {
			status: this.state.selected
		};
		if (typeof this.state.date !== 'undefined') update.date = this.state.date;
		const result = await axios.post(`/api/update/${id}`, {update});
		const {entries} = this.state;
		if (result.data.success) {
			entries[id].status = this.state.selected;
			return this.setState({entries});
		}
	}

	handleChange(event) {
		this.setState({selected: event.target.value});	
	}

	handleDateChange(event) {
		this.setState({date: event.target.value});
	}

	render() {
		const entryKeys = Object.keys(this.state.entries);
		return(
			<div className="page-container">
				<div className="page-wrapper">
					{entryKeys.map((entry, index) => <this.UpdateEntry key={index} {...this.state.entries[entry]} />)}
					{entryKeys.length === 0 ? <span>No records found try again later</span> : null}
				</div>
			</div>
		);
	}
}