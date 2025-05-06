import os
import json
import time
import uuid
import jwt
from openai import OpenAI
from pydantic import BaseModel, Field, validator
from typing import Dict, List, Union, Optional

# Verify pydantic version to ensure we're using pydantic v2+
import pydantic
print(f"Pydantic version: {pydantic.__version__}")

# Environment variables
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
JWT_SECRET = os.environ.get("JWT_SECRET", "default-jwt-secret")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Define the questions (same as in frontend)
QUESTIONS = [
    "1. Please describe the task you'd like to evaluate: what it is, who currently performs it, how often it's done, and what the primary goal or outcome is.",
    "2. What kinds of judgments or creative/empathetic decisions are required? Are there situations where a template or set of fixed rules wouldn't suffice?",
    "3. Roughly how many times per day/week/month does this task occur, and how much of it follows the same pattern versus unique cases?",
    "4. What structured data (e.g. customer records, product catalogs, past logs) is available to inform or automate parts of this task?",
    "5. What risks or consequences would arise if the task were done incorrectly, and what regulations or confidentiality concerns (e.g. GDPR, HIPAA) apply?",
    "6. How time-sensitive is completion or response, and how much would you need to scale this task if volume doubled or tripled?",
    "7. To what extent do stakeholders (customers, employees, regulators) expect a genuine human interaction or oversight, versus accepting an automated or AI-driven approach?"
]

# Define Pydantic models
class AnalysisRequest(BaseModel):
    answers: Dict[str, str] = Field(..., description="Map of question indices to answers")

class AnalysisResponse(BaseModel):
    id: str = Field(..., description="Unique identifier for the analysis")
    Classification: str = Field(..., description="Task classification category")
    Reasoning: str = Field(..., description="Reasoning behind the classification")
    Tools: Union[List[str], str] = Field(..., description="Recommended tools")
    PotentialConsiderations: Union[List[str], str] = Field(..., description="Potential considerations")

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False

def extract_token(event):
    """Extract JWT token from headers"""
    auth_header = event.get('headers', {}).get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header[7:]  # Remove 'Bearer ' prefix
    return None

def build_prompt(answers):
    """Build the prompt for OpenAI API"""
    # System message defining the task and categories
    system_msg = (
        "You are an AI reasoning assistant. Classify the task into one of the following categories exactly, and provide structured output adhering to the provided JSON schema.\n"
        "\n"
        "🧩 Refined Categories of Business Tasks:\n"
        "\n"
        "1. Fully Automated (Rules-Based)\n"
        "2. Fully Automated (AI-Based)\n"
        "3. AI Agent with Human Oversight (Human-in-the-Loop)\n"
        "4. Human-Driven with AI Assistance\n"
        "5. Generative AI Task (Human-Directed Prompting)\n"
        "6. Human-Only\n"
    )
    
    # User content with all questions and answers
    user_content = ""
    for i, question in enumerate(QUESTIONS):
        answer = answers.get(str(i), "No answer provided")
        user_content += f"\n{question}\n{answer}"
    
    # Add instructions for JSON output
    user_msg = (
        f"{user_content}\n\nRespond strictly with a JSON object matching the schema: "
        "Classification (string), Reasoning (string), Tools (array of strings or single string), "
        "PotentialConsiderations (array of strings or single string)."
    )
    
    return [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_msg}
    ]

def call_openai_model(messages):
    """Call OpenAI API with the messages"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use appropriate model based on your needs
            messages=messages,
            max_tokens=1500,
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON from response
        try:
            analysis_data = json.loads(content)
            
            # Add a unique ID for the analysis
            analysis_data["id"] = f"analysis-{uuid.uuid4()}"
            
            # Validate with Pydantic
            analysis_response = AnalysisResponse(**analysis_data)
            
            # Return the validated data
            return analysis_response.model_dump()
            
        except json.JSONDecodeError:
            raise ValueError(f"Failed to parse JSON response: {content}")
            
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")

def lambda_handler(event, context):
    # Add CORS headers - ensuring all origins are allowed with '*'
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With',
        'Content-Type': 'application/json'
    }
    
    # Log event for debugging
    print(f"Event received: {json.dumps(event)}")
    
    # Handle OPTIONS request (preflight)
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS preflight response'})
        }
    
    # For simplicity, we're skipping token validation initially
    # Uncomment this in production to enforce authentication
    """
    # Validate JWT token
    token = extract_token(event)
    if not token or not verify_token(token):
        print("Authentication failed: Invalid or missing token")
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': 'Unauthorized. Invalid or expired token.'
            })
        }
    """
    
    try:
        # Parse the request body
        body = json.loads(event.get('body', '{}'))
        
        # Validate with Pydantic
        try:
            request_data = AnalysisRequest(**body)
        except Exception as e:
            print(f"Validation error: {str(e)}")
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': f'Invalid request: {str(e)}'
                })
            }
        
        print("Request validated, calling OpenAI...")
        
        # Build prompt and call OpenAI API
        messages = build_prompt(request_data.answers)
        analysis_result = call_openai_model(messages)
        
        print(f"Analysis complete: {json.dumps(analysis_result)}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'result': analysis_result
            })
        }
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Server error: {str(e)}'
            })
        }