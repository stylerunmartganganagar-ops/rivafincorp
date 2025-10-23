import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, Phone, Mail, Book, HelpCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Help = () => {
  const [activeTab, setActiveTab] = useState('help');
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: 'Support Ticket Created',
      description: 'Our team will get back to you within 24 hours.'
    });
  };

  const faqs = [
    {
      question: 'How do I initiate a settlement?',
      answer: 'Navigate to the Settlements page and click on the "Settle Now" button. Your pending balance will be processed and transferred to your registered bank account within 1-2 business days.'
    },
    {
      question: 'What are the transaction fees?',
      answer: 'Transaction fees vary based on payment method: UPI - 2%, Cards - 2%, Net Banking - 2%. There are no setup fees or monthly charges.'
    },
    {
      question: 'How long does it take for settlements to reach my account?',
      answer: 'Standard settlements take T+2 days. For instant settlements using the "Settle Now" feature, funds are transferred within 30 minutes to 2 hours.'
    },
    {
      question: 'How do I handle refunds?',
      answer: 'Go to the transaction details page and click on "Initiate Refund". The refund will be processed within 5-7 business days depending on the customer\'s bank.'
    },
    {
      question: 'Can I customize my payment page?',
      answer: 'Yes! Navigate to Settings > Payment Methods to customize your payment page with your brand colors, logo, and preferred payment options.'
    },
    {
      question: 'How secure is the payment gateway?',
      answer: 'We use industry-standard encryption (256-bit SSL) and are PCI DSS Level 1 compliant. All sensitive data is encrypted and tokenized for maximum security.'
    },
    {
      question: 'What happens if a transaction fails?',
      answer: 'Failed transactions are automatically refunded to the customer within 5-7 business days. You can view all failed transactions in the Transactions page with detailed failure reasons.'
    },
    {
      question: 'How do I generate reports?',
      answer: 'Visit the Reports page where you can generate various reports including transaction summaries, settlement reports, and tax reports. Reports can be scheduled or downloaded on-demand.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
            <p className="text-muted-foreground">Get help and find answers to common questions</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Chat with our support team</p>
                <Button variant="outline" className="mt-2">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">+91 1800 123 4567</p>
                <Button variant="outline" className="mt-2">Call Now</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@paygateway.com</p>
                <Button variant="outline" className="mt-2">Send Email</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Create Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Transactions</option>
                    <option>Settlements</option>
                    <option>Technical Issue</option>
                    <option>Account & Billing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide detailed information about your issue..."
                    rows={5}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">Submit Ticket</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Quick Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  API Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Integration Guides
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Developer Resources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Best Practices
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Compliance Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Help;
