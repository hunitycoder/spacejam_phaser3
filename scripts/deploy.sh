#!/bin/bash  
set -e

# Change the domain name to deploy to the corresponding CloudFront Distribution automatically
export DOMAIN_NAME="spacejam-gamedesigner.attexp.com"

export BUCKET="s3://$DOMAIN_NAME"
export BUCKET_FOLDER="/"
export LOCAL_BUILD_FOLDER="./build"
export TEMP_FOLDER="tmp"

# User should be allowed to list target distribution
export CLOUDFRONT_DISTRIBUTION_ID=`aws cloudfront --output yaml list-distributions --query "DistributionList.Items[?Origins.Items[-1].DomainName == '${DOMAIN_NAME}.s3.amazonaws.com'].Id"  | sed "s/-//g"  | sed "s/ //g"`

echo ""
echo "Target bucket: $BUCKET"
echo "Bucket folder: $BUCKET_FOLDER"
echo "Local relative build location: $LOCAL_BUILD_FOLDER"
echo "CloudFront Distribution ID: $CLOUDFRONT_DISTRIBUTION_ID"
echo ""

# Check if there are files in the local build folder
if [ -z "$(ls -A $LOCAL_BUILD_FOLDER)" ]; then
    echo "WARNING: $LOCAL_BUILD_FOLDER is empty."
    ls -A $LOCAL_BUILD_FOLDER
    echo "Running this script will delete the entire content of $BUCKET. Do you want to continue? [NO/yes]"

    read CONFIRM_DELETE

    if ! [[ $CONFIRM_DELETE == "yes" ]]; then
        echo "Script aborted."
        echo ""
        exit 1
    fi
else
    echo "Local build found."
fi

# User should be allowed to copy and list content of target S3 bucket
if ! [[ $CONFIRM_DELETE == "yes" ]]; then
    echo ""
    echo "Uploading local build from $LOCAL_BUILD_FOLDER to $BUCKET/$TEMP_FOLDER:"
    aws s3 cp $LOCAL_BUILD_FOLDER $BUCKET/$TEMP_FOLDER --exclude "*/.DS_Store" --recursive

    echo ""
    echo "Content of $BUCKET after upload to temporary folder:"
    aws s3 ls $BUCKET
fi

# User should be allowed to remove and objects in target S3 bucket
echo ""
echo "Deleting last build (if any):"
aws s3 rm $BUCKET --exclude "$TEMP_FOLDER/*" --recursive

# User should be allowed to move and objects in target S3 bucket
if ! [[ $CONFIRM_DELETE == "yes" ]]; then
    echo ""
    echo "Moving uploaded build to the root of the bucket:"
    aws s3 mv $BUCKET/$TEMP_FOLDER/ $BUCKET --recursive
fi

echo ""
echo "Content of $BUCKET:"
aws s3 ls $BUCKET

echo ""
echo "Build successfully uploaded."

# User should be allowed to create cache invalidations on target distribution
echo ""
echo "Invalidating cache:"
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

echo ""
