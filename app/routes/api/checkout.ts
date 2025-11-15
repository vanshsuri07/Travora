import type { ActionFunctionArgs } from "react-router";
import { stripe } from "~/lib/stripe";

export const action = async (args: ActionFunctionArgs) => {
  try {
    const formData = await args.request.json();
    const { name, description, images, price, tripId } = formData;

    const amount = Math.round(
      Number(price.toString().replace(/[^0-9.]/g, "")) * 100
    );

    if (isNaN(amount)) {
      throw new Error(`Invalid price: ${price}`);
    }

    // ✅ Get the base URL from the request
    const url = new URL(args.request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    // Or use origin directly
    // const baseUrl = url.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name, description, images },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment/success?tripId=${tripId}`,
      cancel_url: `${baseUrl}/payment/cancel`,
      metadata: { tripId },
    });

    return Response.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Checkout failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
