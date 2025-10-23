import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSettlements } from "@/data/adminMock";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettlements() {
  const approve = (id: string) => toast.success(`Settlement ${id} approved (mock)`);
  const hold = (id: string) => toast.warning(`Settlement ${id} put on hold (mock)`);

  return (
    <Card>
      <CardHeader><CardTitle>Settlements Control</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminSettlements.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="py-2 pr-4">{s.id}</td>
                  <td className="py-2 pr-4">{s.userId}</td>
                  <td className="py-2 pr-4">₹{(s.amount/100).toLocaleString()}</td>
                  <td className="py-2 pr-4">{s.status}</td>
                  <td className="py-2 pr-4 flex gap-2">
                    <Button size="sm" onClick={() => approve(s.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => hold(s.id)}>Hold</Button>
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
