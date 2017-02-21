import aws    from 'aws-sdk';
import config from '../../config';
import s3     from './s3';

aws.config.update(config.aws.credentials);


export default {
    s3: s3(aws)
};