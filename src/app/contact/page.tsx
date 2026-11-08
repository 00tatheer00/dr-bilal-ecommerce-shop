import React from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="md" className="space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            <MessageSquare className="h-3.5 w-3.5 text-gold" />
            Get in Touch
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Customer Care & Studio Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Have questions about sizing, bridal customizations, or an existing order? We are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Studio Info */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6 space-y-6 text-xs text-text-secondary">
            <div>
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-3">
                Direct Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-brand shrink-0" />
                  <span>
                    WhatsApp: <a href="https://wa.me/923125880988" target="_blank" rel="noopener noreferrer" className="text-brand font-bold hover:underline">0312-5880988 (Dr. Bilal)</a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-brand shrink-0" />
                  <span>
                    Email: <strong className="text-text-primary">support@gulnaarbymk.com</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-3">
                Studio Location
              </h3>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <span>
                  Gulberg III, Near M.M. Alam Road, Lahore, Punjab, Pakistan
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-3">
                Studio Hours
              </h3>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <p>Monday – Saturday: 10:00 AM – 8:00 PM PKT</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">Sunday: Closed for artisan workshop rest</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="rounded-xl border border-border bg-bg-primary p-6 shadow-xs">
            <h3 className="font-heading font-semibold text-base text-text-primary mb-4">
              Send Us a Message
            </h3>
            <form className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Zahra"
                  className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">WhatsApp / Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you need help with..."
                  className="w-full rounded-lg border border-border bg-bg-surface px-3 py-2 text-text-primary focus:border-brand focus:outline-none"
                />
              </div>

              <Button type="button" variant="primary" size="md" fullWidth>
                Submit Message
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

