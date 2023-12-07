const UserOTPEmail = (userName: string, otp: string) => {
  const UserOTPEmail = `<!DOCTYPE html>
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
      <h1>Hello From Achievers Academy, <br />${userName}.</h1>

      <div class="my">
        <p>Your OTP:</p>        
      </div>

      <div class="my">
        <h3>${otp}</h3>        
      </div>

      <p>Do not share this OTP with anybody. If this was not you contact us immediately.</p>
      <p>Achivers Academy.</p>
    </body>
  </html>
  `;

  return UserOTPEmail;
};

export default UserOTPEmail;
