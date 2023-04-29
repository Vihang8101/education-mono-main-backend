const htmlTemplate = (ref, name, link) => {
  const title = ref === "reset" ? "Reset Password" : "Verification";
  const para = ref === "reset" ? "reset your password" : "verify your account";
  const text = ref === "reset" ? "Reset" : "Verify";

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <style>
        * {
          font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <table style="width: 100vw">
        <thead>
          <tr>
            <th style="padding: 1rem; border-bottom: 2px solid black">
              <div style="display: flex; align-items: center; gap: 1rem">
                <img
                  src="https://www.reshot.com/preview-assets/icons/G76A9LEQXY/book-idea-G76A9LEQXY.svg"
                  alt=""
                  style="height: 50px" />
                <h2 style="white-space: nowrap; text-align: left">
                  Education Platform
                </h2>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 2rem">
              <picture> </picture>
              <h2 style="margin-bottom: 1rem">${title}</h2>
              <p>Hello ${name},</p>
              <p style="margin-bottom: 2rem">
                Click on the link button below to ${para}.
              </p>
              <a
                href="${link}"
                style="padding: 0.5rem 2rem; border: 2px solid black"
                target="_blank">
                ${text}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 2rem">
              <p>Open the link if the button does not work.</p>
              <a href="${link}" target="_blank"> ${link} </a>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="background-color: black; color: white; text-align: center">
            <td style="padding: 2rem">
              Copyrights © 2023 Education Platform. All rights reserved.
            </td>
          </tr>
        </tfoot>
      </table>
    </body>
  </html>
  `;
};

module.exports = htmlTemplate;
