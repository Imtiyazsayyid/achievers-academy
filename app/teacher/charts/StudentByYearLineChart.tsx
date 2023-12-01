"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Weekly Students Joined",
    },
  },
};

interface Props {
  dateRange: {
    to_date: string;
    from_date: string;
  };
}

export default function LineChart({ dateRange }: Props) {
  const [data, setData] = useState<any>();

  const getStudentsByWeek = async () => {
    const res = await axios.get("/api/chart/student", {
      params: {
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
      },
    });

    let labels = res.data.data.map((group: any) => group.date_range);
    let chartData = res.data.data.map((group: any) => group.student_count);

    setData({
      labels: [...labels],
      datasets: [
        {
          fill: true,
          label: "Students",
          data: [...chartData],
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
        },
      ],
    });
  };

  useEffect(() => {
    getStudentsByWeek();
  }, [dateRange.from_date, dateRange.to_date]);

  return <>{data && <Line options={{ ...options }} data={data} />}</>;
}
