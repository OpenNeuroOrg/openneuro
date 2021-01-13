export default {
  title: 'OpenNeuro Documentation',
  description: 'User and developer documentation for the OpenNeuro platform',
  typescript: true,
  menu: [
    'Introduction',
    'User Guide',
    'GraphQL API',
    'Command Line Interface',
    'DataLad Service',
    'Git Access',
  ],
  plugins: [
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'docs.openneuro.org',
        protocol: 'https',
        hostname: 'docs.openneuro.org',
      },
    },
  ],
}
