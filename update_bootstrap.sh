#!/bin/bash -x

#Deploying CI/CD pipeline
cd server/TenantPipeline/
# npm install && npm run build 
# cdk bootstrap  
# cdk deploy 

# # Deploying bootstrap
cd ../
REGION=$(aws configure get region)
DEFAULT_SAM_S3_BUCKET=$(grep s3_bucket samconfig-bootstrap.toml|cut -d'=' -f2 | cut -d \" -f2)
# echo "aws s3 ls s3://$DEFAULT_SAM_S3_BUCKET"
# if [ $? -ne 0 ]; then
#     echo "S3 Bucket: $DEFAULT_SAM_S3_BUCKET specified in samconfig-bootstrap.toml is not readable.
#     So creating a new S3 bucket and will update samconfig-bootstrap.toml with new bucket name."
    
#     UUID=$(uuidgen | awk '{print tolower($0)}')
#     SAM_S3_BUCKET=sam-bootstrap-bucket-$UUID
#     aws s3 mb s3://$SAM_S3_BUCKET --region $REGION
#     if [[ $? -ne 0 ]]; then
#       exit 1
#     fi
#     # Updating samconfig-bootstrap.toml with new bucket name
#     ex -sc '%s/s3_bucket = .*/s3_bucket = \"'$SAM_S3_BUCKET'\"/|x' samconfig-bootstrap.toml
# fi

sam build -t bootstrap-template.yaml --use-container --region=$REGION
sam deploy --config-file samconfig-bootstrap.toml --region=$REGION --parameter-overrides AdminEmailParameter=$1 

if [[ $? -ne 0 ]]; then
    exit 1
fi
