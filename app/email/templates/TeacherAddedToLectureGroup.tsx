import { Board, Grade, Subject } from "@prisma/client";

type DetailedSubject = Subject & {
  grade: Grade;
  board: Board;
};
const TeacherAddedToNewLectureGroup = (
  studentName: string,
  lectureGroup: { name: string; subject: DetailedSubject }
) => {
  const TeacherAddedToNewLectureGroup = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <style>
        .my {
          margin: 3rem 0;
        }
  
        body {
          font-family: "arial";
          padding: 2rem;
        }
  
        .font-bold {
          font-weight: 700;
        }
        th,
        td {
          padding: 15px;
          border: 0.5px solid lightgray;
        }
      </style>
    </head>
    <body>
      <h1>Hello From Achievers Academy, <br />${studentName}.</h1>

      <div class="my">
        <p>You have been added to a new lecture group!</p>        
      </div>

      <div class="my">
        <h3>${lectureGroup.subject.name} ${lectureGroup.name} - ${lectureGroup.subject.board.key} ${lectureGroup.subject.grade.name} </h3>        
      </div>

      <p>Achivers Academy.</p>
    </body>
  </html>
  `;

  return TeacherAddedToNewLectureGroup;
};

export default TeacherAddedToNewLectureGroup;
