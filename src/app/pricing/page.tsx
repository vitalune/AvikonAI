import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        '5 images per month',
        'Basic styles only',
        'Standard resolution',
        'Community support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      description: 'Best for individuals',
      features: [
        '100 images per month',
        'All style presets',
        'High resolution downloads',
        'Priority generation',
        'Email support',
        'Advanced editing tools'
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Business',
      price: '$29.99',
      description: 'For teams and businesses',
      features: [
        'Unlimited images',
        'Custom style training',
        '4K resolution downloads',
        'API access',
        'Team collaboration',
        'Priority support',
        'Commercial license'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core AI generation features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  asChild
                >
                  <Link href="/generate">
                    {plan.popular && <Sparkles className="w-4 h-4 mr-2" />}
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer a 14-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for business plans.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! The Pro plan comes with a 7-day free trial. No credit card required to start.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}