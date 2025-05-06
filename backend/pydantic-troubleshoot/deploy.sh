#!/bin/bash
set -e

# Configuration
STACK_NAME="pydantic-troubleshoot"
REGION="eu-west-2"
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
ECR_REPOSITORY="${STACK_NAME}"
IMAGE_TAG="latest"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}"

# First ensure the ECR repository exists
echo "Creating ECR repository if it doesn't exist..."
aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${REGION} || \
    aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${REGION}

# Login to ECR
echo "Logging into ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Build the Docker image
echo "Building Docker image..."
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

# Tag the image with ECR URI
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${ECR_URI}

# Push the image to ECR
echo "Pushing image to ECR..."
docker push ${ECR_URI}

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
    ContainerImageUri=${ECR_URI} \
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
echo "Example curl command:"
echo "curl -X POST ${API_URL} -H \"Content-Type: application/json\" -d '{\"question\":\"What is AWS Lambda?\",\"category\":\"AWS\"}'"