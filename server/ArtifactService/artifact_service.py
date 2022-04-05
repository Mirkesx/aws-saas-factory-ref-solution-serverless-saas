# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import json
import utils
import logger
import metrics_manager
import artifact_service_dal
from aws_lambda_powertools import Tracer
from types import SimpleNamespace
tracer = Tracer()

@tracer.capture_lambda_handler
def get_artifact(event, context):
    tenantId = event['requestContext']['authorizer']['tenantId']
    tracer.put_annotation(key="TenantId", value=tenantId)
    
    logger.log_with_tenant_context(event, "Request received to get a artifact")
    params = event['pathParameters']
    logger.log_with_tenant_context(event, params)
    key = params['id']
    logger.log_with_tenant_context(event, key)
    artifact = artifact_service_dal.get_artifact(event, key)

    logger.log_with_tenant_context(event, "Request completed to get a artifact")
    metrics_manager.record_metric(event, "SingleArtifactRequested", "Count", 1)
    return utils.generate_response(artifact)
    
@tracer.capture_lambda_handler
def create_artifact(event, context):    
    tenantId = event['requestContext']['authorizer']['tenantId']
    tracer.put_annotation(key="TenantId", value=tenantId)

    logger.log_with_tenant_context(event, "Request received to create a artifact")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d))
    artifact = artifact_service_dal.create_artifact(event, payload)
    logger.log_with_tenant_context(event, "Request completed to create a artifact")
    metrics_manager.record_metric(event, "ArtifactCreated", "Count", 1)
    return utils.generate_response(artifact)
    
@tracer.capture_lambda_handler
def update_artifact(event, context):
    tenantId = event['requestContext']['authorizer']['tenantId']
    tracer.put_annotation(key="TenantId", value=tenantId)

    logger.log_with_tenant_context(event, "Request received to update a artifact")
    payload = json.loads(event['body'], object_hook=lambda d: SimpleNamespace(**d))
    params = event['pathParameters']
    key = params['id']
    artifact = artifact_service_dal.update_artifact(event, payload, key)
    logger.log_with_tenant_context(event, "Request completed to update a artifact") 
    metrics_manager.record_metric(event, "ArtifactUpdated", "Count", 1)   
    return utils.generate_response(artifact)

@tracer.capture_lambda_handler
def delete_artifact(event, context):
    tenantId = event['requestContext']['authorizer']['tenantId']
    tracer.put_annotation(key="TenantId", value=tenantId)

    logger.log_with_tenant_context(event, "Request received to delete a artifact")
    params = event['pathParameters']
    key = params['id']
    response = artifact_service_dal.delete_artifact(event, key)
    logger.log_with_tenant_context(event, "Request completed to delete a artifact")
    metrics_manager.record_metric(event, "ArtifactDeleted", "Count", 1)
    return utils.create_success_response("Successfully deleted the artifact")

@tracer.capture_lambda_handler
def get_artifacts(event, context):
    tenantId = event['requestContext']['authorizer']['tenantId']
    tracer.put_annotation(key="TenantId", value=tenantId)
    
    logger.log_with_tenant_context(event, "Request received to get all artifacts")
    response = artifact_service_dal.get_artifacts(event, tenantId)
    metrics_manager.record_metric(event, "ArtifactsRetrieved", "Count", len(response))
    logger.log_with_tenant_context(event, "Request completed to get all artifacts")
    return utils.generate_response(response)

  