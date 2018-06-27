export default [
  {
    faq: 'How do I get started?',
    faq_answer:
      'Check out our ' +
      '[video tutorial](https://www.youtube.com/playlist?list=PLU-IMZq18nDsf6VpCrLezLgylfAbRPPV8).',
  },
  {
    faq: 'Is this service free to use?',
    faq_answer: 'Yes!',
  },
  {
    faq: 'Can I restrict access to my data and analysis results on OpenNeuro?',
    faq_answer:
      'Yes, but only for a period of 36 months counted from first successful analysis of data from more than one participant. After this period the dataset and related analysis results will be made publicly available.',
  },
  {
    faq: 'Are there any restrictions on the uploaded data?',
    faq_answer:
      'Yes. By uploading this dataset to OpenNeuro you have to agree to the  following conditions: \n' +
      '* ' +
      'You are the owner of this dataset and have any necessary ethics' +
      'permissions to share the data publicly.\n' +
      '* ' +
      'This dataset does not include any identifiable personal health' +
      'information as defined by the Health Insurance Portability and' +
      'Accountability Act of 1996 (including names, zip codes, dates of' +
      'birth, acquisition dates, facial features on structural scans' +
      'etc.).\n' +
      '* ' +
      'You agree that this dataset and results of all analyses' +
      'performed on it using the OpenNeuro platform will become' +
      'publicly available under a Creative Commons CC0 or CC-BY license' +
      'after a grace period of 36 months counted from first successful' +
      'analysis of data from more than one participant.',
  },
  {
    faq: 'What if I will not be able to publish my paper in 36 months?',
    faq_answer:
      'You can apply for up to two 6 month long extensions of the grace' +
      'period. To apply please contact support. We encourage you to publish' +
      'a preprint of your work to reduce the uncertainty of the publishing' +
      'pipeline.',
  },
  {
    faq:
      'Can I upload and analyze a publicly available dataset from another repository?',
    faq_answer:
      'The mission of OpenNeuro is to incentivize data sharing via' +
      'providing data analysis service. Thus we discourage using it to' +
      'analyze already publicly available datasets. This policy might' +
      'change in the future depending on improvements in analysis cost.',
  },
  {
    faq:
      'Do I need to format my data in some special way before uploading it to OpenNeuro?',
    faq_answer:
      'Yes! OpenNeuro only accepts data in the Brain Imaging Data Structure' +
      '(BIDS) format. You can read about it more at ' +
      '[bids.neuroimaging.io](http://bids.neuroimaging.io/).' +
      ' If you have any questions about organizing your data please' +
      'post them at [neurostars.org](https://neurostars.org/tags/bids).',
  },
  {
    faq:
      'Do I need to remove facial features from structural images before uploading the data?',
    faq_answer:
      'Yes. We recommend using ' +
      '[pydeface](https://pypi.python.org/pypi/pydeface). Defacing is strongly preffered over skullstripping, because' +
      'the process is more robust and yields lower chance of accidentally' +
      'removing brain tissue.',
  },
  {
    faq: 'I am having trouble downloading with Firefox, what can I do?',
    faq_answer:
      'Firefox is working to support the APIs used by downloads but as of' +
      'Firefox 60, these features are hidden behind experimental' +
      'configuration flags. Chrome is recommended for dataset or snapshot' +
      'downloads, but you can try out Firefox support by enabling three ' +
      '`about:config` flags.\n' +
      '* ' +
      '`dom.streams.enabled` - enables web streams.\n' +
      '* ' +
      '`javascript.options.streams` - allows Javascript to use the API.\n ' +
      '* ' +
      '`dom.ipc.multiOptOut` - works around thread bugs, this may not be' +
      'needed but improves reliablity on some platforms. \n\n' +
      'You can find out more about ' +
      '[web streams on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).',
  },
]
