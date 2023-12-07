import { Subject } from "@prisma/client";

const WelcomNewStudent = (
  studentName: string,
  email: string,
  password: string,
  subjects: { name: string; subject: string }[]
) => {
  console.log({ subjects });
  const welcomeNewStudent = `<!DOCTYPE html>
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
      <h1>Welcome To Achievers Academy, <br />${studentName}.</h1>
      <div class="my">
        <p>
          We are excited to include you in our
          <a href="http://localhost:3000/student">revision platform</a>
        </p>
        <p>Your credentials are listed below</p>
      </div>
      <div class="my">
        <p><span class="font-bold">Email:</span> ${email}</p>
        <p><span class="font-bold">Password:</span> ${password}</p>
      </div>
  
      <div class="my">
        <p>You are a part of the following lecture groups:</p>
        <table cellspacing="0">
          <tr>
            <th>#</th>
            <th>Lecture Group Name</th>
          </tr>
          ${subjects
            .map(
              (subject, index) => `<tr>
          <td>${index + 1}</td>
          <td>${subject.subject} ${subject.name}</td>
        </tr>`
            )
            .join("")}
        </table>
      </div>
  
      <p>We are excited to have you. Can't wait to see you.</p>
      <p>Achivers Academy.</p>
    </body>
  </html>
  `;

  return welcomeNewStudent;
};

export default WelcomNewStudent;
