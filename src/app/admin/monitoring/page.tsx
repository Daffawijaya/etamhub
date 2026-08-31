import MonitoringDataTable from "@/components/admin/monitoring/MonitoringDataTable";

export default function MonitoringPage() {
  return (
    <div>
      <div>
        <MonitoringDataTable limit={10} />
      </div>
    </div>
  );
}
