import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminTransactions } from "@/data/adminMock";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminTransactions() {
  const refund = (id: string) => toast.success(`Refund initiated for ${id} (mock)`);
  const flag = (id: string) => toast.warning(`Transaction ${id} flagged (mock)`);

  return (
    <Card>
      <CardHeader><CardTitle>All Transactions</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 pr-4">Txn ID</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminTransactions.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="py-2 pr-4">{t.id}</td>
                  <td className="py-2 pr-4">{t.userId}</td>
                  <td className="py-2 pr-4">₹{(t.amount/100).toLocaleString()}</td>
                  <td className="py-2 pr-4">{t.status}</td>
                  <td className="py-2 pr-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => refund(t.id)}>Refund</Button>
                    <Button size="sm" variant="outline" onClick={() => flag(t.id)}>Flag</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
