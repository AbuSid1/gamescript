import puppeteer from "puppeteer";
import nodemailer from "nodemailer";

(async () => {
  let arr1 = [];

  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  //------------------LOGIN PAGE------------------------//
  await page.goto("https://91appl.com/#/login", {
    waitUntil: "domcontentloaded",
  });

  //------------------USER NUMBER------------------------//
  await page.waitForSelector('[name="userNumber"]', { visible: true });
  await page.click('[name="userNumber"]');
  await page.type('[name="userNumber"]', "9289080335", { delay: 200 });

  //------------------USER PASSWORD------------------------//
  await page.waitForSelector(".passwordInput__container-input>input", {
    visible: true,
  });
  await page.click(".passwordInput__container-input>input");
  await page.type(".passwordInput__container-input>input", "Lostone123", {
    delay: 200,
  });

  //------------------LOGIN BUTTON------------------------//
  await page.waitForSelector("button.active", {
    waitUntil: "domcontentloaded",
  });
  await page.click("button.active");
  console.log("clicked");

  const page1 = await browser.newPage();

  await page1.goto("https://91appl.com/#/home/AllLotteryGames/WinGo?id=1",{
    waitUntil: "networkidle0",
  })



  // Wait for the GameList to appear
  await page1.waitForSelector(".GameList__C > .GameList__C-item", {
    visible: true,
  });

  await page1.waitForSelector(".GameList__C > .GameList__C-item:nth-child(2)", {
    visible: true,
  });

  // Click the second element in the list
  await page1.click(".GameList__C > .GameList__C-item:nth-child(1)");

  console.log("done");


  await page.goto("https://91appl.com/#/home/AllLotteryGames/WinGo?id=1",{
    waitUntil: "networkidle0",
  })

  // Function to fetch the third child text at intervals
  const fetchGameRecord = async () => {
    const getBS = await page.evaluate(() => {
      const row = document.querySelectorAll(
        ".GameRecord__C-body > .van-row"
      )[0];
      if (row) {
        return row.querySelector(".van-col:nth-child(3)")?.innerText || null;
      }
      return null;
    });

    if (getBS) {
      arr1.push(getBS);
      console.log(arr1);
    }

    //Email Sent Function
    if (arr1.length >= 9) {
      let copyArr2 = [...arr1];
      arr1 = [];

      if (copyArr2.includes("Small") && copyArr2.includes("Big")) {
        copyArr2 = [];
      } else {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "test836email@gmail.com",
            pass: "nqmcmymuruykgkow",
          },
        });

        const mailOptions = {
          from: "test836email@gmail.com",
          to: "rehaan.8010malik@gmail.com",
          subject: "Test Email",
          text: "This is a test email sent using Nodemailer with Gmail.",
        };

        try {
          // Await the sendMail call, which returns a promise
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);
          copyArr2 = [];
        } catch (error) {
          console.log("Error sending email:", error);
        }
      }
    }
  };

  // Running the fetchGameRecord function every 60 seconds
  const intervalId = setInterval(async () => {
    await fetchGameRecord();
  }, 30000);
})();
