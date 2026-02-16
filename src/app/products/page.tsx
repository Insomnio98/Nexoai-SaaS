'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const products = [
  {
    id: 1,
    name: 'AI Document Analyzer Pro',
    description: 'Advanced AI-powered document processing with OCR, summarization, and data extraction',
    price: 49.99,
    image: '📄',
    category: 'AI Tools',
    features: ['OCR Processing', 'AI Summarization', 'Data Extraction', 'Multi-language Support'],
    popular: true,
  },
  {
    id: 2,
    name: 'Automation Workflow Pack',
    description: '50+ pre-built n8n workflows for common business automation tasks',
    price: 99.99,
    image: '⚡',
    category: 'Workflows',
    features: ['50+ Workflows', 'Email Automation', 'CRM Integration', 'Slack Notifications'],
    popular: true,
  },
  {
    id: 3,
    name: 'Social Media AI Assistant',
    description: 'Generate, schedule, and optimize social media content with AI',
    price: 79.99,
    image: '📱',
    category: 'AI Tools',
    features: ['Content Generation', 'Auto-scheduling', 'Analytics', '10+ Platforms'],
    popular: false,
  },
  {
    id: 4,
    name: 'Email Campaign Builder',
    description: 'Create and send AI-optimized email campaigns with smart segmentation',
    price: 59.99,
    image: '📧',
    category: 'Marketing',
    features: ['AI Writing', 'A/B Testing', 'Segmentation', 'Analytics Dashboard'],
    popular: false,
  },
  {
    id: 5,
    name: 'Customer Support Bot',
    description: 'AI-powered chatbot for 24/7 customer support automation',
    price: 129.99,
    image: '🤖',
    category: 'AI Tools',
    features: ['24/7 Support', 'Multi-language', 'Custom Training', 'Analytics'],
    popular: true,
  },
  {
    id: 6,
    name: 'Data Sync Suite',
    description: 'Automatically sync data across all your business tools and platforms',
    price: 69.99,
    image: '🔄',
    category: 'Integration',
    features: ['100+ Integrations', 'Real-time Sync', 'Conflict Resolution', 'Data Mapping'],
    popular: false,
  },
  {
    id: 7,
    name: 'AI Content Generator',
    description: 'Generate blog posts, articles, and marketing copy with advanced AI',
    price: 89.99,
    image: '✍️',
    category: 'AI Tools',
    features: ['GPT-4 Powered', 'SEO Optimization', 'Multiple Formats', 'Plagiarism Check'],
    popular: true,
  },
  {
    id: 8,
    name: 'Lead Scoring Engine',
    description: 'Automatically score and prioritize leads using AI and behavioral data',
    price: 149.99,
    image: '🎯',
    category: 'Sales',
    features: ['AI Scoring', 'Behavioral Analysis', 'CRM Integration', 'Predictive Analytics'],
    popular: false,
  },
  {
    id: 9,
    name: 'Voice AI Transcription',
    description: 'Convert voice to text with AI-powered transcription and analysis',
    price: 39.99,
    image: '🎤',
    category: 'AI Tools',
    features: ['Real-time Transcription', 'Speaker Detection', 'Sentiment Analysis', '50+ Languages'],
    popular: false,
  },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<number[]>([]);

  const categories = ['all', 'AI Tools', 'Workflows', 'Marketing', 'Integration', 'Sales'];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productId: number) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(id => id !== productId));
  };

  const totalPrice = cart.reduce((sum, id) => {
    const product = products.find(p => p.id === id);
    return sum + (product?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold neon-text">
            Nexoai
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Dashboard
            </Link>
            <Link href="/auth/login" className="text-sm hover:text-primary">
              Sign In
            </Link>
            <div className="relative">
              <button className="glass rounded-full p-2 hover:bg-white/10">
                🛒
                {cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 grid-background opacity-20"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="neon-text float mb-6 text-6xl font-bold">
            AI Automation Marketplace
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Premium AI tools and automation workflows to supercharge your business
          </p>
          <div className="flex justify-center gap-4">
            <div className="glass rounded-2xl px-6 py-3">
              <div className="text-3xl font-bold text-primary">{products.length}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="glass rounded-2xl px-6 py-3">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="glass rounded-2xl px-6 py-3">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn-futuristic ${
                selectedCategory === category
                  ? 'scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => {
            const isInCart = cart.includes(product.id);

            return (
              <div
                key={product.id}
                className="product-card animated-border group"
              >
                {product.popular && (
                  <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">
                    🔥 Popular
                  </Badge>
                )}

                <div className="mb-4 text-6xl">{product.image}</div>

                <h3 className="mb-2 text-2xl font-bold">{product.name}</h3>

                <Badge variant="outline" className="mb-3">
                  {product.category}
                </Badge>

                <p className="mb-4 text-muted-foreground">
                  {product.description}
                </p>

                <div className="mb-4 space-y-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      ${product.price}
                    </div>
                    <div className="text-xs text-muted-foreground">one-time payment</div>
                  </div>

                  <Button
                    onClick={() => isInCart ? removeFromCart(product.id) : addToCart(product.id)}
                    className={isInCart ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {isInCart ? '✓ Added' : '🛒 Add to Cart'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 w-96 glass neon-glow rounded-2xl p-6 animate-in slide-in-from-right">
          <h3 className="mb-4 text-xl font-bold">Shopping Cart</h3>

          <div className="mb-4 space-y-3">
            {cart.map(id => {
              const product = products.find(p => p.id === id);
              if (!product) return null;

              return (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{product.image}</div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-primary">${product.price}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="mb-4 flex items-center justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <button className="btn-futuristic w-full">
              Proceed to Checkout 🚀
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mb-4 text-4xl">⚡</div>
            <h3 className="mb-2 text-xl font-bold">Instant Delivery</h3>
            <p className="text-muted-foreground">
              Get instant access to your products after purchase
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center">
            <div className="mb-4 text-4xl">🔒</div>
            <h3 className="mb-2 text-xl font-bold">Secure Payment</h3>
            <p className="text-muted-foreground">
              256-bit SSL encryption for all transactions
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="mb-2 text-xl font-bold">24/7 Support</h3>
            <p className="text-muted-foreground">
              Get help anytime with our dedicated support team
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass mt-20 border-t border-white/10 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Nexoai. All rights reserved.</p>
          <p className="mt-2">Built with AI and automation 🤖</p>
        </div>
      </footer>
    </div>
  );
}
