import boto3
import sys


client = boto3.client('cognito-idp')

if len(sys.argv) < 2:
    print('Deleting all user pools')
    user_pools = (client.list_user_pools(MaxResults=60))['UserPools']
else:
    user_pools = [(client.describe_user_pool(UserPoolId=sys.argv[1]))['UserPool']]



for user_pool in user_pools:
    if user_pool['Name'] not in ['OperationUsers-ServerlessSaaSUserPool', 'PooledTenant-ServerlessSaaSUserPool']:
        print('Deleting user pool: ' + user_pool['Id'])
        try:
            user_pool_description = client.describe_user_pool(
                UserPoolId=user_pool['Id']
            )

            try:
                delete_domain_response = client.delete_user_pool_domain(
                    UserPoolId=user_pool['Id'],
                    Domain=user_pool_description['UserPool']['Domain']
                )
            except Exception as e:
                print(e)
                print('Domain not found')

            try:
                delete_user_pool_response = client.delete_user_pool(
                    UserPoolId=user_pool['Id']
                )
            except Exception as e:
                print(e)
                print('User pool not deleted')
        except Exception as e:
            print(e)
            print('User pool not found')