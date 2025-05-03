#!/bin/bash
# Deployment script for AITaskLens backend

set -e

# Constants
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
STACK_NAME="AITaskLens-Backend"
S3_BUCKET=""
REGION="eu-west-2"
ALLOWED_ORIGIN="*"
STAGE_NAME="prod"
OPENAI_API_KEY=""
SSM_PARAMETER_NAME="/AITaskLens/OpenAI/ApiKey"

# Functions
function print_help {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -h, --help                 Show this help message"
    echo "  -s, --stack-name NAME      Set CloudFormation stack name (default: $STACK_NAME)"
    echo "  -b, --s3-bucket BUCKET     Set S3 bucket name for Lambda layer (required)"
    echo "  -r, --region REGION        Set AWS region (default: $REGION)"
    echo "  -o, --origin ORIGIN        Set allowed origin for CORS (default: $ALLOWED_ORIGIN)"
    echo "  -k, --api-key KEY          Set OpenAI API key (required)"
    echo "  -p, --parameter-name NAME  Set SSM parameter name for API key (default: $SSM_PARAMETER_NAME)"
    echo ""
    echo "Example:"
    echo "  $0 --s3-bucket my-bucket --api-key sk-xxx"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -h|--help)
            print_help
            exit 0
            ;;
        -s|--stack-name)
            STACK_NAME="$2"
            shift
            shift
            ;;
        -b|--s3-bucket)
            S3_BUCKET="$2"
            shift
            shift
            ;;
        -r|--region)
            REGION="$2"
            shift
            shift
            ;;
        -o|--origin)
            ALLOWED_ORIGIN="$2"
            shift
            shift
            ;;
        -k|--api-key)
            OPENAI_API_KEY="$2"
            shift
            shift
            ;;
        -p|--parameter-name)
            SSM_PARAMETER_NAME="$2"
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
if [ -z "$S3_BUCKET" ]; then
    echo "Error: S3 bucket name is required"
    print_help
    exit 1
fi

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

# Build Lambda layer
echo "Building Lambda layer..."
bash "${SCRIPT_DIR}/build_layer.sh"

# Check if S3 bucket exists, create if not
if ! aws s3 ls "s3://${S3_BUCKET}" --region "${REGION}" &> /dev/null; then
    echo "Creating S3 bucket ${S3_BUCKET}..."
    aws s3 mb "s3://${S3_BUCKET}" --region "${REGION}"
fi

# Upload Lambda layer to S3
echo "Uploading Lambda layer to S3..."
aws s3 cp "${SCRIPT_DIR}/python-dependencies.zip" "s3://${S3_BUCKET}/layers/python-dependencies.zip" --region "${REGION}"

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

# Update OpenAI API key in Parameter Store
echo "Updating OpenAI API key in Parameter Store..."
aws ssm put-parameter \
    --name "${SSM_PARAMETER_NAME}" \
    --value "${OPENAI_API_KEY}" \
    --type SecureString \
    --overwrite \
    --region "${REGION}"

# Get API endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${REGION}" \
    --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
    --output text)

echo ""
echo "Deployment completed successfully!"
echo "API endpoint: ${API_ENDPOINT}"
echo ""
echo "Now run the following command to update your frontend API configuration:"
echo "bash ${SCRIPT_DIR}/update_frontend.sh --api-endpoint ${API_ENDPOINT}"
