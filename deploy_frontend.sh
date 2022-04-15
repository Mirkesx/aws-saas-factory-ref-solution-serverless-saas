#!/bin/bash -x
# ADMIN_SITE_BUCKET=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-AdminAppBucket'].Value" --output text )
# APP_SITE_BUCKET=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-AppBucket'].Value" --output text )
LANDING_APP_SITE_BUCKET=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-LandingAppBucket'].Value" --output text )

ADMIN_SITE_URL=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-AdminAppSite'].Value" --output text )
APP_SITE_URL=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-ApplicationSite'].Value" --output text )
LANDING_APP_SITE_URL=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-LandingApplicationSite'].Value" --output text )

# ADMIN_APPCLIENTID=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-AdminUserPoolClientId'].Value" --output text )
# ADMIN_AUTHSERVERURL=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-AdminUserPoolProviderURL'].Value" --output text )
ADMIN_APIGATEWAYURL=$(aws cloudformation list-exports --query "Exports[?Name=='Serverless-SaaS-AdminApiGatewayUrl'].Value" --output text )

# # Configuring admin UI 
# echo "aws s3 ls s3://$ADMIN_SITE_BUCKET"
# aws s3 ls s3://$ADMIN_SITE_BUCKET 
# if [ $? -ne 0 ]; then
#     echo "Error! S3 Bucket: $ADMIN_SITE_BUCKET not readable"
#     exit 1
# fi

# cd ../

CURRENT_DIR=$(pwd)
echo "Current Dir: $CURRENT_DIR"

cd clients

cd Admin

# echo "Configuring environment for Admin Client"

# cat << EoF > ./src/environments/environment.prod.ts
# export const environment = {
#   production: true,
#   clientId: '$ADMIN_APPCLIENTID',
#   issuer: '$ADMIN_AUTHSERVERURL',
#   apiGatewayUrl: '$ADMIN_APIGATEWAYURL',
#   domain: ''
# };
# EoF
# cat << EoF > ./src/environments/environment.ts
# export const environment = {
#   production: true,
#   clientId: '$ADMIN_APPCLIENTID',
#   issuer: '$ADMIN_AUTHSERVERURL',
#   apiGatewayUrl: '$ADMIN_APIGATEWAYURL',
#   domain: ''
# };
# EoF

# npm install --legacy-peer-deps && npm run build

# echo "aws s3 sync --delete --cache-control no-store dist s3://$ADMIN_SITE_BUCKET"
# aws s3 sync --delete --cache-control no-store dist s3://$ADMIN_SITE_BUCKET 

# if [[ $? -ne 0 ]]; then
#     exit 1
# fi

# echo "Completed configuring environment for Admin Client"

# # Configuring application UI 

# echo "aws s3 ls s3://$APP_SITE_BUCKET"
# aws s3 ls s3://$APP_SITE_BUCKET 
# if [ $? -ne 0 ]; then
#     echo "Error! S3 Bucket: $APP_SITE_BUCKET not readable"
#     exit 1
# fi

# cd ../

# CURRENT_DIR=$(pwd)
# echo "Current Dir: $CURRENT_DIR"

# cd Application

# echo "Configuring environment for App Client"

# cat << EoF > ./src/environments/environment.prod.ts
# export const environment = {
#   production: true,
#   regApiGatewayUrl: '$ADMIN_APIGATEWAYURL',
#   domain: ''
# };
# EoF
# cat << EoF > ./src/environments/environment.ts
# export const environment = {
#   production: true,
#   regApiGatewayUrl: '$ADMIN_APIGATEWAYURL',
#   domain: ''
# };
# EoF

# npm install --legacy-peer-deps && npm run build

# echo "aws s3 sync --delete --cache-control no-store dist s3://$APP_SITE_BUCKET"
# aws s3 sync --delete --cache-control no-store dist s3://$APP_SITE_BUCKET 

# if [[ $? -ne 0 ]]; then
#     exit 1
# fi

# echo "Completed configuring environment for App Client"

# Configuring landing UI 

echo "aws s3 ls s3://$LANDING_APP_SITE_BUCKET"
aws s3 ls s3://$LANDING_APP_SITE_BUCKET 
if [ $? -ne 0 ]; then
    echo "Error! S3 Bucket: $LANDING_APP_SITE_BUCKET not readable"
    exit 1
fi

cd ../

CURRENT_DIR=$(pwd)
echo "Current Dir: $CURRENT_DIR"

cd Landing

echo "Configuring environment for Landing Client"

# cat << EoF > ./src/environments/environment.prod.ts
# export const environment = {
#   production: true,
#   apiGatewayUrl: '$ADMIN_APIGATEWAYURL'
# };
# EoF
cat << EoF > ./src/environments/environment.ts
export const environment = {
  production: true,
  apiGatewayUrl: '$ADMIN_APIGATEWAYURL'
};
EoF

# npm install --legacy-peer-deps && npm run build
yarn install && yarn run build

# echo "aws s3 sync --delete --cache-control no-store dist s3://$LANDING_APP_SITE_BUCKET"
# aws s3 sync --delete --cache-control no-store dist s3://$LANDING_APP_SITE_BUCKET
echo "aws s3 sync --delete --cache-control no-store build s3://$LANDING_APP_SITE_BUCKET"
aws s3 sync --delete --cache-control no-store build s3://$LANDING_APP_SITE_BUCKET

if [[ $? -ne 0 ]]; then
    exit 1
fi

cd ../..

echo "Completed configuring environment for Landing Client"


echo "Admin site URL: https://$ADMIN_SITE_URL"
echo "Application site URL: https://$APP_SITE_URL"
echo "Landing site URL: https://$LANDING_APP_SITE_URL"
echo "Successfully completed deployment"






