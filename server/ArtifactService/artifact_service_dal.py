# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

from pprint import pprint
import os
import boto3
from botocore.exceptions import ClientError
import uuid
import json
import logger
import random
import threading

from artifact_models import Artifact
from types import SimpleNamespace
from boto3.dynamodb.conditions import Key


is_pooled_deploy = os.environ['IS_POOLED_DEPLOY']
table_name = os.environ['ARTIFACT_TABLE_NAME']
dynamodb = None

suffix_start = 1 
suffix_end = 10

def get_artifact(event, key):
    table = __get_dynamodb_table(event, dynamodb)
    
    try:
        shardId = key.split(":")[0]
        artifactId = key.split(":")[1] 
        logger.log_with_tenant_context(event, shardId)
        logger.log_with_tenant_context(event, artifactId)
        response = table.get_item(Key={'shardId': shardId, 'artifactId': artifactId})
        item = response['Item']
        artifact = Artifact(item['shardId'], item['artifactId'], item['path'], item['name'], item['data_type'], item['original_name'])
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting a artifact', e)
    else:
        logger.info("GetItem succeeded:"+ str(artifact))
        return artifact

def delete_artifact(event, key):
    table = __get_dynamodb_table(event, dynamodb)
    
    try:
        shardId = key.split(":")[0]
        artifactId = key.split(":")[1] 
        response = table.delete_item(Key={'shardId':shardId, 'artifactId': artifactId})
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error deleting a artifact', e)
    else:
        logger.info("DeleteItem succeeded:")
        return response


def create_artifact(event, payload):
    try:
        tenantId = event['requestContext']['authorizer']['tenantId']    
        table = __get_dynamodb_table(event, dynamodb)
        logger.info("event: {}".format(event))
        logger.info("table: {}".format(table))

        
        suffix = random.randrange(suffix_start, suffix_end)
        shardId = tenantId+"-"+str(suffix)

        artifact = Artifact(shardId, str(uuid.uuid4()), payload.path, payload.name, payload.data_type, payload.original_name)
        logger.info("artifact: {}".format(artifact))
        response = table.put_item(
            Item=
                {
                    'shardId': shardId,  
                    'artifactId': artifact.artifactId,
                    'path': artifact.path,
                    'name': artifact.name,
                    'data_type': artifact.data_type,
                    'original_name': artifact.original_name
                }
        )
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error adding a artifact', e)
    else:
        logger.info("PutItem succeeded:")
        return artifact

def update_artifact(event, payload, key):
    table = __get_dynamodb_table(event, dynamodb)
    
    try:
        shardId = key.split(":")[0]
        artifactId = key.split(":")[1] 
        logger.log_with_tenant_context(event, shardId)
        logger.log_with_tenant_context(event, artifactId)

        artifact = Artifact(shardId, artifactId, payload.path, payload.name, payload.data_type, payload.original_name)

        response = table.update_item(Key={'shardId':artifact.shardId, 'artifactId': artifact.artifactId},
        UpdateExpression="set path=:path, #n=:artifactName, name=:name, data_type=:data_type",
        ExpressionAttributeNames= {'#n':'name'},
        ExpressionAttributeValues={
            ':path': artifact.path,
            ':artifactName': artifact.name,
            ':name': artifact.name,
            ':data_type': artifact.data_type,
            ':original_name': artifact.original_name
        },
        ReturnValues="UPDATED_NEW")
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error updating a artifact', e)
    else:
        logger.info("UpdateItem succeeded:")
        return artifact        

def get_artifacts(event, tenantId):    
    table = __get_dynamodb_table(event, dynamodb)
    get_all_artifacts_response =[]
    try:
        __query_all_partitions(tenantId,get_all_artifacts_response, table)
    except ClientError as e:
        logger.error(e.response['Error']['Message'])
        raise Exception('Error getting all artifacts', e)
    else:
        logger.info("Get artifacts succeeded")
        return get_all_artifacts_response

def __query_all_partitions(tenantId,get_all_artifacts_response, table):
    threads = []    
    
    for suffix in range(suffix_start, suffix_end):
        partition_id = tenantId+'-'+str(suffix)
        
        thread = threading.Thread(target=__get_tenant_data, args=[partition_id, get_all_artifacts_response, table])
        threads.append(thread)
        
    # Start threads
    for thread in threads:
        thread.start()
    # Ensure all threads are finished
    for thread in threads:
        thread.join()
           
def __get_tenant_data(partition_id, get_all_artifacts_response, table):    
    logger.info(partition_id)
    response = table.query(KeyConditionExpression=Key('shardId').eq(partition_id))    
    if (len(response['Items']) > 0):
        for item in response['Items']:
            artifact = Artifact(item['shardId'], item['artifactId'], item['path'], item['name'], item['data_type'], item['original_name'])
            get_all_artifacts_response.append(artifact)

def __get_dynamodb_table(event, dynamodb):    
    if (is_pooled_deploy=='true'):
        accesskey = event['requestContext']['authorizer']['accesskey']
        secretkey = event['requestContext']['authorizer']['secretkey']
        sessiontoken = event['requestContext']['authorizer']['sessiontoken']    
        dynamodb = boto3.resource('dynamodb',
                aws_access_key_id=accesskey,
                aws_secret_access_key=secretkey,
                aws_session_token=sessiontoken
                )       
    else:
        if not dynamodb:
            dynamodb = boto3.resource('dynamodb')
        
    return dynamodb.Table(table_name)
