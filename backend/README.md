# AITaskLens Backend

This directory contains the backend infrastructure for the AITaskLens application. The backend is built using AWS services, including Lambda, API Gateway, and Parameter Store for secure API key storage.

## Architecture

The backend consists of the following components:

- **AWS Lambda**: Executes the AI task analysis logic using the OpenAI API
- **API Gateway**: Provides a RESTful API endpoint for the frontend to communicate with the Lambda function
- **SSM Parameter Store**: Securely stores the OpenAI API key
- **AWS CloudFormation**: Manages the infrastructure as code

## Prerequisites

Before deploying the backend, you'll need:

1. **AWS CLI** installed and configured with appropriate permissions
2. **Python 3.11** for developing and testing the Lambda function
3. **OpenAI API Key** for calling the OpenAI API
4. **Bash** environment (Linux, macOS, or WSL on Windows)

## Deployment Instructions

Follow these steps to deploy the backend:

### 1. Build the Lambda Layer

The Lambda function requires dependencies such as the OpenAI SDK. We'll package these into a Lambda Layer:

```bash
# Make the scripts executable
chmod +x build_layer.sh deploy.sh update_frontend.sh

# Build the Lambda layer
./build_layer.sh
```

### 2. Deploy the CloudFormation Stack

Deploy the infrastructure using CloudFormation:

```bash
# Deploy the CloudFormation stack (replace with your values)
./deploy.sh \
  --s3-bucket your-bucket-name \
  --api-key your-openai-api-key \
  --origin http://localhost:3000
```

Options:
- `--s3-bucket`: S3 bucket to store the Lambda layer (required)
- `--api-key`: Your OpenAI API key (required)
- `--origin`: The allowed origin for CORS (default: *)
- `--region`: AWS region (default: eu-west-2)
- `--stack-name`: CloudFormation stack name (default: AITaskLens-Backend)

### 3. Update Frontend Configuration

After deploying the backend, update the frontend configuration to use the new API endpoint:

```bash
# The deploy script will show the API endpoint
# Use that endpoint to update the frontend configuration
./update_frontend.sh --api-endpoint https://your-api-id.execute-api.eu-west-2.amazonaws.com/prod/analyze
```

This will:
1. Create/update `src/services/apiConfig.js` with the API endpoint
2. Create `src/services/api.js` if it doesn't exist

### 4. Update Frontend Components

Modify the React components to use the API service instead of mock data. Here's an example implementation for the HomePage component:

```javascript
// Import the API service
import api from '../services/api';

// In your handleSubmit function:
const handleSubmit = async (answers) => {
  setLoading(true);
  setError(null);
  
  try {
    // Call the API instead of using mock data
    const response = await api.analyzeTask(answers);
    
    setAnalysisId(response.id);
    setSuccess(true);
    
    // Navigate to the analysis page after a short delay
    setTimeout(() => {
      navigate(`/analysis/${response.id}`, { 
        state: { 
          analysis: response,
          answers
        } 
      });
    }, 1500);
    
  } catch (err) {
    console.error('Analysis error:', err);
    setError(err.message || 'An error occurred during analysis');
  } finally {
    setLoading(false);
  }
};
```

## Understanding the API

### API Endpoint

The API provides a single endpoint for task analysis:

- **POST /analyze**: Analyzes a task based on answers to questions

### Request Format

```json
{
  "answers": {
    "0": "Answer to question 1...",
    "1": "Answer to question 2...",
    "2": "Answer to question 3...",
    "3": "Answer to question 4...",
    "4": "Answer to question 5...",
    "5": "Answer to question 6...",
    "6": "Answer to question 7..."
  }
}
```

### Response Format

```json
{
  "id": "unique-analysis-id",
  "Classification": "AI Agent with Human Oversight (Human-in-the-Loop)",
  "Reasoning": "Detailed reasoning for the classification...",
  "Tools": [
    "Tool 1",
    "Tool 2",
    "Tool 3"
  ],
  "PotentialConsiderations": [
    "Consideration 1",
    "Consideration 2",
    "Consideration 3"
  ]
}
```

## Troubleshooting

### Common Issues

1. **Lambda deployment fails**: Ensure you have sufficient permissions and the S3 bucket exists
2. **OpenAI API calls fail**: Check the Lambda logs in CloudWatch and verify the API key is set correctly
3. **CORS errors**: Ensure the allowed origin is set correctly and matches your frontend URL

### Viewing Logs

To check the Lambda logs:

```bash
aws logs filter-log-events \
  --log-group-name /aws/lambda/AITaskLens-Analyzer \
  --region eu-west-2
```

## Security Considerations

- The OpenAI API key is stored securely in AWS Systems Manager Parameter Store
- API Gateway can be configured with authentication if needed (not included in this template)
- The Lambda function has minimal IAM permissions following the principle of least privilege

## Customization

### Using a Different Model

To use a different OpenAI model, modify the `call_reasoning_model` function in `lambda_function.py`:

```python
def call_reasoning_model(messages):
    client = get_openai_client()
    
    response = client.chat.completions.create(
        model="gpt-4o",  # Change to your preferred model
        messages=messages,
        response_format={
            "type": "json_object",
        }
    )
    
    content = response.choices[0].message.content
    return json.loads(content)
```

### Modifying the Prompt

To adjust the AI task classification logic, modify the `build_prompt` function in `lambda_function.py`.

## Author

Peter Baksh - © 2025 All Rights Reserved