import aws from 'aws-sdk'
import config from '../../config'
import batch from './batch'
import s3 from './s3'
import cloudwatch from './cloudwatch'

aws.config.setPromisesDependency(null)
aws.config.update(config.aws.credentials)

export default {
  batch: batch(aws),
  s3: s3(aws),
  cloudwatch: cloudwatch(aws),
}
