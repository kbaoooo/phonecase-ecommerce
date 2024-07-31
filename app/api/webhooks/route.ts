import { db } from "@/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import stripe, { Stripe } from "stripe";
import { Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";

const resend = new Resend(process.env.STRIPE_SECRET_KEY)

export async function POST(req: Request){
    try {
        const body = await req.text();
        const signature = headers().get('stripe-signature'); 

        if(!signature) {
            throw new Response('No signature', {status: 400});
        }

        const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

        if(event.type === 'checkout.session.completed') {
            if(!event.data.object.customer_details?.email) {
                throw new Response('Missing user email', {status: 400});
            }

            const session = event.data.object as Stripe.Checkout.Session;

            const { userId, orderId } = session.metadata || {
                userId: null,
                orderId: null,
            };

            if(!userId || !orderId) {
                throw new Response('Missing metadata', {status: 400});
            }

            const billingAddress = session.customer_details?.address;
            const shippingAddress = session.shipping_details?.address;

            if(!billingAddress || !shippingAddress) {
                throw new Response('Missing address', {status: 400});
            }

            await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    billingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postal_code!,
                            street: billingAddress!.line1!,
                            state: billingAddress!.state!,
                        },
                    },
                    shippingAddress: {
                        create: {
                            name: session.shipping_details!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postal_code!,
                            street: shippingAddress!.line1!,
                            state: shippingAddress!.state!,
                        },
                    },
                },
            });

            await resend.emails.send({
                from: 'CaseCobra <kbao122003@gmail.com>',
                to: [event.data.object.customer_details.email],
                subject: 'Thanks for your order!',
                react: OrderReceivedEmail({
                    orderId,
                    orderDate: new Date().toLocaleDateString(),
                    // @ts-ignore
                    shippingAddress: {
                        name: session.shipping_details!.name!,
                        city: shippingAddress.city!,
                        country: shippingAddress.country!,
                        postalCode: shippingAddress.postal_code!,
                        street: shippingAddress.line1!,
                        state: shippingAddress.state!,
                    },
                }),
            });
        }

        return NextResponse.json({
            ok: true,
            result: event,
        })
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            message: "Something went wrong",
            ok: false,
            status: 500,
        })
    }
}