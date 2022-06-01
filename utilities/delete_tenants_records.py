import boto3
from boto3.dynamodb.conditions import Attr
import sys


dynamodb = boto3.resource('dynamodb')

tenant_details_table_name = "ServerlessSaaS-TenantDetails"
tenant_details_table = dynamodb.Table(tenant_details_table_name)

tenant_stack_mapping_table_name = "ServerlessSaaS-TenantStackMapping"
tenant_stack_mapping_table = dynamodb.Table(tenant_stack_mapping_table_name)

tenant_user_mapping_table_name = "ServerlessSaaS-TenantUserMapping"
tenant_user_mapping_table = dynamodb.Table(tenant_user_mapping_table_name)

if len(sys.argv) < 2:
    print('Deleting all user pools')
    tenants_ids = list(map(lambda x: x['tenantId'], tenant_details_table.scan(
            Select='SPECIFIC_ATTRIBUTES',
            AttributesToGet=['tenantId'],
            )['Items']))
else:
    tenants_ids = [sys.argv[1]]


for tenant_id in tenants_ids:
    print('Deleting tenant: ' + tenant_id)
    try:
        tenant_details_table.delete_item(
            Key={
                'tenantId': tenant_id
            }
        )
    except Exception as e:
        print(e)
        print('Tenant not found')

    try:
        tenant_stack_mapping_table.delete_item(
            Key={
                'tenantId': tenant_id
            }
        )
    except Exception as e:
        print(e)
        print('Tenant stack mapping not found')

    try:
        users = tenant_user_mapping_table.scan(
                FilterExpression=Attr("tenantId").eq(tenant_id)
                )['Items']
        for user in users:
            tenant_user_mapping_table.delete_item(
            Key={
                'tenantId': user['tenantId'],
                'userName': user['userName']
            }
        )
    except Exception as e:
        print(e)
        print('Tenant user mapping not found')