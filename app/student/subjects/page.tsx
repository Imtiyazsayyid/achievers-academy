"use client";
import SearchBar from "@/app/components/SearchBar";
import { Flex, Grid, Heading } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";
import axios from "axios";
import { Student, StudentSubjectMapper, Subject } from "@prisma/client";

type StudentSubjects = StudentSubjectMapper & {
  subject: Subject;
  student: Student;
};

const page = () => {
  const [studentSubjects, setStudentSubjects] = useState<StudentSubjects[]>();
  const [searchText, setSearchText] = useState("");

  const getStudentSubjects = async () => {
    const res = await axios.get("/api/subject/student", {
      params: {
        searchText,
        studentId: 1,
      },
    });

    setStudentSubjects(res.data.data);
  };

  useEffect(() => {
    getStudentSubjects();
  }, [searchText]);

  return (
    <Flex className="w-full h-full p-10">
      <Flex
        className="border w-full bg-white rounded-lg shadow-sm p-10"
        direction={"column"}
      >
        <Heading mb={"7"}>Your Subjects</Heading>
        <Flex mb={"2"}>
          <SearchBar
            placeholder="Find Your Subject"
            searchText={searchText}
            setSearchText={(text) => setSearchText(text)}
          />
        </Flex>
        <Grid
          className="border h-[60vh] rounded-lg bg-slate-100 p-4"
          columns={"3"}
          gap={"4"}
        >
          {studentSubjects?.map((studentSubject) => (
            <SubjectCard
              id={studentSubject.id}
              img={studentSubject.subject.img}
              subject={studentSubject.subject.name}
            />
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default page;
