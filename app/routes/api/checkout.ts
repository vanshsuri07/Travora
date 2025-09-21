import { ActionFunctionArgs } from "react-router";
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

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name,
                        description,
                        images,
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/payment/success?tripId=${tripId}`,
        cancel_url: `http://localhost:3000/payment/cancel`,
        metadata: {
            tripId,
        },
    });

    return {
        sessionId: session.id
    };
};
