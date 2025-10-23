import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function Important() {
  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Important Information</h1>
          <p className="text-muted-foreground mt-2">Key notices, compliance, and disclosures</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Regulatory & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Rivafincorp Payments Private Limited provides payment services in partnership with authorized banks and networks, including YES Bank. All transactions are subject to applicable Indian laws and regulations.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>We follow industry-standard security controls, conduct periodic assessments, and maintain strict access controls to protect your data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Grievance Redressal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>For grievances and escalation, please reach out via our <a className="underline" href="/contact">Contact</a> page. We acknowledge critical incidents within 15 minutes.</p>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
