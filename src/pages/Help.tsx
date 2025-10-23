import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, Phone, Mail, Book, HelpCircle, FileText, AlertTriangle, Bot, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const Help = () => {
  const [activeTab, setActiveTab] = useState('help');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user'|'bot', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('kyc_status, email, name')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const isKycApproved = user?.kyc_status === 'approved';

  const handleSubmit = async () => {
    if (!isKycApproved) {
      toast({
        title: 'KYC Required',
        description: 'Please complete your KYC verification to access support.',
        variant: 'destructive',
      });
      return;
    }

    if (!subject.trim() || !description.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: authUser?.id,
          subject: subject.trim(),
          category: category || 'General',
          description: description.trim(),
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: 'Support Ticket Created',
        description: 'Our team will get back to you within 24 hours.',
      });

      // Reset form
      setSubject('');
      setCategory('');
      setDescription('');
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to create support ticket. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSendEmail = () => {
    if (!isKycApproved) {
      toast({
        title: 'KYC Required',
        description: 'Please complete your KYC verification to access support.',
        variant: 'destructive',
      });
      return;
    }

    const emailSubject = encodeURIComponent('Support Request');
    const emailBody = encodeURIComponent(`Hello Support Team,\n\nI need assistance with my Rivafincorp account.\n\nUser ID: ${authUser?.id}\nEmail: ${user?.email}\n\nPlease describe your issue here...\n\nBest regards,\n${user?.name || 'User'}`);
    
    window.open(`mailto:support@paygateway.com?subject=${emailSubject}&body=${emailBody}`);
  };

  const handleStartChat = () => {
    if (!isKycApproved) {
      toast({
        title: 'KYC Required',
        description: 'Please complete your KYC verification to access live chat.',
        variant: 'destructive',
      });
      return;
    }

    setIsChatOpen(true);
    setChatMessages([
      { type: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
    ]);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simple chatbot responses based on keywords
    const input = chatInput.toLowerCase();
    let botResponse = '';

    if (input.includes('settlement') || input.includes('payout')) {
      botResponse = 'For settlements and payouts, please navigate to the Settlements page in your dashboard. You can initiate instant settlements or schedule regular payouts. Processing typically takes 1-2 business days.';
    } else if (input.includes('transaction') || input.includes('payment')) {
      botResponse = 'You can view all your transactions on the Transactions page. Each transaction shows the status, amount, and any applicable fees. Let me know if you need help with a specific transaction.';
    } else if (input.includes('fee') || input.includes('charge')) {
      botResponse = 'Our fee structure is: UPI - 2%, Cards - 2%, Net Banking - 2%. There are no setup fees or monthly charges. For high-volume merchants, we offer discounted rates.';
    } else if (input.includes('kyc') || input.includes('verification')) {
      botResponse = 'KYC verification is required to access all features. Please visit the Settings page and complete your KYC application. Our team reviews applications within 24-48 hours.';
    } else if (input.includes('refund')) {
      botResponse = 'To initiate a refund, go to the transaction details and click "Initiate Refund". Refunds are processed within 5-7 business days depending on your customer\'s bank.';
    } else if (input.includes('support') || input.includes('help')) {
      botResponse = 'I can help with basic questions about payments, settlements, and transactions. For complex issues, please create a support ticket using the form below.';
    } else {
      botResponse = 'I\'m here to help with questions about payments, settlements, transactions, and general account management. For more specific assistance, please create a support ticket.';
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    }, 1000);
  };

  const handleQuickResource = (resource: string) => {
    if (!isKycApproved) {
      toast({
        title: 'KYC Required',
        description: 'Please complete your KYC verification to access resources.',
        variant: 'destructive',
      });
      return;
    }

    const resourceUrls: Record<string, string> = {
      'API Documentation': 'https://docs.paygateway.com/api',
      'Integration Guides': 'https://docs.paygateway.com/integration',
      'Developer Resources': 'https://docs.paygateway.com/developers',
      'Video Tutorials': 'https://docs.paygateway.com/tutorials',
      'Best Practices': 'https://docs.paygateway.com/best-practices',
      'Compliance Guidelines': 'https://docs.paygateway.com/compliance'
    };

    const url = resourceUrls[resource];
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: 'Coming Soon',
        description: `${resource} will be available soon.`,
      });
    }
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
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">AI Chat Assistant</h3>
                <p className="text-sm text-muted-foreground">Get instant answers to common questions</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={handleStartChat}
                  disabled={!isKycApproved && !loading}
                >
                  {!isKycApproved && !loading ? 'KYC Required' : 'Start Chat'}
                </Button>
                {!isKycApproved && !loading && (
                  <p className="text-xs text-destructive mt-1">Complete KYC to access chat</p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">+91 1800 123 4567</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  disabled={!isKycApproved && !loading}
                  onClick={() => {
                    if (!isKycApproved) {
                      toast({
                        title: 'KYC Required',
                        description: 'Please complete your KYC verification to access phone support.',
                        variant: 'destructive',
                      });
                      return;
                    }
                    window.open('tel:+9118001234567');
                  }}
                >
                  {!isKycApproved && !loading ? 'KYC Required' : 'Call Now'}
                </Button>
                {!isKycApproved && !loading && (
                  <p className="text-xs text-destructive mt-1">Complete KYC to access phone support</p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@paygateway.com</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={handleSendEmail}
                  disabled={!isKycApproved && !loading}
                >
                  {!isKycApproved && !loading ? 'KYC Required' : 'Send Email'}
                </Button>
                {!isKycApproved && !loading && (
                  <p className="text-xs text-destructive mt-1">Complete KYC to send emails</p>
                )}
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
                {!isKycApproved && !loading && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">Complete KYC verification to create support tickets</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    placeholder="Brief description of your issue" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={!isKycApproved}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!isKycApproved}
                  >
                    <option value="">Select category</option>
                    <option value="Transactions">Transactions</option>
                    <option value="Settlements">Settlements</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Account & Billing">Account & Billing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide detailed information about your issue..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!isKycApproved}
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={!isKycApproved || !subject.trim() || !description.trim()}
                >
                  Submit Ticket
                </Button>
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
                {!isKycApproved && !loading && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">Complete KYC to access resources</p>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickResource('API Documentation')}
                  disabled={!isKycApproved}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  API Documentation
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickResource('Integration Guides')}
                  disabled={!isKycApproved}
                >
                  <Book className="h-4 w-4 mr-2" />
                  Integration Guides
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickResource('Developer Resources')}
                  disabled={!isKycApproved}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Developer Resources
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickResource('Video Tutorials')}
                  disabled={!isKycApproved}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickResource('Best Practices')}
                  disabled={!isKycApproved}
                >
                  <Book className="h-4 w-4 mr-2" />
                  Best Practices
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickResource('Compliance Guidelines')}
                  disabled={!isKycApproved}
                >
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

        {/* AI Chat Dialog */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="max-w-md h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Support Assistant
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background border'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 p-4 border-t">
              <Input
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Help;
