import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";

import { SpendingChart } from "@/components/dashboard/spending-chart";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { InsightsPanel } from "@/components/insights/insights";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 h-full">
              <ChartAreaInteractive />
            </div>
            <div className="w-full! h-full space-y-2">
              <SpendingChart />
            </div>
          </div>
          <div className="px-4 lg:px-6">
            <InsightsPanel />
          </div>
          <div className="px-4 lg:px-6">
            <TransactionsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
