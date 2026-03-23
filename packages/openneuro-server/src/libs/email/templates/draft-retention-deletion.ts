export const draftRetentionDeletion = ({
  siteUrl,
  name,
  datasetId,
}: {
  siteUrl: string
  name: string
  datasetId: string
}): string =>
  `<html>
<head>
<style>
	body {
		font-family: sans-serif;
		font-weight: lighter;
		background: #F5F5F5;
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
		background: #d9534f;
		color: #FFF;
		font-size: 20px;
		padding: 8px 15px;
		text-decoration: none;
		cursor: pointer;
	}
</style>
</head>
<body>
	<div class="top-bar">
		<img src="${siteUrl}/assets/email-header-GR_ZGg8w.png" />
	</div>
	<div class="content">
		<h2>Hi, ${name}</h2>

		<p>
			The draft data for your dataset <b>${datasetId}</b> has not been updated in some time and may be automatically removed at any time.
		</p>

		<p>
			Once data has been removed you will need to re-upload your files to continue working on this dataset. Please see our data retention policy for more information: <a href="https://docs.openneuro.org/policy/data_retention.html">Data Retention Policy.</a>
		</p>

		<p>
			Sincerely,
			The OpenNeuro Team
		</p>

		<a class="dataset-link" href="${siteUrl}/datasets/${datasetId}">View dataset. &raquo;</a>
	</div>
</body>
</html>`
