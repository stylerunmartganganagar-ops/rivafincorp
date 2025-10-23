import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Effective date: 01 Jan 2025</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Rivafincorp Payments Private Limited ("Rivafincorp", "we", "our") is committed to protecting your privacy. This Policy explains how we collect, use, disclose and protect personal information when you use our payment services and website.</p>
            <p>By accessing or using our services you agree to this Policy. If you do not agree, please discontinue use.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Merchant KYC data (name, PAN, Aadhaar, address, corporate details)</li>
              <li>Contact information (email, phone)</li>
              <li>Financial and transactional information</li>
              <li>Device, usage, logs, IP and cookies</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and improve payment processing and settlements</li>
              <li>To verify identity, perform risk checks and comply with law</li>
              <li>To prevent fraud, disputes and chargebacks</li>
              <li>For communication, support and service notifications</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>We may share information with acquiring banks (including YES Bank), payment networks, service providers, auditors, or as required by law. We do not sell personal data.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>We use technical and organizational measures to protect data. We retain information as required by applicable law and for legitimate business purposes.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>You may access, correct or request deletion of certain information subject to legal limits. Contact us for requests.</p>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
