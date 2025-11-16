#!/bin/bash
set -e

echo "🚀 Deploying Mint Kitchen Backend to AWS Lambda..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ AWS SAM CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

echo -e "${BLUE}📋 AWS Account Info:${NC}"
aws sts get-caller-identity

# Get Square credentials from .env file
if [ -f backend/.env ]; then
    echo -e "${BLUE}🔑 Loading Square credentials from backend/.env${NC}"
    source backend/.env
else
    echo -e "${YELLOW}⚠️  No backend/.env file found. Using default values.${NC}"
fi

# Set default values if not provided
SQUARE_ENV=${SQUARE_ENVIRONMENT:-sandbox}
SQUARE_SANDBOX_TOKEN=${SQUARE_ACCESS_TOKEN_SANDBOX:-""}
SQUARE_PROD_TOKEN=${SQUARE_ACCESS_TOKEN_PRODUCTION:-""}
SQUARE_LOC_ID=${SQUARE_LOCATION_ID:-"LXDA5KGYVPCD2"}

echo -e "${BLUE}📦 Preparing Lambda dependencies...${NC}"
# Use Lambda-specific requirements (without uvicorn, python-dotenv)
cp backend/requirements-lambda.txt backend/requirements.txt

echo -e "${BLUE}📦 Building Lambda function...${NC}"
sam build --use-container --template-file template.yaml

# Restore original requirements
git checkout backend/requirements.txt 2>/dev/null || true

echo -e "${BLUE}🚢 Deploying to AWS...${NC}"
sam deploy \
    --stack-name mint-kitchen-backend \
    --region us-east-1 \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        SquareEnvironment="$SQUARE_ENV" \
        SquareAccessTokenSandbox="$SQUARE_SANDBOX_TOKEN" \
        SquareAccessTokenProduction="$SQUARE_PROD_TOKEN" \
        SquareLocationId="$SQUARE_LOC_ID" \
    --no-confirm-changeset \
    --resolve-s3

echo -e "${GREEN}✅ Backend deployment complete!${NC}"

# Get the API URL
API_URL=$(aws cloudformation describe-stacks \
    --stack-name mint-kitchen-backend \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
    --output text \
    --region us-east-1)

echo ""
echo -e "${GREEN}🎉 Backend is live!${NC}"
echo -e "${BLUE}API URL:${NC} $API_URL"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "   1. Test the API: curl $API_URL/"
echo "   2. Update frontend VITE_API_BASE_URL to: $API_URL"
echo "   3. Deploy frontend with: ./deploy-frontend.sh"
echo ""
