import React, { Component } from 'react'
import {Container} from 'reactstrap';

import { Query } from 'react-apollo';
import {getCompanies, getJobs, getInterviews} from '../../queries/queries';

const Mark = ({responded}) => (
    responded ? (<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>) : 'NOT'
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
        }
        this.renderView = this.renderView.bind(this);
        this.queries = {
                jobs: getJobs,
                companies: getCompanies,
                interviews: getInterviews
            };
    }


	
    renderJobs(data) {
        console.log('data!', data);
        return data.data.jobs.map(job => <li className="view-li" key={job.id}>
               <span> {job.title} at {job.company.name}</span> <Mark responded={job.responded}/>
                </li>);
    }

    renderInterviews(data) {
        return data.data.interviews.map(interview => <li className="view-li" key={interview.id}>
        <span> {interview.type} at {interview.job.company.name} for {interview.job.title} </span>
        </li>)
    }

    renderCompanies(data) {
        return data.data.companies.map(company => <li className="view-li" key={company.id}>
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
  
    render() {
        const {match: {params: {category: category} }} = this.props;
        return (
            <Container className="view-parrent">
                <ol className="view-ul">
                    <Query query={this.queries[category]}>
                        {this.renderView}
                    </Query>
                </ol>
            </Container>
        )
    }
}

export default View;