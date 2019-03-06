import React, { Component } from 'react'

import {Container, Row, Col} from 'reactstrap';
import {RadialChart, XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis,LineMarkSeries} from 'react-vis';

import {Loading} from './View/View';

import {graphql, compose} from 'react-apollo';
import {getPieChartData, getLineChartData} from '../queries/queries';


const Plot = (props) => (
	<XYPlot
		xType="time"
		width={1000}
		height={300}
		className="graph-bg"
	>
		<VerticalGridLines />
		<HorizontalGridLines />
		<XAxis title="Date"/>
		<YAxis title={props.status} />
		<LineMarkSeries
		curve={'curveMonotoneX'}
		data={props.data}/>
	</XYPlot>
)


class StatPage extends Component {


	renderLineGraph() {
		const {getLineChartDataQuery} = this.props;
		if (getLineChartDataQuery.loading) return <Loading />
		const {jobs} = getLineChartDataQuery;
		
		const applieddata = jobs.reduce((acc, item, index) => {
			if (index === 1) {
				acc = {[acc.date]:1}
			}
			if (!Object.prototype.hasOwnProperty.call(acc, item.date))
				acc = {...acc, [item.date]: 1}
			else
				acc[item.date] += 1;
			return acc;
		});
		
		const dates = Object.keys(applieddata);
		const graphData = dates.map(date => ({
			x: new Date(date).getTime(),
			y: applieddata[date]
		}));
		return <Plot status="applied" data={graphData} />		
	}


	renderPieChart() {
		const {getPieChartDataQuery} = this.props;
		if (getPieChartDataQuery.loading) {
			return <Loading />
		} 
		const {appliedJobs, appliedCompanies, interviewRequests} = getPieChartDataQuery;
		const dataArr = [
			{appliedJobs, name: 'appliedJobs'},
			{appliedCompanies, name: 'appliedCompanies'},
			{interviewRequests, name: 'interviewRequests'}
		];
		const total = dataArr.reduce((sum, item, index) => 
			{
				if (index == 1)
					sum = sum[sum.name];
				sum += item[item.name];
				return sum;
			}
		);
		const graphData = dataArr.map(chapter => ({
			angle: chapter[chapter.name] / total,
			radius: 1,
			label: chapter.name
		}));
		return (
			<RadialChart
				data={graphData}
				width={800}
				height={800}
				showLabels={true}
				labelsRadiusMultiplier={0.9}
				className="chart"
			/>
			)	
	}	

	  render() {
	 	return(
			<Container>
				<Row className="section">
						<span>Piechart</span>
					<Col>
						{this.renderPieChart()}
					</Col>
				</Row>
				<Row className="section">
						<span>Line Graph</span>
					<Col>
							{this.renderLineGraph()}
					</Col>
				</Row>
			</Container>
			
	 	 );
	}
}

export default compose(
	graphql(getPieChartData, {name: "getPieChartDataQuery"}),
	graphql(getLineChartData, {name: "getLineChartDataQuery"})
)(StatPage)