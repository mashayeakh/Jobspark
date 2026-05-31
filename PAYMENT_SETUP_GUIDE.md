# Payment Module Setup Guide

## Overview

This guide explains the changes made to fix your payment module and how to complete the setup.

## What Was Done

### 1. **Created Payment Module** (`jobspark-server/src/app/module/payment/`)

- **payment.service.ts**: Complete payment service with Stripe integration
- **payment.controller.ts**: Controllers for checkout sessions and webhooks
- **payment.route.ts**: Express routes for payment endpoints

### 2. **Updated Database Schema**

- Added new enums: `PaymentStatus`, `SubscriptionType`
- Added `PENDING` status to `SubscriptionStatus` enum
- Created `Payment` and `Subscription` models in `billing.prisma`
- Updated `RecruiterProfile` model to include subscriptions relation
- Updated `User` model to include payments and subscriptions relations

### 3. **Updated Routes**

- Registered PaymentRouter in `/app/module/index.ts`
- Added payment endpoints to express app

### 4. **Updated Frontend**

- Changed checkout API call from `/subscription/create-checkout-session` to `/payment/create-checkout-session`
- Improved error handling and user feedback

### 5. **Fixed Webhook Handling**

- Updated app.ts to handle webhooks with raw body before JSON parsing
- Added PaymentController.webhook handler

## Required Setup Steps

### Step 1: Generate Prisma Client

Run this command in `jobspark-server` directory:

```bash
npm run build
# or
npx prisma generate
```

### Step 2: Create Database Migration

Create a migration for the new schema:

```bash
cd jobspark-server
npx prisma migrate dev --name add_payment_subscription_models
```

If you prefer to skip migrations and sync directly with the database:

```bash
npx prisma db push
```

### Step 3: Restart Your Backend Server

```bash
npm run dev
```

## API Endpoints

### Create Checkout Session

- **URL**: `POST /api/v2/payment/create-checkout-session`
- **Authentication**: Required (Recruiter role)
- **Body**: `{ type?: "MONTHLY" | "YEARLY" }`
- **Response**:

```json
{
  "success": true,
  "message": "Checkout session created",
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "paymentId": "pay_...",
    "subscriptionId": "sub_...",
    "sessionId": "cs_..."
  }
}
```

### Verify Checkout Session

- **URL**: `POST /api/v2/payment/verify-checkout-session`
- **Authentication**: Required (Recruiter role)
- **Body**: `{ sessionId: "..." }`
- **Response**:

```json
{
  "success": true,
  "message": "Payment verified. Subscription activated.",
  "data": {
    "message": "Payment verified. Subscription activated."
  }
}
```

### Stripe Webhook

- **URL**: `POST /webhook` or `POST /payment/webhook`
- **Events Handled**:
  - `checkout.session.completed`: Activates subscription
  - `checkout.session.expired`: Marks payment as failed

## Key Features

1. **Robust Error Handling**: Service handles missing tables gracefully with `.catch()` statements
2. **Transaction Support**: Uses Prisma transactions for payment creation
3. **Webhook Idempotency**: Prevents duplicate webhook processing
4. **Recruiter Profile Updates**: Automatically updates recruiter subscription status
5. **Session Metadata**: Stores userId, recruiterId, subscriptionId for traceability

## Environment Variables Required

Make sure these are in your `.env` file:

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

## Testing the Integration

### 1. Test Checkout Session Creation

```bash
curl -X POST http://localhost:5000/api/v2/payment/create-checkout-session \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 2. Test Webhook (Stripe CLI)

```bash
stripe listen --forward-to localhost:5000/webhook
stripe trigger checkout.session.completed
```

### 3. Test via Frontend

- Navigate to the recruiter pricing page
- Click "Start Subscribing" button
- You should be redirected to Stripe checkout

## Troubleshooting

### "Failed to start checkout process" Error

1. Check browser console for detailed error message
2. Verify recruiter profile exists for the user
3. Check server logs for PaymentService errors
4. Ensure Stripe keys are correctly set in environment

### Database Migration Issues

```bash
# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Or sync schema without reset
npx prisma db push --force-reset
```

### Webhook Not Processing

1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check server logs for webhook errors
3. Ensure raw body middleware is before JSON middleware in app.ts

## File Structure

```
jobspark-server/
├── src/app/module/
│   ├── payment/
│   │   ├── payment.service.ts
│   │   ├── payment.controller.ts
│   │   └── payment.route.ts
│   └── index.ts (updated)
├── prisma/schema/
│   ├── billing.prisma (updated)
│   ├── profiles.prisma (updated)
│   ├── enums.prisma (updated)
│   └── auth.prisma (already had relations)
└── src/app.ts (updated)

jobspark-frontend/
└── src/app/recruiter/page.tsx (updated)
```

## Next Steps

1. Run the database migration
2. Restart the backend server
3. Test the payment flow in your browser
4. Monitor Stripe dashboard for successful transactions
5. Set up webhook signing with Stripe CLI for local testing

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Prisma Client Documentation](https://www.prisma.io/docs/client)
