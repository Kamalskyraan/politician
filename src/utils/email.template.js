export const emailOtpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Email - Political Personal Assistant</title>

  <!-- Inter Font -->
  <!-- <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"> -->
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  font-family: Inter, Times New Roman, serif;
">

  <!-- Outer Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background-color: #f4f4f4; padding: 30px 0;">
    <tr>
      <td align="center">

        <!-- Email Card -->
        <table role="presentation" width="700" cellspacing="0" cellpadding="0" border="0"
          style="
            background-color: #ffffff;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            max-width: 700px;
            width: 100%;
          ">

          <!-- Header -->
          <tr>
            <td style="
              padding: 22px 32px;
              border-bottom: 1px solid #eeeeee;
            ">
              <span style="
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 15px;
                font-weight: 600;
                color: #2d7a7a;
                letter-spacing: 0.02em;
              ">
                Political Personal Assistant
              </span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 32px 32px 32px;">

              <!-- Greeting -->
              <p style="
                margin: 0 0 28px 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 30px;
                font-weight: 700;
                color: #111111;
                line-height: 1.2;
              ">
                Hello there,
              </p>

              <!-- Intro -->
              <p style="
                margin: 0 0 6px 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 15px;
                color: #222222;
                line-height: 1.6;
              ">
                Here is your <strong>One-Time Password (OTP).</strong>
              </p>

              <p style="
                margin: 0 0 30px 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 15px;
                color: #222222;
                line-height: 1.6;
              ">
                Please enter this code to verify your email address for
                Political Personal Assistant.
              </p>

              <!-- OTP BOXES -->
              <!-- Backend should pass d1, d2, d3, d4 -->

              <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                style="margin-bottom: 28px;">
                <tr>

                  <!-- Digit 1 -->
                  <td style="padding-right: 10px;">
                    <div style="
                      width: 58px;
                      height: 58px;
                      border: 1.5px solid #2d7a7a;
                      border-radius: 5px;
                      text-align: center;
                      line-height: 58px;
                      font-family: 'Inter', 'Times New Roman', serif;
                      font-size: 26px;
                      font-weight: 700;
                      color: #111111;
                      display: inline-block;
                    ">
                      ${otp[0]}
                    </div>
                  </td>

                  <!-- Digit 2 -->
                  <td style="padding-right: 10px;">
                    <div style="
                      width: 58px;
                      height: 58px;
                      border: 1.5px solid #2d7a7a;
                      border-radius: 5px;
                      text-align: center;
                      line-height: 58px;
                      font-family: 'Inter', 'Times New Roman', serif;
                      font-size: 26px;
                      font-weight: 700;
                      color: #111111;
                      display: inline-block;
                    ">
                      ${otp[1]}
                    </div>
                  </td>

                  <!-- Digit 3 -->
                  <td style="padding-right: 10px;">
                    <div style="
                      width: 58px;
                      height: 58px;
                      border: 1.5px solid #2d7a7a;
                      border-radius: 5px;
                      text-align: center;
                      line-height: 58px;
                      font-family: 'Inter', 'Times New Roman', serif;
                      font-size: 26px;
                      font-weight: 700;
                      color: #111111;
                      display: inline-block;
                    ">
                      ${otp[2]}
                    </div>
                  </td>

                  <!-- Digit 4 -->
                  <td>
                    <div style="
                      width: 58px;
                      height: 58px;
                      border: 1.5px solid #2d7a7a;
                      border-radius: 5px;
                      text-align: center;
                      line-height: 58px;
                      font-family: 'Inter', 'Times New Roman', serif;
                      font-size: 26px;
                      font-weight: 700;
                      color: #111111;
                      display: inline-block;
                    ">
                      ${otp[3]}
                    </div>
                  </td>

                </tr>
              </table>

              <!-- Expiry -->
              <p style="
                margin: 0 0 28px 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 15px;
                color: #222222;
                line-height: 1.6;
              ">
                OTP will expire in <strong>5 minutes</strong>.
              </p>

              <!-- Warning -->
              <p style="
                margin: 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 14px;
                color: #444444;
                line-height: 1.7;
              ">
                Never share your OTP. Our team will never ask for your OTP,
                password, or any financial information.

                If you observe any suspicious activity,
                please report it immediately through the app or contact our
<<<<<<< HEAD
                support team at
=======
                support team for assistance. (support mail/contact).
>>>>>>> origin/akash

                <a href="mailto:support@yourdomain.com"
                  style="
                    color:#2d7a7a;
                    text-decoration:none;
                  ">
                  support@yourdomain.com
                </a>.
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <hr style="
                border: none;
                border-top: 1px solid #e5e5e5;
                margin: 0;
              " />
            </td>
          </tr>

          <!-- Copyright -->
          <tr>
            <td style="
              padding: 20px 32px;
              text-align: center;
            ">
              <p style="
                margin: 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 12px;
                color: #888888;
              ">
                ©<script>document.write(new Date().getFullYear())</script> Political Personal Assistant.
                All rights reserved.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background-color: #2d7a7a;
              padding: 22px 32px;
              text-align: center;
            ">

              <p style="
                margin: 0 0 10px 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 12px;
                color: #ffffff;
                line-height: 1.6;
              ">
                You are receiving this email because you signed up with
                Political Personal Assistant App.

                By using our services, you acknowledge and agree to our
                Terms of Service and Privacy Policy.
              </p>

              <p style="
                margin: 0;
                font-family: 'Inter', 'Times New Roman', serif;
                font-size: 12px;
              ">

                <a href="#"
                  style="
                    color: #ffffff;
                    text-decoration: underline;
                    margin-right: 8px;
                  ">
                  Privacy Policy
                </a>

<<<<<<< HEAD
                <span style="color: #ffffff;">•</span>
=======
>>>>>>> origin/akash

                <a href="#"
                  style="
                    color: #ffffff;
                    text-decoration: underline;
                    margin-left: 8px;
                  ">
                  Terms of Service
                </a>

              </p>

            </td>
          </tr>

        </table>
        <!-- End Email Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
};

export const emailContactUsTemplate = (comments) => {
  
};
