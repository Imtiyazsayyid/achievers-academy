"use client";
import SearchBar from "@/app/components/SearchBar";
import { Flex, Grid, Heading } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";
import axios from "axios";
import { Student, StudentSubjectMapper, Subject } from "@prisma/client";
import { useSession } from "next-auth/react";

type StudentSubjects = StudentSubjectMapper & {
  subject: Subject;
  student: Student;
};

const page = () => {
  const [studentSubjects, setStudentSubjects] = useState<StudentSubjects[]>();
  const [searchText, setSearchText] = useState("");
  const { status, data } = useSession();

  const getStudentSubjects = async () => {
    const res = await axios.get("/api/subject/student", {
      params: {
        searchText,
        studentId: data?.user.id,
        onlyActive: true,
      },
    });

    setStudentSubjects(res.data.data);
  };

  useEffect(() => {
    if (status === "authenticated") {
      getStudentSubjects();
    }
  }, [searchText]);

  return (
    <Flex className="w-full h-full p-10">
      <Flex className="w-full bg-white rounded-lg p-10" direction={"column"}>
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
              key={studentSubject.id}
              id={studentSubject.subject_id}
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
