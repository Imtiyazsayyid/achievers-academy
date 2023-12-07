"use client";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Board } from "@prisma/client";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart() {
  const [data, setData] = useState<any>();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Board Wise Students",
      },
    },
  };

  const getStudentPerBoardCount = async () => {
    const res = await axios.get("/api/chart/board");
    const labels = res.data.data.map((group: any) => group.board_name);
    const chartData = res.data.data.map((group: any) => group._count);

    setData({
      labels: [...labels],
      datasets: [
        {
          label: "Students",
          data: [...chartData],
          backgroundColor: [
            "rgba(153, 102, 255, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(153, 102, 255, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    getStudentPerBoardCount();
  }, []);

  //   return "";

  return (
    <>{data && <Doughnut data={data} height={"80%"} options={options} />}</>
  );
}
