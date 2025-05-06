import os
import json
from openai import OpenAI
from pydantic import BaseModel, Field

# Verify pydantic version to ensure we're using pydantic v2+ with pydantic-core
import pydantic
print(f"Pydantic version: {pydantic.__version__}")
import pydantic_core
print(f"Pydantic-core version: {pydantic_core.__version__}")

# Define a Pydantic model for the request
class AnalysisRequest(BaseModel):
    question: str = Field(..., description="The question to analyze")
    category: str = Field(..., description="The category of the question")

# Define a Pydantic model for the response
class AnalysisResponse(BaseModel):
    answer: str = Field(..., description="The answer to the question")
    confidence: float = Field(..., description="Confidence score between 0 and 1")
    
# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def lambda_handler(event, context):
    try:
        print("Event received:", json.dumps(event))
        
        # Parse the request body
        body = json.loads(event.get('body', '{}'))
        
        # Validate with Pydantic
        try:
            request_data = AnalysisRequest(**body)
        except Exception as e:
            print(f"Validation error: {str(e)}")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'Invalid request: {str(e)}'})
            }
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Question: {request_data.question}, Category: {request_data.category}"}
            ]
        )
        
        # Process the response
        answer = response.choices[0].message.content
        
        # Create and validate response with Pydantic
        analysis_response = AnalysisResponse(
            answer=answer,
            confidence=0.95  # Placeholder confidence score
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps(analysis_response.model_dump())
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }