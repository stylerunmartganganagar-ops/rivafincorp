import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-semibold">Rivafincorp</span>
            </div>
            <p className="text-muted-foreground mb-3">Trusted Indian payment gateway, authorized by YES Bank.</p>
            <div className="text-muted-foreground">India • Since 2019</div>
          </div>
          <div>
            <div className="font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
              <li><Link to="/important" className="hover:text-foreground">Important</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Legal</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms of Use</Link></li>
              <li><Link to="/refund-policy" className="hover:text-foreground">Refund Policy</Link></li>
              <li><Link to="/chargebacks" className="hover:text-foreground">Chargebacks & Refunds</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Products</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>Payment Links</li>
              <li>UPI Intent</li>
              <li>Instant Settlements</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-xs text-muted-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Rivafincorp Payments Private Limited. All rights reserved.</div>
          <div>Authorized by YES Bank • Registered in India</div>
        </div>
      </div>
    </footer>
  );
}
