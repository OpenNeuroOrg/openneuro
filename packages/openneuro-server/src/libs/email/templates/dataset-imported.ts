export const datasetImportEmail = ({
  siteUrl,
  name,
  datasetId,
}: {
  siteUrl: string
  name: string
  datasetId: string
}): string => `<html>
<head>
<style>
	body {
		font-family: 'Open Sans', sans-serif;
		font-weight: lighter;
		background: #F5F5F5;
	}
	footer {
		border-top: 1px solid #333;
		padding-top: 15px;
		background: #F5F5F5;
	}
	.link {
		color: #00505c
	}
	.link:hover {
		color: #0093a9
	}
	.top-bar {
		width: 100%;
		background: #333;
		padding: 8px 0px 8px 15px;
	}
	.content {
		padding: 15px;
	}
	p {
		font-size: 16px;
		font-weight: lighter;
	}
	b {
		font-weight: bold;
	}
	.dataset-link {
		display: inline-block;
		background: #008599;
		color: #FFF;
		font-size: 20px;
		padding: 8px 15px;
		text-decoration: none;
		cursor: pointer;
	}
	.comment {
		border: 1px solid #ccc;
		padding: 15px;
	}
	.log {
		white-space: pre-wrap;
	}
	.FAILED {color: #d9534f;}
	.FINISHED {color: #5cb85c;}
</style>
</head>
<body>
	<div class="top-bar">
		<img src="${siteUrl}/assets/email-header.1cb8bf76.png" />
	</div>
	<div class="content">
		<h2>Hi, ${name}</h2>

		<p>
			A dataset import you requested has finished. It was imported as <b>${datasetId}</b>. 
		</p>

		<div>
			<a class='dataset-link' href="${siteUrl}/datasets/${datasetId}">Click here to view the dataset on OpenNeuro &raquo;</a>
		</div>

		<p>
			Sincerely,
			The CRN Team
		</p>
	</div>
</body>
<html>`
