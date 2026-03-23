export const draftRetentionWarning = ({
  siteUrl,
  name,
  datasetId,
  daysRemaining,
}: {
  siteUrl: string
  name: string
  datasetId: string
  daysRemaining: number
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
		background: #5cb85c;
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
		<img src="${siteUrl}/assets/email-header.1cb8bf76.png" />
	</div>
	<div class="content">
		<h2>Hi, ${name}</h2>

		<p>
			Your dataset <b>${datasetId}</b> has an unpublished draft that has not been updated in some time.
			If no snapshot is created within <b>${daysRemaining} days</b>, the draft data will be automatically removed.
		</p>

		<p>
			To preserve your data, please create a snapshot or update your draft. Please see our data retention policy for more information: <a href="https://docs.openneuro.org/policy/data_retention.html">Data Retention Policy.</a>
		</p>

		<p>
			Sincerely,
			The OpenNeuro Team
		</p>

		<a class="dataset-link" href="${siteUrl}/datasets/${datasetId}/snapshot">Create a snapshot. &raquo;</a>
	</div>
</body>
</html>`
