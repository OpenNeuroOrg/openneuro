// dependencies -------------------------------------------------------
import React from 'react'
import { Accordion, Panel } from 'react-bootstrap';

let DirValidationMessages = React.createClass({
	// life cycle events --------------------------------------------------
	render: function () {
		let allErrorsArray = [
			{
				errors: [
					{
						a: '}',
						b: '',
						c: undefined,
						character: 60,
						code: 'W116',
						d: undefined,
						evidence: '{"repetition_time": 5.0, "echo_time": 0.005, "flip_angle": 90',
						id: '(error)',
						line: 1,
						raw: 'Expected "{a}" and instead saw "{b}".',
						reason: 'Expected "}" and instead saw "".',
						scope: '(main)',
					}
				],
				file: {
					lastModified: 1433788237000,
					lastModifiedDate: 'Mon Jun 08 2015 11:30:37 GMT-0700 (PDT)',
					name: 'task001_bold.json',
					size: 61,
					type: 'application/json',
					webkitRelativePath: 'ds114_invalid/task001_bold.json',
				}
			},
			{
				errors: [
					{
						a: '}',
						b: '',
						c: undefined,
						character: 60,
						code: 'W116',
						d: undefined,
						evidence: '{"repetition_time": 5.0, "echo_time": 0.005, "flip_angle": 90',
						id: '(error)',
						line: 1,
						raw: 'Expected "{a}" and instead saw "{b}".',
						reason: 'Expected "}" and instead saw "".',
						scope: '(main)',
					},
					{
						a: '}',
						b: '',
						c: undefined,
						character: 60,
						code: 'W116',
						d: undefined,
						evidence: '{"repetition_time": 5.0, "echo_time": 0.005, "flip_angle": 90',
						id: '(error)',
						line: 1,
						raw: 'Expected "{a}" and instead saw "{b}".',
						reason: 'Expected "}" and instead saw "".',
						scope: '(main)',
					}
				],
				file: {
					lastModified: 1433788237000,
					lastModifiedDate: 'Mon Jun 08 2015 11:30:37 GMT-0700 (PDT)',
					name: 'task001_bold.json',
					size: 61,
					type: 'application/json',
					webkitRelativePath: 'ds114_invalid/task001_bold.json',
				}
			}		
		];
	
		let allErrors = allErrorsArray.map(function (item, index) {	
		let error = item.errors.map(function (error, index) {
			return(
				<span key={index}>
					<pre>Path: {item.file.webkitRelativePath}</pre>
					Evidence: {error.evidence}
					Reason: {error.reason}
					==================
				</span>
				);
		});
			return (
				<Panel key={index}  header={"Error in file" + item.file.name} eventKey={index}>
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