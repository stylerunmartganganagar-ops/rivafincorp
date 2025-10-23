import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Terms of Use</h1>
          <p className="text-muted-foreground mt-2">Effective date: 01 Jan 2025</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>By using Rivafincorp services, you agree to be bound by these Terms. If you are using our services on behalf of a business, you represent that you have authority to bind that entity.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merchant Obligations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate KYC information and maintain compliance with applicable laws</li>
              <li>Use services only for lawful transactions and permitted business activities</li>
              <li>Maintain security of credentials and devices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fees and Settlements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Fees will be communicated separately in your Merchant Agreement. Settlements are subject to holds, reserves and risk controls at our discretion.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liability & Indemnity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>You agree to indemnify Rivafincorp against claims arising from your use of services, breach of these Terms, or violation of law.</p>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
