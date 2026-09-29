import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { shortDay } from "@/lib/format";
import type { AdminStats } from "@/utils/types";

export function DecisionsChart({ daily }: { daily: AdminStats["daily"] }) {

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={daily}
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border)"
        />
        <XAxis
          dataKey="date"
          tickFormatter={shortDay}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          labelFormatter={(date) => shortDay(String(date))}
          cursor={{ fill: "var(--muted)" }}
        />
        <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />

        <Bar
          dataKey="approved"
          name="Approved"
          stackId="day"
          fill="var(--success)"
        />
        <Bar
          dataKey="escalated"
          name="Escalated"
          stackId="day"
          fill="var(--warning)"
        />
        <Bar
          dataKey="denied"
          name="Denied"
          stackId="day"
          fill="var(--danger)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
