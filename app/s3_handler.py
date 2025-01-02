import boto3
from flask import current_app
from werkzeug.utils import secure_filename

def get_s3_client():
    return boto3.client(
        's3',
        region_name=current_app.config['AWS_REGION'],
        aws_access_key_id=current_app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=current_app.config['AWS_SECRET_ACCESS_KEY']
    )
 
def upload_image_to_s3(file, folder, identifier, filename):
    if not file:
        return None

    s3_client = get_s3_client()
    bucket_name = current_app.config['S3_BUCKET_NAME']
    object_name = f"{folder}/{identifier}/{filename}"

    try:
        s3_client.upload_fileobj(
            file,
            bucket_name,
            object_name
        )
        return f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
    except Exception as e:
        current_app.logger.error(f"Failed to upload file to S3: {str(e)}")
        return None

def delete_image_from_s3(image_url):
    try:
        s3_client = get_s3_client()
        bucket_name = current_app.config['S3_BUCKET_NAME']
        # Extract the object key from the URL
        object_key = image_url.replace(f"https://{bucket_name}.s3.amazonaws.com/", "")
        s3_client.delete_object(Bucket=bucket_name, Key=object_key)
        print("Deleted image from S3:", object_key)
    except Exception as e:
        current_app.logger.error(f"Failed to delete file from S3: {str(e)}")



