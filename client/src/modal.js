import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';

const modalRoot = document.querySelector("#modal");

export default class Modal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			control: props.control
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.control != this.props.control) {
			return this.setState({control: this.props.control});
		}
	}
    render() {
        const {control} = this.state;
		if (control){
            return ReactDOM.createPortal(
                    <div className="modal-wrapper-outside">
                        <div className="modal-wrapper-inside">
                            {this.props.children}
                            <Button onClick={this.props.toggle} color="info">Close</Button>
                        </div>
                    </div>
				, modalRoot);
		}
        return null;
    }
}
