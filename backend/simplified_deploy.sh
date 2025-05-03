#!/bin/bash
# Simplified step-by-step deployment script for AITaskLens backend

set -e

# Constants
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REGION="eu-west-2"
S3_BUCKET="corndel-aitasklens-lambda-dependencies"
STACK_NAME="AITaskLens-Backend"
OPENAI_API_KEY=""
ALLOWED_ORIGIN="*"
STAGE_NAME="prod"
SSM_PARAMETER_NAME="/AITaskLens/OpenAI/ApiKey"

# Functions
function print_help {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -h, --help                 Show this help message"
    echo "  -r, --region REGION        Set AWS region (default: $REGION)"
    echo "  -b, --s3-bucket BUCKET     Set S3 bucket name (default: $S3_BUCKET)"
    echo "  -s, --stack-name NAME      Set CloudFormation stack name (default: $STACK_NAME)"
    echo "  -k, --api-key KEY          Set OpenAI API key (required)"
    echo "  -o, --origin ORIGIN        Set allowed origin for CORS (default: $ALLOWED_ORIGIN)"
    echo ""
    echo "Example:"
    echo "  $0 --api-key sk-your-openai-api-key"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -h|--help)
            print_help
            exit 0
            ;;
        -r|--region)
            REGION="$2"
            shift
            shift
            ;;
        -b|--s3-bucket)
            S3_BUCKET="$2"
            shift
            shift
            ;;
        -s|--stack-name)
            STACK_NAME="$2"
            shift
            shift
            ;;
        -k|--api-key)
            OPENAI_API_KEY="$2"
            shift
            shift
            ;;
        -o|--origin)
            ALLOWED_ORIGIN="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            print_help
            exit 1
            ;;
    esac
done

# Validate required parameters
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OpenAI API key is required"
    print_help
    exit 1
fi

# Check AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials are not configured. Please run 'aws configure'."
    exit 1
fi

echo "==== Step 1: Building Lambda Layer ===="
# Build Lambda layer if it doesn't exist
if [ ! -f "${SCRIPT_DIR}/python-dependencies.zip" ]; then
    echo "Building Lambda layer..."
    bash "${SCRIPT_DIR}/build_layer.sh"
else
    echo "Lambda layer already exists, skipping build step."
fi

echo "==== Step 2: Creating S3 Bucket ===="
# Create S3 bucket if it doesn't exist
if ! aws s3 ls "s3://${S3_BUCKET}" --region "${REGION}" &> /dev/null; then
    echo "Creating S3 bucket ${S3_BUCKET}..."
    aws s3 mb "s3://${S3_BUCKET}" --region "${REGION}"
else
    echo "S3 bucket ${S3_BUCKET} already exists."
fi

echo "==== Step 3: Uploading Lambda Layer to S3 ===="
# Upload Lambda layer to S3
echo "Uploading Lambda layer to S3..."
aws s3 cp "${SCRIPT_DIR}/python-dependencies.zip" "s3://${S3_BUCKET}/layers/python-dependencies.zip" --region "${REGION}"

echo "==== Step 4: Checking for existing stack ===="
# Check if the stack already exists
STACK_EXISTS=$(aws cloudformation describe-stacks --stack-name "${STACK_NAME}" --region "${REGION}" 2>/dev/null || echo "STACK_NOT_FOUND")

if [[ "$STACK_EXISTS" != "STACK_NOT_FOUND" ]]; then
    STACK_STATUS=$(aws cloudformation describe-stacks --stack-name "${STACK_NAME}" --region "${REGION}" --query "Stacks[0].StackStatus" --output text)
    
    echo "Stack ${STACK_NAME} exists with status: ${STACK_STATUS}"
    
    # If stack is in a failed state, delete it
    if [[ "$STACK_STATUS" == *"ROLLBACK_COMPLETE"* || "$STACK_STATUS" == *"FAILED"* ]]; then
        echo "Stack is in a failed state. Deleting stack..."
        aws cloudformation delete-stack --stack-name "${STACK_NAME}" --region "${REGION}"
        echo "Waiting for stack deletion to complete..."
        aws cloudformation wait stack-delete-complete --stack-name "${STACK_NAME}" --region "${REGION}"
        echo "Stack deleted successfully."
    fi
fi

echo "==== Step 5: Deploying CloudFormation Stack ===="
# Deploy CloudFormation stack
echo "Deploying CloudFormation stack ${STACK_NAME}..."
aws cloudformation deploy \
    --template-file "${SCRIPT_DIR}/cloudformation.yaml" \
    --stack-name "${STACK_NAME}" \
    --capabilities CAPABILITY_IAM \
    --region "${REGION}" \
    --parameter-overrides \
        AllowedOrigin="${ALLOWED_ORIGIN}" \
        StageName="${STAGE_NAME}" \
    --no-fail-on-empty-changeset

echo "==== Step 6: Updating OpenAI API Key ===="
# Update OpenAI API key in Parameter Store
echo "Updating OpenAI API key in Parameter Store..."
aws ssm put-parameter \
    --name "${SSM_PARAMETER_NAME}" \
    --value "${OPENAI_API_KEY}" \
    --type String \
    --overwrite \
    --region "${REGION}"

echo "==== Step 7: Retrieving API Endpoint ===="
# Get API endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${REGION}" \
    --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
    --output text)

echo ""
echo "==== Deployment Complete ===="
echo "API endpoint: ${API_ENDPOINT}"
echo ""
echo "Next Steps:"
echo "1. Update your frontend configuration with the API endpoint:"
echo "   ./update_frontend.sh --api-endpoint ${API_ENDPOINT}"
echo ""
echo "2. Test your API with a sample request:"
echo "   curl -X POST \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"answers\":{\"0\":\"Test task description\",\"1\":\"Test answer\",\"2\":\"Test answer\",\"3\":\"Test answer\",\"4\":\"Test answer\",\"5\":\"Test answer\",\"6\":\"Test answer\"}}' \\"
echo "     ${API_ENDPOINT}"
