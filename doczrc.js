export default {
  title: 'OpenNeuro Documentation',
  description: 'User and developer documentation for the OpenNeuro platform',
  typescript: true,
  menu: ['Introduction', 'GraphQL API', 'Command Line Interface'],
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
