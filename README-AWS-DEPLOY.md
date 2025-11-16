# AWS One-Click Deployment Guide

Deploy Mint Kitchen to AWS with serverless architecture for **~$0.50-$1.00/month**.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                             │
│                                                              │
│  ┌──────────────────┐         ┌─────────────────────────┐   │
│  │  S3 + CloudFront │         │  Lambda + API Gateway   │   │
│  │  (Frontend)      │────────▶│  (Backend)              │   │
│  │                  │         │                         │   │
│  │  React SPA       │         │  FastAPI + Mangum       │   │
│  │  Static Files    │         │  Square Integration     │   │
│  └──────────────────┘         └─────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Frontend:**
- S3 bucket for static file hosting
- CloudFront CDN for SSL + global distribution
- Cost: ~$0.50/month

**Backend:**
- Lambda function (FastAPI with Mangum adapter)
- API Gateway for REST endpoints
- Cost: ~$0.01/month (well within free tier)

## Prerequisites

### 1. Install AWS CLI

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Verify:**
```bash
aws --version
```

### 2. Install AWS SAM CLI

**macOS:**
```bash
brew install aws-sam-cli
```

**Linux:**
```bash
wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install
```

**Verify:**
```bash
sam --version
```

### 3. Install Yarn (if not already installed)

```bash
npm install -g yarn
```

### 4. Configure AWS Credentials

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Get from AWS Console → IAM → Users → Security Credentials
- **AWS Secret Access Key**: Same place
- **Default region**: `us-east-1` (recommended)
- **Default output format**: `json`

**Verify:**
```bash
aws sts get-caller-identity
```

## Quick Start (One Command)

```bash
./deploy.sh
```

That's it! The script will:
1. Deploy backend (Lambda + API Gateway)
2. Deploy frontend (S3 + CloudFront)
3. Output your live URLs

⏱️ **First deployment takes ~8-12 minutes** (CloudFront setup)
⏱️ **Subsequent deployments: ~2-3 minutes**

## Step-by-Step Deployment

### Deploy Backend Only

```bash
./deploy-backend.sh
```

This will:
- Build Lambda function with dependencies
- Create API Gateway
- Set up environment variables
- Deploy to AWS
- Output API URL

**Verify Backend:**
```bash
curl https://YOUR-API-URL.execute-api.us-east-1.amazonaws.com/prod/
```

### Deploy Frontend Only

```bash
./deploy-frontend.sh
```

This will:
- Create S3 bucket + CloudFront distribution (first time only)
- Build React app with production API URL
- Upload to S3
- Invalidate CloudFront cache
- Output CloudFront URL

**Verify Frontend:**
Visit `https://YOUR-CLOUDFRONT-URL.cloudfront.net`

## Environment Configuration

### Backend Configuration

The deployment uses your existing `.env` files:

**`backend/.env`:**
```env
SQUARE_ACCESS_TOKEN_SANDBOX=your_sandbox_token
SQUARE_ACCESS_TOKEN_PRODUCTION=your_production_token
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=your_location_id
```

These values are automatically passed to Lambda during deployment.

### Frontend Configuration

**`.env`:**
```env
VITE_SQUARE_APPLICATION_ID=your_square_app_id
VITE_SQUARE_LOCATION_ID=your_location_id
```

The API URL is automatically set to your deployed Lambda function.

## Updating Your Deployment

### Update Backend Code

```bash
# Make changes to backend/main.py
./deploy.sh backend
```

### Update Frontend Code

```bash
# Make changes to src/
./deploy.sh frontend
```

### Update Everything

```bash
./deploy.sh
```

## Monitoring & Debugging

### View Lambda Logs

```bash
aws logs tail /aws/lambda/mint-kitchen-api --follow
```

### View CloudWatch Logs

```bash
sam logs --stack-name mint-kitchen-backend --tail
```

### Check Deployment Status

**Backend:**
```bash
aws cloudformation describe-stacks --stack-name mint-kitchen-backend
```

**Frontend:**
```bash
aws cloudformation describe-stacks --stack-name mint-kitchen-frontend
```

### Test API Endpoints

```bash
# Health check
curl https://YOUR-API-URL/prod/

# Get menu
curl https://YOUR-API-URL/prod/api/menu

# Get categories
curl https://YOUR-API-URL/prod/api/categories
```

## Cost Breakdown

Based on 500 orders/month (Thu-Fri-Sat operation):

| Service | Usage | Cost |
|---------|-------|------|
| **Lambda** | 4,000 requests × 300ms | $0.00 (free tier) |
| **API Gateway** | 4,000 requests | $0.01 |
| **S3** | 50MB storage + 4,000 requests | $0.02 |
| **CloudFront** | 10GB transfer + 4,000 requests | $0.89 |
| **Total** | | **~$0.92/month** |

**Free Tier Coverage:**
- Lambda: 1M requests/month free (you use 4,000)
- API Gateway: 1M requests/month free for 12 months
- S3: 5GB storage + 20,000 GET requests free for 12 months

## Scaling

Your serverless setup automatically scales:

- **500 orders/month**: ~$0.92/month
- **5,000 orders/month**: ~$2.50/month
- **50,000 orders/month**: ~$15/month

No manual scaling needed!

## Cleanup (Delete Everything)

**Delete Frontend:**
```bash
# Empty S3 bucket first
aws s3 rm s3://YOUR-BUCKET-NAME --recursive

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name mint-kitchen-frontend
```

**Delete Backend:**
```bash
aws cloudformation delete-stack --stack-name mint-kitchen-backend
```

**Delete SAM artifacts:**
```bash
rm -rf .aws-sam/
```

## Troubleshooting

### Issue: "Stack already exists"

The deployment scripts handle updates automatically. If you see this error, just run the script again.

### Issue: "Unable to locate credentials"

```bash
aws configure
```

### Issue: "SAM CLI not found"

Install SAM CLI (see Prerequisites above)

### Issue: CloudFront changes not visible

CloudFront caching takes 5-15 minutes to propagate globally. Wait a bit, or force invalidation:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR-DISTRIBUTION-ID \
  --paths "/*"
```

### Issue: CORS errors in browser

The backend automatically allows all origins when running in Lambda. If you see CORS errors:

1. Check that backend is deployed
2. Verify frontend is using correct API URL
3. Check browser console for exact error

### Issue: Lambda timeout

Default timeout is 30 seconds. For slow Square API calls, increase in `template.yaml`:

```yaml
Globals:
  Function:
    Timeout: 60  # Increase to 60 seconds
```

Then redeploy: `./deploy-backend.sh`

## Custom Domain Setup

### Using Your Own Domain

1. **Get SSL certificate in AWS Certificate Manager:**
   ```bash
   aws acm request-certificate \
     --domain-name example.com \
     --validation-method DNS
   ```

2. **Update CloudFront distribution** with custom domain

3. **Update DNS** to point to CloudFront

(Detailed instructions: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html)

## Comparison with Container Deployment

| Aspect | Serverless (Current) | Lightsail Container |
|--------|---------------------|---------------------|
| **Cost** | ~$0.92/month | ~$7/month |
| **Scaling** | Automatic | Manual |
| **Cold Start** | ~500ms | None |
| **Maintenance** | None | Manual updates |
| **Best For** | Low/variable traffic | Consistent traffic |

For your use case (500 orders/month, 3 days/week), **serverless is ideal**.

## Support

**AWS Documentation:**
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/)
- [Lambda](https://docs.aws.amazon.com/lambda/)
- [CloudFront](https://docs.aws.amazon.com/cloudfront/)

**Common Commands:**
```bash
# View all stacks
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE

# Get API URL
aws cloudformation describe-stacks \
  --stack-name mint-kitchen-backend \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text

# Get CloudFront URL
aws cloudformation describe-stacks \
  --stack-name mint-kitchen-frontend \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text
```

## Development Workflow

**Local Development (No Changes):**
```bash
docker-compose up
```

**Deploy to Synology (Staging):**
- Your existing workflow remains the same

**Deploy to AWS (Production):**
```bash
./deploy.sh
```

All three environments can coexist!

---

## Next Steps

1. ✅ Run `./deploy.sh`
2. ✅ Test your live app
3. ✅ Update Square to use production tokens
4. ✅ (Optional) Set up custom domain
5. ✅ Monitor costs in AWS Cost Explorer

**Questions?** Check the Troubleshooting section above.

Happy deploying! 🚀
