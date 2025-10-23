import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Refund Policy</h1>
          <p className="text-muted-foreground mt-2">Effective date: 01 Jan 2025</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>This policy describes how refunds are initiated, processed and credited for transactions processed via Rivafincorp. It applies to merchants integrated with Rivafincorp and their end customers.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Refunds can be initiated only for successful captures</li>
              <li>Partial refunds are permitted subject to acquirer/network rules</li>
              <li>Refund timelines vary by payment method (UPI/cards/netbanking)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Refunds are generally processed within T+1 working days by Rivafincorp. Credit to end customer depends on the issuing bank/UPI app and may take 3–7 working days.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Refund fees, if applicable, will be as per the Merchant Agreement. UPI refunds typically have no additional MDR when the original transaction had 0% UPI MDR.</p>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
