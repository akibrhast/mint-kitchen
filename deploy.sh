#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}   🍴 Mint Kitchen - AWS One-Click Deploy   ${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed.${NC}"
    echo ""
    echo "Please install AWS CLI first:"
    echo "  macOS:   brew install awscli"
    echo "  Linux:   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    echo ""
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo -e "${RED}❌ AWS SAM CLI is not installed.${NC}"
    echo ""
    echo "Please install SAM CLI first:"
    echo "  macOS:   brew install aws-sam-cli"
    echo "  Linux:   https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    echo ""
    exit 1
fi

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}❌ Yarn is not installed.${NC}"
    echo ""
    echo "Please install Yarn first:"
    echo "  npm install -g yarn"
    echo ""
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured.${NC}"
    echo ""
    echo "Please configure AWS credentials:"
    echo "  aws configure"
    echo ""
    echo "You'll need:"
    echo "  - AWS Access Key ID"
    echo "  - AWS Secret Access Key"
    echo "  - Default region (recommend: us-east-1)"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites installed!${NC}"
echo ""

# Parse command line arguments
DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true

if [ "$1" == "backend" ]; then
    DEPLOY_FRONTEND=false
elif [ "$1" == "frontend" ]; then
    DEPLOY_BACKEND=false
fi

# Show what will be deployed
echo -e "${BOLD}Deployment Plan:${NC}"
if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "  ${BLUE}▶${NC} Backend (Lambda + API Gateway)"
fi
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "  ${BLUE}▶${NC} Frontend (S3 + CloudFront)"
fi
echo ""

# Deploy backend
if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}  Step 1/2: Deploying Backend${NC}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    ./deploy-backend.sh
    echo ""
fi

# Deploy frontend
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}  Step 2/2: Deploying Frontend${NC}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    ./deploy-frontend.sh
    echo ""
fi

# Final summary
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  🎉 Deployment Complete!${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════${NC}"
echo ""

# Get URLs
if [ "$DEPLOY_BACKEND" = true ] || [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "${BOLD}Your Application URLs:${NC}"

    if aws cloudformation describe-stacks --stack-name mint-kitchen-backend --region us-east-1 &> /dev/null; then
        API_URL=$(aws cloudformation describe-stacks \
            --stack-name mint-kitchen-backend \
            --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
            --output text \
            --region us-east-1)
        echo -e "  ${BLUE}Backend API:${NC} $API_URL"
    fi

    if aws cloudformation describe-stacks --stack-name mint-kitchen-frontend --region us-east-1 &> /dev/null; then
        CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
            --stack-name mint-kitchen-frontend \
            --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
            --output text \
            --region us-east-1)
        echo -e "  ${BLUE}Frontend URL:${NC} https://$CLOUDFRONT_URL"
    fi

    echo ""
fi

echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "  1. Test your API health check"
echo "  2. Visit your frontend URL"
echo "  3. Test placing an order"
echo ""
echo -e "${YELLOW}📊 Monitoring:${NC}"
echo "  - Lambda logs: aws logs tail /aws/lambda/mint-kitchen-api --follow"
echo "  - CloudWatch: https://console.aws.amazon.com/cloudwatch"
echo ""
echo -e "${YELLOW}💰 Estimated Cost: ~\$0.50 - \$1.00/month${NC}"
echo ""
echo -e "${GREEN}Happy cooking! 🍳${NC}"
echo ""
