// Create this file: routes/webhook.tsx
import type { ActionFunctionArgs } from "react-router";
import { stripe } from "~/lib/stripe";
import { createBooking } from "~/appwrite/trips";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return new Response("No signature", { status: 400 });
    }

    let event;
    try {
      // Verify webhook signature (you'll need to set STRIPE_WEBHOOK_SECRET)
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log("Webhook received:", event.type);

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      
      console.log("Checkout completed for session:", session.id);
      console.log("Trip ID from metadata:", session.metadata?.tripId);
      
      // Here you can create the booking in your database
      if (session.metadata?.tripId && session.customer_details?.email) {
        try {
          // You might need to get user by email or handle this differently
          console.log("Creating booking for trip:", session.metadata.tripId);
          // await createBooking(session.metadata.tripId, userId);
        } catch (bookingError) {
          console.error("Failed to create booking:", bookingError);
        }
      }
    }

    // Handle payment_intent.succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      console.log("Payment succeeded:", paymentIntent.id);
    }

    return new Response("OK", { status: 200 });
    
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
};