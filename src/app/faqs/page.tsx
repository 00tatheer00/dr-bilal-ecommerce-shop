import React from 'react';
import Container from '@/components/ui/Container';
import { HelpCircle } from 'lucide-react';

export default function FAQsPage() {
  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'We offer nationwide Cash on Delivery across Pakistan. You do not need a credit card or advance transfer. Simply place your order with your delivery address, and pay the courier rider in cash when they deliver your parcel to your doorstep.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders are prepared and handed over to our express courier partner within 24 hours. Delivery typically takes 2–3 business days for major metropolitan hubs (Lahore, Karachi, Islamabad, Rawalpindi) and 3–5 business days for other cities.',
    },
    {
      q: 'What are the delivery charges?',
      a: 'We charge a flat delivery fee of PKR 250 across all destinations in Pakistan. Delivery is completely FREE on all orders with a subtotal of PKR 5,000 or more.',
    },
    {
      q: 'What if the bangles do not fit my wrists?',
      a: 'We offer an easy 3-day size exchange guarantee! If you find the bangles too tight or loose upon trying them, contact our WhatsApp support within 3 days of delivery and we will arrange a replacement size for you.',
    },
    {
      q: 'How do I know my bangle size before ordering?',
      a: 'Please refer to our Bangle Size Guide page. You can measure the inner diameter of any bangle you currently wear, or measure the circumference of your hand across the knuckles with a tape measure.',
    },
    {
      q: 'Are GULNAAR bangles made from real gold?',
      a: 'Our bangles are crafted with a solid brass foundation and finished with 24K micron gold electroplating, authentic Kundan foil-backed stones, natural seed pearls, and hand-painted Meenakari enamel. They offer the weight and radiance of high jewellery at an accessible price.',
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <HelpCircle className="h-3.5 w-3.5 text-gold" />
            Clear Answers
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Everything you need to know about placing an order, sizing, delivery, and payments.
          </p>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border bg-bg-primary p-6 shadow-xs space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="pt-4 first:pt-0">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-2">
                {faq.q}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

