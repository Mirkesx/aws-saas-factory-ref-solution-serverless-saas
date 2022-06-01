import boto3

suffix = "17"
prefix = "serverless-saas-userinterface-"+suffix
s3 = boto3.client("s3")

results = s3.list_buckets()
names = [bucket["Name"]
         for bucket in results["Buckets"] if bucket["Name"].startswith(prefix)]

for bucket in names:
    try:
        print("Deleting bucket: "+bucket)
        s3.delete_bucket(Bucket=bucket)
    except Exception as e:
        print("Error deleting bucket: "+bucket)
        print(e)
