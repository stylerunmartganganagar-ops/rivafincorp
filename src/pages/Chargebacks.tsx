import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function Chargebacks() {
  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Chargebacks & Refunds</h1>
          <p className="text-muted-foreground mt-2">Effective date: 01 Jan 2025</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Chargebacks are initiated by the issuing bank/card network at the customers request. Rivafincorp provides workflows to manage disputes, submit evidence and track outcomes.</p>
            <p>Refunds are merchant-initiated reversals for completed transactions. See our Refund Policy for timelines and eligibility.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispute Lifecycle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Notification: Merchant is notified in dashboard and via email/webhook</li>
              <li>Evidence: Upload receipts, proof of delivery, or service logs</li>
              <li>Review: Acquirer/Network reviews evidence and issues decision</li>
              <li>Outcome: Win/Loss recorded; fees may apply as per network rules</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Use clear descriptors and transparent checkout policies</li>
              <li>Maintain delivery/fulfillment logs and customer communication</li>
              <li>Respond to disputes within timelines; incomplete evidence weakens cases</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
