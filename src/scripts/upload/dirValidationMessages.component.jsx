// dependencies -------------------------------------------------------
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap';

let DirValidationMessages = React.createClass({
	// life cycle events --------------------------------------------------
	render: function () {
		//// //[
		// // 	{
		// // 		errors: [
		// // 			{
		// // 				a: '}',
		// // 				b: '',
		// // 				c: undefined,
		// // 				character: 60,
		// // 				code: 'W116',
		// // 				d: undefined,
		// // 				evidence: '{"repetition_time": 5.0, "echo_time": 0.005, "flip_angle": 90',
		// // 				id: '(error)',
		// // 				line: 1,
		// // 				raw: 'Expected "{a}" and instead saw "{b}".',
		// // 				reason: 'Expected "}" and instead saw "".',
		// // 				scope: '(main)',
		// // 			}
		// // 		],
		// // 		file: {
		// // 			lastModified: 1433788237000,
		// // 			lastModifiedDate: 'Mon Jun 08 2015 11:30:37 GMT-0700 (PDT)',
		// // 			name: 'task001_bold.json',
		// // 			size: 61,
		// // 			type: 'application/json',
		// // 			webkitRelativePath: 'ds114_invalid/task001_bold.json',
		// // 		}
		// // 	},
		// // 	{
		// // 		errors: [
		// // 			{
		// // 				a: '}',
		// // 				b: '',
		// // 				c: undefined,
		// // 				character: 60,
		// // 				code: 'W116',
		// // 				d: undefined,
		// // 				evidence: '{"repetition_time": 5.0, "echo_time": 0.005, "flip_angle": 90',
		// // 				id: '(error)',
		// // 				line: 1,
		// // 				raw: 'Expected "{a}" and instead saw "{b}".',
		// // 				reason: 'Expected "}" and instead saw "".',
		// // 				scope: '(main)',
		// // 			},
		// // 			{
		// // 				a: '}',
		// // 				b: '',
		// // 				c: undefined,
		// // 				character: 60,
		// // 				code: 'W116',
		// // 				d: undefined,
		// // 				evidence: '{"repetition_time": 5.0, "echo_time": 0.005, "flip_angle": 90',
		// // 				id: '(error)',
		// // 				line: 1,
		// // 				raw: 'Expected "{a}" and instead saw "{b}".',
		// // 				reason: 'Expected "}" and instead saw "".',
		// // 				scope: '(main)',
		// // 			}
		// // 		],
		// // 		file: {
		// // 			lastModified: 1433788237000,
		// // 			lastModifiedDate: 'Mon Jun 08 2015 11:30:37 GMT-0700 (PDT)',
		// // 			name: 'task001_bold.json',
		// // 			size: 61,
		// // 			type: 'application/json',
		// // 			webkitRelativePath: 'ds114_invalid/task001_bold.json',
		// // 		}
		// // 	}		
		// // ];
		let allErrorsArray = this.props.errors;
		let errorBadge = '';
		let allErrors = allErrorsArray.map(function (item, index) {	
			let header = <span className="file-header"><strong>File:</strong> {item.file.name}<span className="label label-danger pull-right">{item.errors.length -1} {item.errors.length >0 ? "ERRORS" : "ERROR"}</span></span>
			let error = item.errors.map(function (error, index) {
				if(error){
					return(
						<div key={index} className={("e_o"+index % 2) + " row"}>
							<div className="col-xs-12">
								<h4>Error: {index + 1}</h4>
								<span className="error-meta">
									<label>Path: </label>
									<p>{item.file.webkitRelativePath}</p>
								</span>
								<span className="error-meta">
									<label>Line: {error.line} Character: {error.character}</label>
									<p>{error.evidence}</p>
								</span>
								<span className="error-meta">
									<label>Reason: </label>
									<p>{error.reason}</p>
								</span>
								<span className="error-meta">
								<p>{(item.file.size / 1000) + " KB"} | {item.file.type}</p>
								</span>
							</div>
						</div>
					);
				}else{
					return null;
				}
			});
			return (
				<Panel key={index}  header={header} className="validation-error" eventKey={index}>
					{error}
				</Panel>	
			);
		});
		return (
			<Accordion>
			  	{allErrors}
			</Accordion>
    	);
	},
	// custom methods -----------------------------------------------------
});

export default DirValidationMessages;