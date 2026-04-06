import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TriangleAlertIcon } from "lucide-react";

const Insight = () => {
  return (
    <div className="w-full h-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start gap-2 w-full h-14">
            <TriangleAlertIcon
              className="px-1 py-2 bg-red-500/10 rounded-xl"
              color="red"
              size={40}
            />
            <div>
              <h2 className="font-bold">Highest Spending Category</h2>
              <p className="text-muted-foreground text-xs mt-1">
                Housing costs have increased by{" "}
                <span className="text-red-500 font-semibold">18%</span> compared
                to last quarter.
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="uppercase text-muted-foreground">
              Monthly comparison
            </p>
            <p className="text-blue-500 font-semibold">View Report</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Insight;
