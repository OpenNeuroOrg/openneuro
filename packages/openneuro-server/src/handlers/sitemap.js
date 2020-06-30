import sitemap from 'sitemap'
import config from '../config.js'
import Dataset from '../models/dataset'

// Static URLs - manual for now, could be generated from routes
export const sitemapStaticUrls = () => [
  { url: '/', priority: 0.9, changefreq: 'weekly' },
  { url: '/public/datasets', priority: 1.0, changefreq: 'daily' },
  { url: '/faq', priority: 0.6, changefreq: 'monthly' },
  { url: '/pet', priority: 0.5, changefreq: 'monthly' },
  { url: '/public/jobs', priority: 0.5, changefreq: 'monthly' },
  { url: '/crn/graphql', priority: 0.3 },
]

// URLs generated from site data
export const sitemapDynamicUrls = () =>
  Dataset.aggregate([
    { $match: { public: true } },
    {
      $lookup: {
        from: 'snapshots',
        localField: 'id',
        foreignField: 'datasetId',
        as: 'snapshots',
      },
    },
    {
      $unwind: '$snapshots',
    },
    {
      $project: {
        url: {
          $concat: ['/datasets/', '$id', '/versions/', '$snapshots.tag'],
        },
        lastmodISO: {
          $dateToString: { date: '$snapshots.created' },
        },
        priority: 0.8,
        changefreq: 'daily', // To make sure new comments are indexed
      },
    },
  ]).exec()

export const sitemapFactory = async () => {
  return sitemap.createSitemap({
    hostname: config.url,
    cacheTime: 600000,
    urls: sitemapStaticUrls().concat(await sitemapDynamicUrls()),
  })
}

export const sitemapHandler = (req, res) => {
  sitemapFactory().then(sm => {
    sm.toXML((err, xml) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        return res.status(500).end()
      }
      res.header('Content-Type', 'application/xml')
      res.send(xml)
    })
  })
}
