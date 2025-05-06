import os
import json
import time
import jwt
from datetime import datetime, timedelta

# Get environment variables
AUTH_PASSWORD = os.environ.get('AUTH_PASSWORD', 'CorndelTaskLensSLT')  # Default password as fallback
JWT_SECRET = os.environ.get('JWT_SECRET', 'default-jwt-secret')

def generate_token(expiration_hours=24):
    """Generate a JWT token that expires in the specified hours."""
    payload = {
        'exp': datetime.utcnow() + timedelta(hours=expiration_hours),
        'iat': datetime.utcnow(),
        'sub': 'ai-task-lens-user'
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def lambda_handler(event, context):
    # Add CORS headers - ensuring all origins are allowed with '*'
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Requested-With',
        'Content-Type': 'application/json'
    }
    
    # Log the event for debugging
    print(f"Event: {json.dumps(event)}")
    
    # Handle OPTIONS request (preflight)
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS preflight response'})
        }
    
    try:
        # Parse the request body
        body = json.loads(event.get('body', '{}'))
        password = body.get('password', '')
        
        # Log the password attempt (without revealing the actual password)
        print(f"Password attempt received (length: {len(password)})")
        
        # Validate password
        if password == AUTH_PASSWORD:
            # Generate JWT token
            token = generate_token()
            
            print("Authentication successful, token generated")
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'message': 'Authentication successful'
                })
            }
        else:
            print("Authentication failed: incorrect password")
            
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Invalid password'
                })
            }
    except Exception as e:
        print(f"Error during authentication: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Server error: {str(e)}'
            })
        }