# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

class Artifact:
    key =''
    def __init__(self, shardId, artifactId, path, name, data_type, original_name):
        self.shardId = shardId
        self.artifactId = artifactId
        self.key = shardId + ':' +  artifactId
        self.path = path
        self.name = name
        self.data_type = data_type
        self.original_name = original_name
