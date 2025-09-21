import type { ActionFunctionArgs } from "react-router";
import { stripe } from "~/lib/stripe";

export const action = async (args: ActionFunctionArgs) => {
    const formData = await args.request.json();
    const {
        name,
        description,
        images,
        price,
        tripId
    } = formData;
const amount = Math.round(Number(price) * 100);

if (isNaN(amount)) {
  throw new Error(`Invalid trip price: ${price}`);
}
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name,
          description,
          images: Array.isArray(images) ? images : [],
        },
        unit_amount: amount,
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `http://localhost:5173/payment/success?tripId=${tripId}`,
  cancel_url: `http://localhost:5173/payment/cancel`,
  metadata: { tripId },
});


    return {
        sessionId: session.id
    };
};
