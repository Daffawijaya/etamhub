import MonitoringDataTable from "@/components/admin/monitoring/MonitoringDataTable";

export default function MonitoringPage() {
  return (
    <div className="space-y-6 px-6 pb-6 bg-light dark:bg-dark h-min-screen">
      <div className="bg-light dark:bg-dark h-min-screen">
        <MonitoringDataTable limit={10} />
      </div>
    </div>
  );
}
