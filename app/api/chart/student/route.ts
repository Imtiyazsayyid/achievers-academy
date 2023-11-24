import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

interface WeekCount {
  week: string;
  student_count: number;
  date_range?: string; // Add this property to the interface
}

export async function GET(request: NextRequest) {
  const from_date = request.nextUrl.searchParams.get("from_date");
  const to_date = request.nextUrl.searchParams.get("to_date");

  let startDate: string | null = "";
  let endDate: string | null = "";

  if (!from_date || !to_date) {
    const currentDate = moment(); // Current date and time
    startDate = currentDate.clone().startOf("month").format("YYYY-MM-DD");
    endDate = currentDate.clone().endOf("month").format("YYYY-MM-DD");
  } else {
    startDate = from_date;
    endDate = to_date;
  }

  const allWeeks = generateWeeksTable(startDate, endDate);

  const weeklyStudentCount = await prisma.$queryRaw<WeekCount[]>(Prisma.sql`
    SELECT DATE_FORMAT(DATE(created_at), "%x-%v") as week, COUNT(*) as student_count
    FROM Student
    WHERE created_at >= ${startDate} AND created_at < ${endDate}
    GROUP BY week
    ORDER BY week
  `);

  const resultWithMissingWeeks = mergeWithMissingWeeks(
    allWeeks,
    weeklyStudentCount
  );

  const formattedData = resultWithMissingWeeks.map((item) => ({
    ...item,
    date_range: getDatesFromISOWeek(item.week),
    student_count: Number(item.student_count),
  }));

  return NextResponse.json({ data: formattedData, status: true });
}

function getDatesFromISOWeek(isoWeek: string): string {
  const [year, weekNumber] = isoWeek.split("-").map(Number);

  const startDate = moment()
    .isoWeekYear(year)
    .isoWeek(weekNumber)
    .startOf("isoWeek");
  const endDate = moment()
    .isoWeekYear(year)
    .isoWeek(weekNumber)
    .endOf("isoWeek");

  return `${startDate.format("MMM D")} to ${endDate.format("MMM D, YYYY")}`;
}

function generateWeeksTable(
  startDate: string,
  endDate: string
): moment.Moment[] {
  const weeks: moment.Moment[] = [];
  let currentWeek = moment(startDate);

  while (currentWeek.isBefore(endDate)) {
    weeks.push(currentWeek);
    currentWeek = currentWeek.clone().add(1, "week");
  }

  return weeks;
}

function mergeWithMissingWeeks(
  allWeeks: moment.Moment[],
  weeklyStudentCount: WeekCount[]
): WeekCount[] {
  const weekMap = new Map(weeklyStudentCount.map((item) => [item.week, item]));

  for (const week of allWeeks) {
    const weekKey = week.format("YYYY-ww");
    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { week: weekKey, student_count: 0 });
    }
  }

  const sortedResult = Array.from(weekMap.values()).sort((a, b) =>
    a.week.localeCompare(b.week)
  );

  return sortedResult;
}
