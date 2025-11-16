#!/bin/bash
set -e

echo "🚀 Deploying Mint Kitchen Frontend to S3 + CloudFront..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first:${NC}"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Run 'aws configure' first.${NC}"
    exit 1
fi

# Configuration
STACK_NAME="mint-kitchen-frontend"
BUCKET_NAME="mint-kitchen-frontend-$(aws sts get-caller-identity --query Account --output text)"
REGION="us-east-1"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Stack: $STACK_NAME"
echo "   Bucket: $BUCKET_NAME"
echo "   Region: $REGION"
echo ""

# Get backend API URL
echo -e "${BLUE}🔍 Looking up backend API URL...${NC}"
API_URL=$(aws cloudformation describe-stacks \
    --stack-name mint-kitchen-backend \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
    --output text \
    --region $REGION 2>/dev/null || echo "")

if [ -z "$API_URL" ]; then
    echo -e "${YELLOW}⚠️  Backend not deployed yet. Using placeholder API URL.${NC}"
    echo -e "${YELLOW}   Deploy backend first with: ./deploy-backend.sh${NC}"
    API_URL="https://example.com/api"
else
    echo -e "${GREEN}✅ Found backend API: $API_URL${NC}"
fi

# Check if infrastructure stack exists
echo -e "${BLUE}🏗️  Checking frontend infrastructure...${NC}"
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION &> /dev/null; then
    echo -e "${GREEN}✅ Infrastructure stack exists${NC}"
else
    echo -e "${YELLOW}📦 Creating frontend infrastructure (S3 + CloudFront)...${NC}"
    aws cloudformation create-stack \
        --stack-name $STACK_NAME \
        --template-body file://frontend-infrastructure.yaml \
        --parameters ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
        --region $REGION

    echo -e "${BLUE}⏳ Waiting for infrastructure creation (this takes 5-10 minutes)...${NC}"
    aws cloudformation wait stack-create-complete \
        --stack-name $STACK_NAME \
        --region $REGION

    echo -e "${GREEN}✅ Infrastructure created!${NC}"
fi

# Get bucket and CloudFront details
BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
    --output text \
    --region $REGION)

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text \
    --region $REGION)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region $REGION)

echo -e "${BLUE}🏗️  Building React app...${NC}"
# Get Square credentials from .env
if [ -f .env ]; then
    source .env
fi

# Build with API URL
VITE_API_BASE_URL="$API_URL" \
VITE_SQUARE_APPLICATION_ID="${VITE_SQUARE_APPLICATION_ID:-sandbox-sq0idb-OZLG13VvEW6P-WwdhxHeyA}" \
VITE_SQUARE_LOCATION_ID="${VITE_SQUARE_LOCATION_ID:-LXDA5KGYVPCD2}" \
yarn build

echo -e "${BLUE}☁️  Uploading to S3...${NC}"
aws s3 sync dist/ s3://$BUCKET/ \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --region $REGION

# Upload index.html separately with no cache
aws s3 cp dist/index.html s3://$BUCKET/index.html \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html" \
    --region $REGION

echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${GREEN}✅ Frontend deployment complete!${NC}"

echo ""
echo -e "${GREEN}🎉 Your app is live!${NC}"
echo -e "${BLUE}CloudFront URL:${NC} https://$CLOUDFRONT_URL"
echo -e "${BLUE}S3 Bucket:${NC} $BUCKET"
echo -e "${BLUE}Backend API:${NC} $API_URL"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   - CloudFront invalidation in progress (ID: $INVALIDATION_ID)"
echo "   - May take 5-15 minutes for changes to propagate globally"
echo "   - Test now: https://$CLOUDFRONT_URL"
echo ""
echo -e "${YELLOW}💰 Estimated monthly cost: ~\$0.50 - \$1.00${NC}"
echo ""
