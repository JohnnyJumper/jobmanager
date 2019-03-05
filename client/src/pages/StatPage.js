import React, { Component } from 'react';

import {XYPlot, HorizontalGridLines, VerticalGridLines, XAxis, YAxis, LineMarkSeries} from 'react-vis';
import axios from 'axios';



export default class StatPage extends Component {

	constructor() {
		super();
		this.state = {
			projects: {},
			formated: {},
			graphData: {},
		}

		this.plot = (props) => (
			<XYPlot
				xType="time"
				width={1000}
				height={300}>
				<VerticalGridLines />
				<HorizontalGridLines />
				<XAxis title="Date"/>
				<YAxis title={props.status} />
				<LineMarkSeries
				curve={'curveMonotoneX'}
				colorType="literal"
				color={this.chooseColor(props.status)}
				data={props.data}/>
			</XYPlot>	
		)
	}


	async componentDidMount() {
		const projects = await axios.get('/api/projects');
		const formated = {};
		if (projects.data.success) {
			projects.data.data.map(project => {
				for (const status in project.date) {
					if (project.date.hasOwnProperty(status)) {
						const element = project.date[status];
						if (!formated.hasOwnProperty(element))
							formated[element] = {[status]: 1}
						else if (!formated[element].hasOwnProperty(status))
							formated[element] = {...formated[element], [status]: 1}
						else
							formated[element] = {...formated[element], [status]: formated[element][status] + 1}
					}
				}
				return true;
			});
			this.setState({projects: formated}, this.renderGraph);
		};
	}

	chooseColor(status) {
		switch(status) {
			case 'responded': 
				return 'green';
			case 'rejected':
				return 'red';
			default:
				return undefined;
		}
	}

	renderGraph() {
		const {graphData} = this.state;
		const statuses = ['responded', 'noresponse' , 'interview', 'rejected'];
		statuses.forEach(status => {
			graphData[status] = this.getGraphData(status)
		});
		console.log('this is final graphData ', graphData);
		this.setState({graphData}, () => console.log('gathered'));
	}

	getGraphData(status) {
		const {projects} = this.state;
		const data = [];
		console.log('projects  = ',projects);
		for (const date in projects) {
			console.log('date = ', date, 'projects[date] = ', projects[date]);
			if (projects[date].hasOwnProperty(status))
				data.push({x: new Date(date).getTime(), y: projects[date][status]});
		}
		console.log('data = ', data);
		data.sort((obj1, obj2) => obj1.x - obj2.x);
		console.log('data after soert = ', Object.assign({}, {data}));
		return data;
	}


	render() {
		const {graphData} = this.state;
		const graphKeys = Object.keys(graphData);
		return(
			<div className="page-container">
				<div className="graphs-container vertical">
					{graphKeys.map((key, index) => <this.plot status={key} data={graphData[key]} key={index}/>)}
				</div>
			</div>
		);
	}
}
