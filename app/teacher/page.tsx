"use client";
import {
  Button,
  Dialog,
  DialogClose,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import BoardWiseDoughnutChart from "./charts/BoardWiseStudentsDonutChart";
import GradeWiseDoughnutChart from "./charts/GradeWiseStudentsDonutChart";
import LineChart from "./charts/StudentByYearLineChart";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useEffect, useState } from "react";
import { CalendarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {} from "@radix-ui/react-dialog";
import moment from "moment";
import axios from "axios";

const AdminHomePage = () => {
  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  const currentDate = moment(); // Current date and time

  const [dateRange, setDateRange] = useState({
    from_date: currentDate.clone().startOf("month").format("YYYY-MM-DD"),
    to_date: currentDate.clone().endOf("month").format("YYYY-MM-DD"),
  });

  const [isDialogOpen, setDialogOpen] = useState(false);

  function handleSelect(ranges: any) {
    setDialogOpen(false);
    const startDate = moment(ranges.selection.startDate).format("YYYY-MM-DD");
    const endDate = moment(ranges.selection.endDate).format("YYYY-MM-DD");
    setDateRange({ from_date: startDate, to_date: endDate });
  }

  const [studentCount, setStudentCount] = useState<number>();
  const [teacherCount, setTeacherCount] = useState<number>();
  const [boardCount, setBoardCount] = useState<number>();
  const [gradeCount, setGradeCount] = useState<number>();
  const [lectureGroupCount, setLectureGroupCount] = useState<number>();

  const getStudentCount = async () => {
    const res = await axios.get("/api/student");
    setStudentCount(res.data.count);
  };
  const getTeacherCount = async () => {
    const res = await axios.get("/api/teacher");
    setTeacherCount(res.data.count);
  };
  const getBoardCount = async () => {
    const res = await axios.get("/api/board");
    setBoardCount(res.data.count);
  };
  const getGradeCount = async () => {
    const res = await axios.get("/api/grade");
    setGradeCount(res.data.count);
  };
  const getLectureGroupCount = async () => {
    const res = await axios.get("/api/lecture-group");
    setLectureGroupCount(res.data.count);
  };

  useEffect(() => {
    getStudentCount();
    getTeacherCount();
    getBoardCount();
    getGradeCount();
    getLectureGroupCount();
  }, []);

  return (
    <Flex className="w-full">
      <Flex
        className="w-full overflow-hidden overflow-y-scroll pb-5 pr-5"
        gap={"2"}
        direction={"column"}
      >
        <Flex className="w-full h-[500px]" gap={"2"}>
          <Flex
            className="w-1/2 h-full p-10 border rounded-lg shadow-lg bg-white"
            direction={"column"}
            align={"center"}
            gap={"5"}
          >
            <BoardWiseDoughnutChart />
          </Flex>
          <Flex
            className="w-1/2 h-full p-10 border rounded-lg shadow-lg bg-white"
            direction={"column"}
            align={"center"}
            gap={"5"}
          >
            <GradeWiseDoughnutChart />
          </Flex>
        </Flex>
        <Flex gap={"2"}>
          <Flex
            className="p-10 border rounded-lg shadow-lg bg-white w-4/5"
            direction={"column"}
          >
            <Flex justify={"end"} px={"9"}>
              <Dialog.Root open={isDialogOpen}>
                <Dialog.Trigger>
                  <TextField.Root className="w-60">
                    <TextField.Slot>
                      <CalendarIcon height="16" width="16" />
                    </TextField.Slot>
                    <TextField.Input
                      value={
                        dateRange.from_date &&
                        `${moment(dateRange.from_date).format(
                          "DD MMM"
                        )} to ${moment(dateRange.to_date).format(
                          "DD MMM YYYY"
                        )}`
                      }
                      placeholder="Pick A Date Range"
                      className="rounded-r-none"
                      onClick={() => setDialogOpen(true)}
                    />
                  </TextField.Root>
                </Dialog.Trigger>
                <Dialog.Content style={{ maxWidth: "382px" }}>
                  <DateRangePicker
                    ranges={[selectionRange]}
                    staticRanges={[]}
                    inputRanges={[]}
                    showDateDisplay={false}
                    showPreview={false}
                    showMonthAndYearPickers={false}
                    onChange={handleSelect}
                    // onChange={this.handleSelect}
                  />
                  <Flex gap="3" justify="end">
                    <DialogClose>
                      <Button variant="soft" color="gray">
                        Close
                      </Button>
                    </DialogClose>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
            <LineChart dateRange={dateRange} />
          </Flex>
          <Flex className="w-1/5" direction={"column"} gap={"2"}>
            <Flex
              className="h-1/5 border rounded-lg shadow-lg bg-white"
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={"1"}
            >
              <Text className="text-xs text-slate-500">Students On Board</Text>
              <Heading>{studentCount}</Heading>
            </Flex>
            <Flex
              className="h-1/5 border rounded-lg shadow-lg bg-white"
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={"1"}
            >
              <Text className="text-xs text-slate-500">Teachers On Board</Text>
              <Heading>{teacherCount}</Heading>
            </Flex>
            <Flex
              className="h-1/5 border rounded-lg shadow-lg bg-white"
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={"1"}
            >
              <Text className="text-xs text-slate-500">Total Boards</Text>
              <Heading>{boardCount}</Heading>
            </Flex>
            <Flex
              className="h-1/5 border rounded-lg shadow-lg bg-white"
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={"1"}
            >
              <Text className="text-xs text-slate-500">Total Grades</Text>
              <Heading>{gradeCount}</Heading>
            </Flex>
            <Flex
              className="h-1/5 border rounded-lg shadow-lg bg-white"
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={"1"}
            >
              <Text className="text-xs text-slate-500">
                Total Lecture Groups
              </Text>
              <Heading>{lectureGroupCount}</Heading>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AdminHomePage;
