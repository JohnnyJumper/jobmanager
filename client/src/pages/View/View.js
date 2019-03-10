import React, { Component } from 'react'
import {Container} from 'reactstrap';

import { Query } from 'react-apollo';
import {getCompanies, getJobs, getInterviews} from '../../queries/queries';

import Modal from '../../modal';
const Mark = ({responded}) => (
    responded ? (<svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>) : 'NOT'
)

export const Loading = () => (
    <div className="parrentSpinner">
        <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    </div>
)

class View extends Component {
  
    constructor() {
        super();

        this.state = {
            view: {},
			modalStatus: false,
			selected: {}
        }
		this.renderView = this.renderView.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
        this.queries = {
                jobs: getJobs,
                companies: getCompanies,
                interviews: getInterviews
            };
    }

    toggleModal() {
        this.setState(PrevState => ({modalStatus: !PrevState.modalStatus}));
    }
	
    renderJobs(data) {
        return data.data.jobs.map(job => <li onClick={() => this.setState({selected: {...job}}, this.toggleModal)}  className="view-li" key={job.id}>
               <span> {job.title} at {job.company.name}</span> <Mark responded={job.responded}/>
                </li>);
    }

    renderInterviews(data) {
        return data.data.interviews.map(interview => <li onClick={() => this.setState({selected: {...interview}}, this.toggleModal)}  className="view-li" key={interview.id}>
        <span> {interview.type} at {interview.job.company.name} for {interview.job.title} </span>
        </li>)
    }

    renderCompanies(data) {
        return data.data.companies.map(company => <li onClick={() => this.setState({selected: {...company}}, this.toggleModal)}  className="view-li" key={company.id}>
        <span>{company.name} applied: {company.applied}</span>
        </li>)
    }

    renderView(props) {
            const {match: {params: {category: category}}} = this.props;
            if (props.loading)
                return <Loading />
            switch(category) {
                case 'jobs':
                    return this.renderJobs(props);
                case 'companies':
                    return this.renderCompanies(props);
                case 'interviews':
                    return this.renderInterviews(props);
            }
        }

	renderJobModal() {
		const {selected} = this.state;
		if (typeof selected.title === 'undefined') return null;
		return <span> {selected.title} at {selected.company.name}</span>;
	}

	renderCompanyModal() {
		const {selected} = this.state;
		if (typeof selected.name === 'undefined') return null;
		return <span>{selected.name} applied: {selected.applied}</span>;
	}

	renderInterviewModal() {
		const {selected} = this.state;
		if (typeof selected.type === 'undefined') return null;
		return <span> {selected.type} at {selected.job.company.name} for {selected.job.title} </span>;
	}

	renderModal() {
		const {match: {params: {category: category} }} = this.props;
		switch(category) {
			case 'jobs': 
				return this.renderJobModal();
			case 'companies':
				return this.renderCompanyModal();
			case 'interviews':
				return this.renderInterviewModal();
		}
	}		


    render() {
        const {match: {params: {category: category} }} = this.props;
        return (
            <Container className="view-parrent">
                <ol className="view-ul">
                    <Query query={this.queries[category]}>
                        {this.renderView}
                    </Query>
                </ol>
                <Modal control={this.state.modalStatus} toggle={this.toggleModal}>
					{this.renderModal()}
                </Modal>
            </Container>
        )
    }
}

export default View;