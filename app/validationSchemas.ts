import z from "zod";

const boardSchema = z.object({
  boardName: z
    .string({ required_error: "Board Name is required" })
    .min(3, "Board Name is too short")
    .max(45, "Board Name is too long"),
  boardShortForm: z
    .string({ required_error: "Board Shorform is required" })
    .min(1, "Board Shortform is too short")
    .max(10, "Board Shortform is too long"),
});

const gradeSchema = z.object({
  gradeName: z
    .string({ required_error: "Grade Name is required" })
    .min(3, "Grade Name is too short")
    .max(45, "Grade Name is too long"),
});

const subjectSchema = z.object({
  subjectName: z
    .string({ required_error: "Subject Name is required" })
    .min(3, "Subject Name is too short")
    .max(45, "Subject Name is too long"),
  subjectShortForm: z
    .string({ required_error: "Subject Shortform is required" })
    .min(1, "Subject Shortform is too short")
    .max(10, "Subject Shortform is too long"),
  subjectImage: z.string({ required_error: "Subject Image is required" }),
  gradeId: z.number({
    required_error: "Subject Grade is required",
    invalid_type_error: "Subject Grade is required",
  }),
  boardId: z.number({
    required_error: "Subject Board is required",
    invalid_type_error: "Subject Board is required",
  }),
});

const teacherSchema = z.object({
  teacherName: z
    .string({ required_error: "Teacher Name is required" })
    .min(3, "Teacher Name is too short")
    .max(45, "Teacher Name is too long"),
  teacherEmail: z
    .string({ required_error: "Teacher Email is required" })
    .email(),
  teacherPassword: z
    .string({ required_error: "Teacher Password is required" })
    .min(3, "Teacher Password is too short")
    .max(45, "Teacher Password is too long"),
});

const lectureGroupSchema = z.object({
  lectureGroupName: z
    .string({ required_error: "Lecture Group Name is required" })
    .min(3, "Lecture Group Name is too short")
    .max(45, "Lecture Group Name too long"),
  subjectId: z.number({
    required_error: "Subject is required",
    invalid_type_error: "Subject is required",
  }),
  teacherId: z.number({
    required_error: "Teacher is required",
    invalid_type_error: "Teacher is required",
  }),
});

const chapterSchema = z.object({
  chapterName: z
    .string({ required_error: "Chapter Name is required" })
    .min(3, "Chapter Name is too short")
    .max(45, "Chapter Name is too long"),
  chapterNumber: z.number({
    required_error: "Chapter Number is required",
    invalid_type_error: "Chapter Number is required",
  }),
});

const topicSchema = z.object({
  topicName: z
    .string({ required_error: "Topic Name is required" })
    .min(3, "Topic Name is too short")
    .max(45, "Topic Name is too long"),
});

const studentSchema = z.object({
  studentName: z
    .string({ required_error: "Student Name is required" })
    .min(3, "Student Name is too short")
    .max(45, "Student Name is too long"),
  studentEmail: z
    .string({ required_error: "Student Email is required" })
    .email(),
  studentPassword: z
    .string({ required_error: "Student Password is required" })
    .min(3, "Student Password is too short")
    .max(45, "Student Password is too long"),
  studentGradeId: z.number({
    required_error: "Student Grade is required",
    invalid_type_error: "Student Grade is required",
  }),
  studentBoardId: z.number({
    required_error: "Student Board is required",
    invalid_type_error: "Student Board is required",
  }),
});

export {
  boardSchema,
  gradeSchema,
  subjectSchema,
  teacherSchema,
  lectureGroupSchema,
  chapterSchema,
  topicSchema,
  studentSchema,
};
