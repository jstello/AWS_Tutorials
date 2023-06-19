import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// Add import statements here

export interface EBEnvProps extends cdk.StackProps {
    // Autoscaling group configuration
  minSize?: string;
  maxSize?: string;
  instanceTypes?: string;
  envName?: string;
}

export class EBApplnStack extends cdk.Stack {
   constructor(scope: Construct, id: string, props?: EBEnvProps) {
       super(scope, id, props);

    // The code that defines your stack goes here
    // Construct an S3 asset Zip from directory up.
    const webAppZipArchive = new s3assets.Asset(this, 'WebAppZip', {
        path: `${__dirname}/../src`,
      });
  // Create a ElasticBeanStalk app.
    const appName = 'MyWebApp';
    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
        applicationName: appName,
    });
    // Create an app version from the S3 asset defined earlier
    const appVersionProps = new elasticbeanstalk.CfnApplicationVersion(this, 'AppVersion', {
        applicationName: appName,
        sourceBundle: {
            s3Bucket: webAppZipArchive.s3BucketName,
            s3Key: webAppZipArchive.s3ObjectKey,
        },
});
    // Make sure that Elastic Beanstalk app exists before creating an app version
    appVersionProps.addDependency(app);

  }
}
