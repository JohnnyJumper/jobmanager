import React, { Component } from 'react'
import {Container} from 'reactstrap';

import { Query } from 'react-apollo';
import {getCompanies, getJobs, getInterviews} from '../../queries/queries';

const Mark = ({responded}) => (
    responded ? 'OK' : 'NOT'
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
               <span> {job.title} at {job.company.name} <Mark responded={job.responded}/> </span>
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
                return <div>Loading data...</div>
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
            <Container>
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