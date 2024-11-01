// pages/checkout.tsx
'use client'
// import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const Checkout = () => {
  const handleCheckout = async () => {
    // const stripe = await stripePromise;

    // 直接调用后端 API
    const response = await axios.post(`http://localhost:3000/stripe/create-checkout-session`, {
      items: [{ price: 'price_1QFFbnP7qn5M1J33y8hB8NQD', quantity: 1 }],
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
      userCode: '123456',
    });

    const { url } = response.data;


    if (url) {
      console.log('Redirecting to:', url);
      window.location.href = url;  // 重定向到 Stripe Checkout 页面
    }

    // 下面这个方法等同于window href 二选一即可 response.data 里面可以包含sessionId, 当前是用的url，如需使用sessionId 请联系后端修改
    // await stripe.redirectToCheckout({
    //   sessionId: sessionId,
    // });
  };

  return (
    <button onClick={handleCheckout}>
      Checkout
    </button>
  );
};

export default Checkout;
