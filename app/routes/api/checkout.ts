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
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "inr", // 👈 match frontend display
        product_data: { name, description, images },
        unit_amount: amount, // should be in paise (e.g. 50393066 for ₹5,03,930.66)
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url:  `http://localhost:5173/payment/success?tripId=${tripId}`,
  cancel_url: `http://localhost:5173/payment/cancel`,
  
  metadata: { tripId },
});


    return Response.json({ sessionId: session.id }); // ✅ Always JSON
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Checkout failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
