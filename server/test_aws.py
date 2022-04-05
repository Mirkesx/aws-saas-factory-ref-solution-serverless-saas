import boto3

def lambda_handler(event, context):

    # sts_connection = boto3.client('sts')
    # acct_b = sts_connection.assume_role(
    #     RoleArn="arn:aws:sts::640339490701:assumed-role/authorizer-access-role/tenant-aware-session",
    #     RoleSessionName="cross_acct_lambda"
    # )
    
    # ACCESS_KEY = acct_b['Credentials']['AccessKeyId']
    # SECRET_KEY = acct_b['Credentials']['SecretAccessKey']
    # SESSION_TOKEN = "FwoGZXIvYXdzEA0aDEiH45wjm57phm3DXiKNA9dpEmn1Qo06gU2HW/NdtNy6br5qEdavjVWSdDnw4FlikDkRnvJZotjC6pcstSxkjDuSZC6kriQzyIJ+VllTNvIpNUX6SArNPmra5OQgZsXJmSw6Oa6uG8c6fJf+y2YH7eEAHU66ni2hLaHtxLKXNfehVHglVe2MsUB7B/yOYJjWP02MDwGptWYitlFNGX4ZvjfIVV3gcqhDjYi+q60UZgCufbhem3zcwLaY3LQBh9QZxQMck2JQpl+F5xkvvfNQ6pPzAJEV05v0z9GqX2xUT5yOLCq9WKtnj5lAKQFEAptgVVEKFZkUubKh3RF2cS3K4Pq7b8lbYVNtYWEVKVuhV9BTtnvnapQaR+jyCOAzlQ6T57IXmYVr2w0StdKTJwSdJbByxGxMKyb1ZK0DuwvZPfM6naorKFzKMr+8mQ7667TzSyhAxtapUV7VIrizlW7vM+x6gCNPQbDUia2qoP0aCYQ3xxj3MFOBX/SewioqK2P8OOBULmUuTPQRUJ/7I3V5diNEtdukEZOyFheYhO8op72ykgYyLZbVKfOYUJPsb3CVYsA+9+uAzNG/mJp27aAOkntT1kio/SOnsVyAxvaDTKwapg=="

    # create service client using the assumed role credentials, e.g. S3
    accesskey = 'ASIAZKFZVG6G6A7VHRKJ'
    secretkey = 'oi6SADVjJ4xZ77O5rvhmYSUAn0yL2yXuAnsL8vHB'
    sessiontoken = "FwoGZXIvYXdzEA0aDEiH45wjm57phm3DXiKNA9dpEmn1Qo06gU2HW/NdtNy6br5qEdavjVWSdDnw4FlikDkRnvJZotjC6pcstSxkjDuSZC6kriQzyIJ+VllTNvIpNUX6SArNPmra5OQgZsXJmSw6Oa6uG8c6fJf+y2YH7eEAHU66ni2hLaHtxLKXNfehVHglVe2MsUB7B/yOYJjWP02MDwGptWYitlFNGX4ZvjfIVV3gcqhDjYi+q60UZgCufbhem3zcwLaY3LQBh9QZxQMck2JQpl+F5xkvvfNQ6pPzAJEV05v0z9GqX2xUT5yOLCq9WKtnj5lAKQFEAptgVVEKFZkUubKh3RF2cS3K4Pq7b8lbYVNtYWEVKVuhV9BTtnvnapQaR+jyCOAzlQ6T57IXmYVr2w0StdKTJwSdJbByxGxMKyb1ZK0DuwvZPfM6naorKFzKMr+8mQ7667TzSyhAxtapUV7VIrizlW7vM+x6gCNPQbDUia2qoP0aCYQ3xxj3MFOBX/SewioqK2P8OOBULmUuTPQRUJ/7I3V5diNEtdukEZOyFheYhO8op72ykgYyLZbVKfOYUJPsb3CVYsA+9+uAzNG/mJp27aAOkntT1kio/SOnsVyAxvaDTKwapg=="
    dynamodb = boto3.resource('dynamodb',
                aws_access_key_id=accesskey,
                aws_secret_access_key=secretkey,
                aws_session_token=sessiontoken
                ) 

    return dynamodb.Table("Artifact-pooled")

table = lambda_handler({}, {})
table.put_item(Item={})