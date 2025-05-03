#!/bin/bash
# Manual deployment script for AITaskLens backend without Lambda Layers

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
PACKAGE_DIR="${SCRIPT_DIR}/lambda_package"
LAMBDA_ZIP="${SCRIPT_DIR}/lambda_package.zip"

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

echo "==== Step 1: Creating Lambda Package ===="
# Create package directory
rm -rf "${PACKAGE_DIR}" "${LAMBDA_ZIP}"
mkdir -p "${PACKAGE_DIR}"

# Copy Lambda function
echo "Copying Lambda function code..."
cp "${SCRIPT_DIR}/lambda_function.py" "${PACKAGE_DIR}/"

# Install dependencies
echo "Installing dependencies..."
cd "${PACKAGE_DIR}"
pip install openai==1.77.0 boto3 -t . --no-cache-dir

# Remove unnecessary files to reduce size
echo "Cleaning up unnecessary files..."
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type d -name "*.dist-info" -exec rm -rf {} +
find . -type d -name "*.egg-info" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
find . -type f -name "*.pyo" -delete
find . -type f -name "*.pyd" -delete

# Create zip package
echo "Creating Lambda package zip file..."
zip -r "${LAMBDA_ZIP}" .
cd "${SCRIPT_DIR}"

echo "==== Step 2: Creating/Ensuring S3 Bucket ===="
# Create S3 bucket if it doesn't exist
if ! aws s3 ls "s3://${S3_BUCKET}" --region "${REGION}" &> /dev/null; then
    echo "Creating S3 bucket ${S3_BUCKET}..."
    aws s3 mb "s3://${S3_BUCKET}" --region "${REGION}"
else
    echo "S3 bucket ${S3_BUCKET} already exists."
fi

echo "==== Step 3: Uploading Lambda Package to S3 ===="
# Upload Lambda package to S3
echo "Uploading Lambda package to S3..."
aws s3 cp "${LAMBDA_ZIP}" "s3://${S3_BUCKET}/lambda_package.zip" --region "${REGION}"

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

echo "==== Step 5: Creating CloudFormation Template ===="
# Create a simplified CloudFormation template
cat > "${SCRIPT_DIR}/manual_cloudformation.yaml" << EOF
AWSTemplateFormatVersion: '2010-09-09'
Description: 'AITaskLens Backend Infrastructure - API Gateway and Lambda resources'

Parameters:
  AllowedOrigin:
    Type: String
    Default: '*'
    Description: The domain name for CORS (e.g., http://localhost:3000 or *)

  StageName:
    Type: String
    Default: 'prod'
    Description: The API Gateway Stage name
    
  S3Bucket:
    Type: String
    Description: S3 bucket containing the Lambda package
    
  S3Key:
    Type: String
    Default: 'lambda_package.zip'
    Description: S3 key for the Lambda package

Resources:
  # IAM Role for Lambda function
  LambdaExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: 'sts:AssumeRole'
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      Policies:
        - PolicyName: SsmParameterStoreAccess
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 'ssm:GetParameter'
                Resource: !Sub 'arn:aws:ssm:\${AWS::Region}:\${AWS::AccountId}:parameter/AITaskLens/OpenAI/ApiKey'

  # SSM Parameter for OpenAI API Key
  OpenAIApiKeyParameter:
    Type: AWS::SSM::Parameter
    Properties:
      Name: '/AITaskLens/OpenAI/ApiKey'
      Type: 'String'
      Value: 'placeholder-update-after-deployment'
      Description: 'OpenAI API Key for AITaskLens'

  # Lambda Function
  AITaskLensFunction:
    Type: AWS::Lambda::Function
    DependsOn: LambdaExecutionRole
    Properties:
      FunctionName: AITaskLens-Analyzer
      Handler: lambda_function.lambda_handler
      Role: !GetAtt LambdaExecutionRole.Arn
      Runtime: python3.11
      MemorySize: 256
      Timeout: 30
      Environment:
        Variables:
          SSM_PARAMETER_NAME: '/AITaskLens/OpenAI/ApiKey'
          ALLOWED_ORIGIN: !Ref AllowedOrigin
      Code:
        S3Bucket: !Ref S3Bucket
        S3Key: !Ref S3Key

  # API Gateway REST API
  AITaskLensApi:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: AITaskLens-API
      Description: API for AITaskLens task analysis
      EndpointConfiguration:
        Types:
          - REGIONAL

  # API Gateway Resource - /analyze
  AnalyzeResource:
    Type: AWS::ApiGateway::Resource
    Properties:
      RestApiId: !Ref AITaskLensApi
      ParentId: !GetAtt AITaskLensApi.RootResourceId
      PathPart: 'analyze'

  # API Gateway Method - POST /analyze
  AnalyzePostMethod:
    Type: AWS::ApiGateway::Method
    Properties:
      RestApiId: !Ref AITaskLensApi
      ResourceId: !Ref AnalyzeResource
      HttpMethod: POST
      AuthorizationType: NONE
      Integration:
        Type: AWS_PROXY
        IntegrationHttpMethod: POST
        Uri: !Sub 'arn:aws:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/\${AITaskLensFunction.Arn}/invocations'
      MethodResponses:
        - StatusCode: '200'
          ResponseModels:
            application/json: 'Empty'
          ResponseParameters:
            method.response.header.Access-Control-Allow-Origin: true
        - StatusCode: '400'
          ResponseModels:
            application/json: 'Empty'
          ResponseParameters:
            method.response.header.Access-Control-Allow-Origin: true
        - StatusCode: '500'
          ResponseModels:
            application/json: 'Empty'
          ResponseParameters:
            method.response.header.Access-Control-Allow-Origin: true

  # API Gateway Method - OPTIONS /analyze (for CORS)
  AnalyzeOptionsMethod:
    Type: AWS::ApiGateway::Method
    Properties:
      RestApiId: !Ref AITaskLensApi
      ResourceId: !Ref AnalyzeResource
      HttpMethod: OPTIONS
      AuthorizationType: NONE
      Integration:
        Type: MOCK
        IntegrationResponses:
          - StatusCode: 200
            ResponseParameters:
              method.response.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
              method.response.header.Access-Control-Allow-Methods: "'GET,POST,OPTIONS'"
              method.response.header.Access-Control-Allow-Origin: !Sub "'\${AllowedOrigin}'"
            ResponseTemplates:
              application/json: '{}'
        RequestTemplates:
          application/json: '{"statusCode": 200}'
      MethodResponses:
        - StatusCode: 200
          ResponseModels:
            application/json: 'Empty'
          ResponseParameters:
            method.response.header.Access-Control-Allow-Headers: true
            method.response.header.Access-Control-Allow-Methods: true
            method.response.header.Access-Control-Allow-Origin: true

  # Permission for API Gateway to invoke Lambda
  LambdaInvokePermission:
    Type: AWS::Lambda::Permission
    Properties:
      Action: lambda:InvokeFunction
      FunctionName: !Ref AITaskLensFunction
      Principal: apigateway.amazonaws.com
      SourceArn: !Sub 'arn:aws:execute-api:\${AWS::Region}:\${AWS::AccountId}:\${AITaskLensApi}/*/POST/analyze'

  # API Gateway Deployment
  ApiGatewayDeployment:
    Type: AWS::ApiGateway::Deployment
    DependsOn:
      - AnalyzePostMethod
      - AnalyzeOptionsMethod
    Properties:
      RestApiId: !Ref AITaskLensApi
      StageName: !Ref StageName

Outputs:
  ApiEndpoint:
    Description: 'API Gateway endpoint URL'
    Value: !Sub 'https://\${AITaskLensApi}.execute-api.\${AWS::Region}.amazonaws.com/\${StageName}/analyze'
    Export:
      Name: AITaskLensApiEndpoint

  LambdaFunctionName:
    Description: 'Lambda Function Name'
    Value: !Ref AITaskLensFunction
    Export:
      Name: AITaskLensFunctionName
EOF

echo "==== Step 6: Deploying CloudFormation Stack ===="
# Deploy CloudFormation stack
echo "Deploying CloudFormation stack ${STACK_NAME}..."
aws cloudformation deploy \
    --template-file "${SCRIPT_DIR}/manual_cloudformation.yaml" \
    --stack-name "${STACK_NAME}" \
    --capabilities CAPABILITY_IAM \
    --region "${REGION}" \
    --parameter-overrides \
        AllowedOrigin="${ALLOWED_ORIGIN}" \
        StageName="${STAGE_NAME}" \
        S3Bucket="${S3_BUCKET}" \
        S3Key="lambda_package.zip" \
    --no-fail-on-empty-changeset

echo "==== Step 7: Updating OpenAI API Key ===="
# Update OpenAI API key in Parameter Store
echo "Updating OpenAI API key in Parameter Store..."
aws ssm put-parameter \
    --name "${SSM_PARAMETER_NAME}" \
    --value "${OPENAI_API_KEY}" \
    --type String \
    --overwrite \
    --region "${REGION}"

echo "==== Step 8: Retrieving API Endpoint ===="
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