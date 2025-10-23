import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function About() {
  return (
    <div className="min-h-screen bg-background no-select-caret">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">About Rivafincorp</h1>
          <p className="text-muted-foreground mt-2">Building trusted payments for India since 2019</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Who We Are</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Rivafincorp Payments Private Limited is an Indian payment gateway authorized by YES Bank. We enable businesses across India to accept digital payments with high success rates, strong risk controls and fast settlements.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Accept payments via UPI, cards, netbanking and more</li>
              <li>Offer instant refunds, risk & chargeback tooling</li>
              <li>Provide developer-friendly APIs and dashboards</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>To empower Indian businesses with reliable, secure and scalable payment infrastructure.</p>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Our Team (27)</h2>
          <div className="relative overflow-hidden bg-muted/30 rounded-lg p-4">
            {(() => {
              const team = [
                "Aarav Patel","Aditi Sharma","Advait Rao","Aisha Khan","Akash Gupta","Ananya Iyer","Arjun Verma",
                "Aryan Malhotra","Ayushi Singh","Devansh Kulkarni","Dhruv Mehta","Diya Nair","Harsh Vardhan","Ishita Bose",
                "Kabir Kapoor","Karan Agarwal","Kritika Jain","Manav Desai","Meera Reddy","Neeraj Sinha","Nikita Bansal",
                "Pooja Mishra","Pranav Joshi","Rhea Menon","Ritvik Chatterjee","Shreya Pillai","Vihaan Shah"
              ];
              return (
                <>
                  <motion.div
                    className="flex gap-4 mb-3"
                    initial={{ x: 0 }}
                    animate={{ x: [0, -1200] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    {[...team, ...team].map((t, i) => (
                      <Card key={`about-track1-${i}`} className="min-w-[220px]">
                        <CardHeader className="pb-2"><CardTitle className="text-base">{t}</CardTitle></CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Payments Specialist • India</CardContent>
                      </Card>
                    ))}
                  </motion.div>
                  <motion.div
                    className="flex gap-4"
                    initial={{ x: -1200 }}
                    animate={{ x: [-1200, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    {[...team, ...team].map((t, i) => (
                      <Card key={`about-track2-${i}`} className="min-w-[220px]">
                        <CardHeader className="pb-2"><CardTitle className="text-base">{t}</CardTitle></CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Payments Specialist • India</CardContent>
                      </Card>
                    ))}
                  </motion.div>
                </>
              );
            })()}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
