#!/bin/bash
set -e

# Configuration
STACK_NAME="ai-task-lens"
REGION="eu-west-2"  # Change to your preferred region
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

# ECR Repository names
AUTH_ECR_REPOSITORY="${STACK_NAME}-auth"
ANALYSIS_ECR_REPOSITORY="${STACK_NAME}-analysis"

# Image tags
IMAGE_TAG="latest"

# ECR URIs
AUTH_ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${AUTH_ECR_REPOSITORY}:${IMAGE_TAG}"
ANALYSIS_ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ANALYSIS_ECR_REPOSITORY}:${IMAGE_TAG}"

# Check for required environment variables
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY environment variable is required"
  exit 1
fi

# Generate a random JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -base64 32)
  echo "Generated random JWT secret"
fi

# Create Auth Lambda ECR repository if it doesn't exist
echo "Creating Auth Lambda ECR repository if it doesn't exist..."
aws ecr describe-repositories --repository-names ${AUTH_ECR_REPOSITORY} --region ${REGION} || \
    aws ecr create-repository --repository-name ${AUTH_ECR_REPOSITORY} --region ${REGION}

# Create Analysis Lambda ECR repository if it doesn't exist
echo "Creating Analysis Lambda ECR repository if it doesn't exist..."
aws ecr describe-repositories --repository-names ${ANALYSIS_ECR_REPOSITORY} --region ${REGION} || \
    aws ecr create-repository --repository-name ${ANALYSIS_ECR_REPOSITORY} --region ${REGION}

# Login to ECR
echo "Logging into ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Build and push Auth Lambda Docker image
echo "Building Auth Lambda Docker image..."
cd auth-lambda
docker build -t ${AUTH_ECR_REPOSITORY}:${IMAGE_TAG} .
docker tag ${AUTH_ECR_REPOSITORY}:${IMAGE_TAG} ${AUTH_ECR_URI}
echo "Pushing Auth Lambda image to ECR..."
docker push ${AUTH_ECR_URI}
cd ..

# Build and push Analysis Lambda Docker image
echo "Building Analysis Lambda Docker image..."
cd analysis-lambda
docker build -t ${ANALYSIS_ECR_REPOSITORY}:${IMAGE_TAG} .
docker tag ${ANALYSIS_ECR_REPOSITORY}:${IMAGE_TAG} ${ANALYSIS_ECR_URI}
echo "Pushing Analysis Lambda image to ECR..."
docker push ${ANALYSIS_ECR_URI}
cd ..

# If the stack exists in a failed state, delete it
if aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${REGION} 2>&1 | grep -q 'ROLLBACK_COMPLETE\|CREATE_FAILED\|ROLLBACK_FAILED\|DELETE_FAILED\|UPDATE_ROLLBACK_COMPLETE'; then
  echo "Stack exists in a failed state, deleting it first..."
  aws cloudformation delete-stack --stack-name ${STACK_NAME} --region ${REGION}
  echo "Waiting for stack deletion to complete..."
  aws cloudformation wait stack-delete-complete --stack-name ${STACK_NAME} --region ${REGION}
fi

# Deploy the CloudFormation stack
echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name ${STACK_NAME} \
  --parameter-overrides \
    OpenAIApiKey=${OPENAI_API_KEY} \
    AuthPassword=CorndelTaskLensSLT \
    JwtSecret=${JWT_SECRET} \
    AuthLambdaImageUri=${AUTH_ECR_URI} \
    AnalysisLambdaImageUri=${ANALYSIS_ECR_URI} \
  --capabilities CAPABILITY_IAM \
  --region ${REGION}

# Get the API Gateway URL
API_URL=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text \
  --region ${REGION})

echo "Deployment completed successfully!"
echo "API Gateway URL: ${API_URL}"
echo ""
echo "Example auth request:"
echo "curl -X POST ${API_URL}/auth -H \"Content-Type: application/json\" -d '{\"password\":\"CorndelTaskLensSLT\"}'"
echo ""
echo "Example analysis request (requires auth token):"
echo "curl -X POST ${API_URL}/analyze -H \"Content-Type: application/json\" -H \"Authorization: Bearer YOUR_TOKEN\" -d '{\"answers\":{\"0\":\"Task description\", \"1\":\"Creative decisions\", \"2\":\"Frequency\", \"3\":\"Available data\", \"4\":\"Risks\", \"5\":\"Time sensitivity\", \"6\":\"Stakeholder expectations\"}}'"