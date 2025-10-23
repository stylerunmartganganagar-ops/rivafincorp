import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground mt-2">We'd love to hear from you. Our team is available 24x7 for mission-critical incidents.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+91 90000 00000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your company" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={6} placeholder="Please describe your query in detail..." />
              </div>
              <Button className="w-full">Submit</Button>
              <p className="text-xs text-muted-foreground">By submitting, you agree to our Terms of Use and Privacy Policy.</p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Email: support@rivafincorp.in</p>
                <p>Phone: +91 80 1234 5678</p>
                <p>Hours: 9am – 8pm IST (Mon–Sat)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Registered Office</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Rivafincorp Payments Private Limited</p>
                <p>2nd Floor, Business Park</p>
                <p>Bengaluru, Karnataka, 560001</p>
                <p>CIN: U12345KA2019PTC000000</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Report an Incident</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>If you are experiencing a critical outage or security incident, please contact our on-call team:</p>
                <p>Email: incidents@rivafincorp.in</p>
                <p>We will acknowledge within 15 minutes and provide regular updates.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p><strong>Integrations:</strong> We support REST APIs, checkout UI, and webhooks. Sandbox is available on request.</p>
            <p><strong>Settlements:</strong> Standard T+1 with YES Bank. Instant/On-demand settlements available for eligible merchants.</p>
            <p><strong>Compliance:</strong> PCI DSS compliant processing and annual security audits.</p>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
