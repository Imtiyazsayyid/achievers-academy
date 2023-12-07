import { Subject } from "@prisma/client";

const WelcomeNewTeacher = (
  studentName: string,
  email: string,
  password: string
) => {
  const WelcomeNewTeacher = `<!DOCTYPE html>
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
          We are excited to include you as a teacher in our
          <a href="http://localhost:3000/student">revision platform</a>
        </p>
        <p>Your credentials are listed below</p>
      </div>
      <div class="my">
        <p><span class="font-bold">Email:</span> ${email}</p>
        <p><span class="font-bold">Password:</span> ${password}</p>
      </div>
  
      <p>We are excited to have you. Can't wait to see you there.</p>
      <p>Achivers Academy.</p>
    </body>
  </html>
  `;

  return WelcomeNewTeacher;
};

export default WelcomeNewTeacher;
