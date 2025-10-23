import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const partners = [
    "YES Bank", "Reliance Retail", "Tata Digital", "Infosys", "Zomato", "Flipkart", "Byju's", "Airtel"
  ];

  const powerfulFeatures = [
    {
      title: "Wallet Settlements",
      desc: "Settle funds to internal wallets for flexible, instant payouts and spend controls.",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Private VPA",
      desc: "Issue dedicated VPAs per merchant or customer to simplify reconciliation of UPI payments.",
      img: "https://framerusercontent.com/images/SHKxSo0D4IFansuBjWlkLfYDYfo.png?width=1200&height=800",
    },
    {
      title: "0% Fee on UPI",
      desc: "Accept UPI payments at 0% MDR for supported intents and limits with optimized conversion.",
      img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Instant Approvals",
      desc: "Fast-track onboarding with automated checks so you can start collecting in minutes.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Chargeback Protection",
      desc: "Advanced risk controls, evidence workflows and alerts to reduce disputes and fraud.",
      img: "https://clearviewmc.net/wp-content/uploads/2025/08/Chargeback-Protection-Program-1-888x1024.png",
    },
    {
      title: "Detailed Analytics",
      desc: "Real-time dashboards and granular insights to track performance and cohorts.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Smart UI with UPI Intent",
      desc: "Deep-links and intent flows tuned for Indian users to maximize success rates.",
      img: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Payment Links",
      desc: "Generate links to collect payments over SMS, Email, or WhatsApp instantly.",
      img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
    },
    {
      title: "Instant Settlements",
      desc: "On-demand or same-day settlements to your bank with YES Bank authorization.",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  const stories = [
    {
      name: "Rohit Sharma",
      company: "Sharma Electronics, Jaipur",
      quote: "Rivafincorp simplified our online collections. Settlement times improved and support is excellent.",
    },
    {
      name: "Priya Nair",
      company: "Nair Handicrafts, Kochi",
      quote: "Seamless onboarding and robust dashboard. Refunds and disputes are transparent and fast.",
    },
    {
      name: "Aman Verma",
      company: "Verma Grocers, Lucknow",
      quote: "UPI, cards, and netbanking integrations worked out of the box. Our success rates went up immediately.",
    },
  ];

  const reviews = [
    { name: "Neha Gupta", rating: 5, text: "Reliable payouts and responsive support team." },
    { name: "Arjun Mehta", rating: 5, text: "Great APIs and documentation. Easy to integrate." },
    { name: "Kavya Iyer", rating: 4, text: "Beautiful dashboard with insightful analytics." },
    { name: "Sandeep Kumar", rating: 5, text: "Chargeback handling is straightforward and quick." },
  ];

  const team = [
    "Aarav Patel","Aditi Sharma","Advait Rao","Aisha Khan","Akash Gupta","Ananya Iyer","Arjun Verma",
    "Aryan Malhotra","Ayushi Singh","Devansh Kulkarni","Dhruv Mehta","Diya Nair","Harsh Vardhan","Ishita Bose",
    "Kabir Kapoor","Karan Agarwal","Kritika Jain","Manav Desai","Meera Reddy","Neeraj Sinha","Nikita Bansal",
    "Pooja Mishra","Pranav Joshi","Rhea Menon","Ritvik Chatterjee","Shreya Pillai","Vihaan Shah"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground no-select-caret">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-20 grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Trusted Indian Payment Gateway powered by YES Bank
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Rivafincorp helps thousands of Indian businesses accept payments securely with industry-leading success rates, fast settlements, and world-class support.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/auth")}>Get Started</Button>
              {user && <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/dashboard")}>View Dashboard</Button>}
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              Associated with trusted partners and brands across India.
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="rounded-xl border p-4 md:p-6 bg-card shadow-sm">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  { label: "Success Rate", value: "99.2%" },
                  { label: "Merchants", value: "12,000+" },
                  { label: "Avg. Settlement", value: "T+1" },
                  { label: "APIs", value: "REST & Webhooks" },
                ].map((i) => (
                  <Card key={i.label}>
                    <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">{i.label}</CardTitle></CardHeader>
                    <CardContent className="text-xl md:text-2xl font-bold">{i.value}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-8 md:py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-sm text-muted-foreground mb-4">Associated Partners</div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 items-center">
            {partners.map((p) => (
              <motion.div key={p} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-muted-foreground">
                {p}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Rivafincorp</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {["YES Bank Authorized", "Multiple Payment Methods", "Advanced Risk & Disputes", "Instant Refunds", "Powerful Dashboard", "Developer Friendly"].map((f, idx) => (
              <motion.div key={f} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }}>
                <Card>
                  <CardHeader><CardTitle className="text-base md:text-lg">{f}</CardTitle></CardHeader>
                  <CardContent className="text-sm md:text-base text-muted-foreground">Secure, scalable and built for India-first payments at scale.</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Customer Stories */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Customer Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {stories.map((s) => (
              <Card key={s.name}>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">{s.name}</CardTitle>
                  <div className="text-xs md:text-sm text-muted-foreground">{s.company}</div>
                </CardHeader>
                <CardContent className="text-sm md:text-base">"{s.quote}"</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">What businesses say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {reviews.map((r) => (
              <Card key={r.name}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="truncate">{r.name}</span>
                    <span className="text-yellow-500 text-sm md:text-base">{"★".repeat(r.rating)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm md:text-base text-muted-foreground">{r.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team removed from Home; now placed on About page */}

      {/* Powerful Features - Stacked Scroll Cards at the End */}
      <section className="pt-0 pb-0">
        {powerfulFeatures.map((f, idx) => (
          <div key={f.title} className={`flex flex-col overflow-hidden ${idx > 0 ? 'mt-12 md:mt-16 lg:mt-24' : ''}`}>
            <ContainerScroll
              titleComponent={
                <>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black dark:text-white">
                    Powerful Features
                    <br />
                    <span className="text-3xl md:text-4xl lg:text-[3rem] xl:text-[4.5rem] font-bold mt-1 leading-none">
                      {f.title}
                    </span>
                  </h2>
                </>
              }
            >
              <div className="h-full w-full">
                <div className="flex h-full w-full flex-col lg:flex-row gap-4 md:gap-6">
                  <div className="w-full lg:w-1/2 h-48 md:h-64 lg:h-1/2 xl:h-full">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="h-full w-full object-cover rounded-xl"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">{f.title}</h3>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4">{f.desc}</p>
                    <div className="mt-4">
                      <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/auth")}>
                        Get Started
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ContainerScroll>
          </div>
        ))}
      </section>

      {/* CTA (Bottom) */}
      <section className="py-12 md:py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to grow with Rivafincorp?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6">Create your account in minutes and start accepting payments today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/auth")}>Create Account</Button>
            {user && <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/dashboard")}>Explore Dashboard</Button>}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
