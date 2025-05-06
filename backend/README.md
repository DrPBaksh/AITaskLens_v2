# AITaskLens Backend

This directory contains the AWS serverless backend for the AITaskLens application, which analyzes and classifies business tasks for optimal automation strategies.

## Project Structure

```
/backend
  /auth-lambda             # Authentication Lambda function
  /analysis-lambda         # Task analysis Lambda function with OpenAI
  cloudformation.yaml      # CloudFormation template for AWS resources
  deploy.sh                # Deployment script
  README.md                # This file
```

## Prerequisites

Before deploying the backend, you need:

1. AWS CLI installed and configured with appropriate credentials
2. Docker installed and running
3. An OpenAI API key

## Environment Variables

Set the following environment variables before deployment:

```bash
export OPENAI_API_KEY=your_openai_api_key
export JWT_SECRET=your_jwt_secret  # Optional: Will be auto-generated if not provided
```

## Deployment

To deploy the backend:

1. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

The script will:
- Create ECR repositories for the Lambda functions
- Build and push Docker images
- Deploy the CloudFormation stack
- Output the API Gateway URL

## API Endpoints

The backend exposes the following endpoints:

### Authentication

**Endpoint**: `POST /api/auth`

**Request**:
```json
{
  "password": "CorndelTaskLensSLT"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "message": "Authentication successful"
}
```

### Task Analysis

**Endpoint**: `POST /api/analyze`

**Headers**:
```
Authorization: Bearer jwt_token_here
```

**Request**:
```json
{
  "answers": {
    "0": "Task description answer",
    "1": "Judgments and decisions answer",
    "2": "Frequency answer",
    "3": "Available data answer",
    "4": "Risks answer",
    "5": "Time sensitivity answer",
    "6": "Stakeholder expectations answer"
  }
}
```

**Response**:
```json
{
  "success": true,
  "result": {
    "id": "analysis-uuid",
    "Classification": "AI Agent with Human Oversight (Human-in-the-Loop)",
    "Reasoning": "Detailed reasoning for classification...",
    "Tools": ["Tool 1", "Tool 2", "Tool 3"],
    "PotentialConsiderations": ["Consideration 1", "Consideration 2"]
  }
}
```

### Health Check

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-05-05T12:00:00Z"
}
```

## Integrating with the Frontend

To integrate with the frontend:

1. Update the `src/services/api.js` file in the frontend project with the API Gateway URL from the deployment output.

2. Ensure the `AuthContext.js` is updated to use the real API endpoints.

3. Test the complete authentication and analysis flow.

## Cleaning Up

To delete all resources created by this backend:

```bash
aws cloudformation delete-stack --stack-name ai-task-lens --region your-region
```

## Security Note

This implementation uses a fixed password ("CorndelTaskLensSLT") for demonstration purposes. In a production environment, consider implementing a more secure authentication method.