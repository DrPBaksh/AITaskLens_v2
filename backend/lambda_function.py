import os
import json
import boto3
from openai import OpenAI

# Initialize SSM client to get OpenAI API key from Parameter Store
ssm = boto3.client('ssm')

def get_openai_api_key():
    parameter_name = os.environ['SSM_PARAMETER_NAME']
    response = ssm.get_parameter(
        Name=parameter_name,
        WithDecryption=True
    )
    return response['Parameter']['Value']

# Initialize OpenAI client (lazy initialization to avoid cold start penalty)
openai_client = None

def get_openai_client():
    global openai_client
    if openai_client is None:
        openai_client = OpenAI(api_key=get_openai_api_key())
    return openai_client

# Define the questions that are used in the front-end
QUESTIONS = [
    "1. Please describe the task you'd like to evaluate: what it is, who currently performs it, how often it's done, and what the primary goal or outcome is.",
    "2. What kinds of judgments or creative/empathetic decisions are required? Are there situations where a template or set of fixed rules wouldn't suffice?",
    "3. Roughly how many times per day/week/month does this task occur, and how much of it follows the same pattern versus unique cases?",
    "4. What structured data (e.g. customer records, product catalogs, past logs) is available to inform or automate parts of this task?",
    "5. What risks or consequences would arise if the task were done incorrectly, and what regulations or confidentiality concerns (e.g. GDPR, HIPAA) apply?",
    "6. How time-sensitive is completion or response, and how much would you need to scale this task if volume doubled or tripled?",
    "7. To what extent do stakeholders (customers, employees, regulators) expect a genuine human interaction or oversight, versus accepting an automated or AI-driven approach?"
]

# JSON Schema for structured output
SCHEMA = {
    "type": "object",
    "properties": {
        "Classification": {"type": "string"},
        "Reasoning": {"type": "string"},
        "Tools": {"type": ["array", "string"], "items": {"type": "string"}},
        "PotentialConsiderations": {"type": ["array", "string"], "items": {"type": "string"}}
    },
    "required": ["Classification", "Reasoning", "Tools", "PotentialConsiderations"],
    "additionalProperties": False
}

def build_prompt(answers):
    system_msg = """You are an AI reasoning assistant. Classify the task into one of the following categories exactly, and provide structured output adhering to the provided JSON schema.

🧩 Refined Categories of Business Tasks:

1. Fully Automated (Rules-Based)
2. Fully Automated (AI-Based)
3. AI Agent with Human Oversight (Human-in-the-Loop)
4. Human-Driven with AI Assistance
5. Generative AI Task (Human-Directed Prompting)
6. Human-Only
"""
    
    user_content = "".join([f"\n{q}\n{a}" for q, a in answers.items()])
    user_msg = (
        f"{user_content}\n\nRespond strictly with a JSON object matching the schema: "
        "Classification (string), Reasoning (string), Tools (array of strings or single string), "
        "PotentialConsiderations (array of strings or single string)."
    )
    
    return [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_msg}
    ]

def call_reasoning_model(messages):
    client = get_openai_client()
    
    response = client.chat.completions.create(
        model="gpt-4o",  # Using gpt-4o as default model
        messages=messages,
        response_format={
            "type": "json_object",
        }
    )
    
    content = response.choices[0].message.content
    return json.loads(content)

def lambda_handler(event, context):
    # Set up CORS headers for all responses
    headers = {
        'Access-Control-Allow-Origin': os.environ.get('ALLOWED_ORIGIN', '*'),
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    }
    
    # Handle preflight OPTIONS request
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('Preflight request successful')
        }
    
    try:
        # Parse request body
        body = json.loads(event['body'])
        answers = body.get('answers', {})
        
        # Validate input
        if not answers:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'No answers provided'})
            }
        
        # Build prompt and call OpenAI
        messages = build_prompt(answers)
        result = call_reasoning_model(messages)
        
        # Create response with unique ID
        response = {
            'id': context.aws_request_id,
            **result
        }
        
        # Return successful response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response)
        }
        
    except Exception as e:
        # Handle errors
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
