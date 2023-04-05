require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.post('/payment', async (req, res) => {
    const {amount} = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: amount,
                    product_data: {
                        name: 'Payment',
                        description: 'Payment for the product',
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:5173/generate',
        cancel_url: 'http://localhost:5173/cancel',
    });
    res.json({ id: session.id });
});

app.post('/subscribe', async (req, res) => {
    const {amount} = req.body;
    // create subscription
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: amount,
                    product_data: {
                        name: 'Subscription',
                        description: 'Subscription for the product',
                    },
                    recurring: {
                        interval: 'month',
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: 'http://localhost:5173/signingup',
        cancel_url: 'http://localhost:5173/cancel',
    });
    res.json({ id: session.id });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});