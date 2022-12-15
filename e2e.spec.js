const request = require("supertest");
const baseURL = "http://localhost:3000"

describe('TU News main page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000')
    })

    it('should display chatbot button', async () => {
        await page.goto('http://localhost:3000')
        await Promise.all([
            page.$eval('button.open-button', element => element.click()),
            page.waitForSelector('div.chat-msg-box.bot')
        ])
        expect(await page.$eval('div.chat-msg-box.bot', el => el.textContent)).toMatch(/(สวัสดี มีอะไรให้เราช่วยบอกได้นะ|สวัสดี มีอะไรให้เราช่วยไหม)/i);
    })

    it('should Display Pop-up while click readmore in page MainPage and Close Popup when click close', async () => {
        await Promise.all([
            await page.waitForSelector('button#o1'),
            await page.$eval('button#o1', element =>
                element.click()
            )
        ])
        expect(await page.$eval('h4', el => el.textContent)).toBe('อัพรูปนะ');

        await Promise.all([
            await page.waitForSelector('button#c1'),
            await page.$eval('button#c1', element =>
                element.click()
            )
        ])
        expect(await page.$eval('div#popup', el => el.className)).toBe('popup');
    })

    it('should Display seeAllNews while click readmore of news', async () => {
        await page.goto('http://localhost:3000/');
        await Promise.all([
            page.$eval('a#readmore', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/seeAllNews');
    })

    it('should Display Pop-up while click readmore in page seeAllNews and Close Popup when click close', async () => {
        await Promise.all([
            await page.waitForSelector('button#o1'),
            await page.$eval('button#o1', element =>
                element.click()
            )
        ])
        expect(await page.$eval('h4', el => el.textContent)).toBe('อัพรูปนะ');

        await Promise.all([
            await page.waitForSelector('button#c1'),
            await page.$eval('button#c1', element =>
                element.click()
            )
        ])
        expect(await page.$eval('div#popup', el => el.className)).toBe('popup');
    })

    it('should Display seeAllEvents while click readmore of event', async () => {
        await page.goto('http://localhost:3000/');
        await Promise.all([
            page.$eval('a#readmoreevent', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/seeAllEvents');
    })

    it('should Display Pop-up while click readmore in page seeAllEvents and Close Popup when click close', async () => {
        await Promise.all([
            await page.waitForSelector('button#o2'),
            await page.$eval('button#o2', element =>
                element.click()
            )
        ])
        expect(await page.$eval('h4', el => el.textContent)).toBe('Fix');

        await Promise.all([
            await page.waitForSelector('button#c2'),
            await page.$eval('button#c2', element =>
                element.click()
            )
        ])
        expect(await page.$eval('div#popup', el => el.className)).toBe('popup');
    })

    it('should Display Login Admin Page on click button', async () => {
        await page.goto('http://localhost:3000/');
        await Promise.all([
            page.$eval('a#btnlogin', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminLogin');
    })

})

describe('seeAllNews page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/seeAllNews');
    })
    it('should Display IndexPage while click logo', async () => {
        await Promise.all([
            page.$eval('a#logo', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/');
    })

    it('should Display Pop-up while click readmore in page seeAllNews and Close Popup when click close', async () => {
        await page.goto('http://localhost:3000/seeAllNews');
        await Promise.all([
            await page.waitForSelector('button#o1'),
            await page.$eval('button#o1', element =>
                element.click()
            )
        ])
        expect(await page.$eval('h4', el => el.textContent)).toBe('อัพรูปนะ');

        await Promise.all([
            await page.waitForSelector('button#c1'),
            await page.$eval('button#c1', element =>
                element.click()
            )
        ])
        expect(await page.$eval('div#popup', el => el.className)).toBe('popup');
    })

    it('should Display Login Admin Page on click button', async () => {
        await page.goto('http://localhost:3000/');
        await Promise.all([
            page.$eval('a#btnlogin', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminLogin');
    })
})

describe('seeAllEvents page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/seeAllEvents');
    })
    it('should Display Index Page while click logo', async () => {
        await Promise.all([
            page.$eval('a#logo', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/');
    })

    it('should Display Pop-up while click readmore in page seeAllEvents and Close Popup when click close', async () => {
        await page.goto('http://localhost:3000/seeAllEvents');
        await Promise.all([
            await page.waitForSelector('button#o2'),
            await page.$eval('button#o2', element =>
                element.click()
            )
        ])
        expect(await page.$eval('h4', el => el.textContent)).toBe('Fix');

        await Promise.all([
            await page.waitForSelector('button#c2'),
            await page.$eval('button#c2', element =>
                element.click()
            )
        ])
        expect(await page.$eval('div#popup', el => el.className)).toBe('popup');
    })

    it('should Display Login Admin Page on click button', async () => {
        await page.goto('http://localhost:3000/');
        await Promise.all([
            page.$eval('a#btnlogin', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminLogin');
    })
})
//Login page Test E2E
describe('Login Page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/AdminLogin');
    })
    it('should Display Login Admin Page By login fail', async () => {
        await page.type('input.user-box', "Admin1");
        await page.type('input.pass-box', "Admin");
        await Promise.all([
            page.$eval('Button.button', element => element.click()),
            page.waitForSelector('Span#errorName')
        ])
        expect(await page.$eval('Span#errorName', el => el.textContent)).toBe('Username or Password Incorrect');
    })

    it('should Display AdminPage By login password', async () => {
        await page.goto('http://localhost:3000/AdminLogin');
        await page.type('input.user-box', "Admin");
        await page.type('input.pass-box', "Admin");
        await Promise.all([
            // await page.click('Button.button'),
            // await page.waitForNavigation()
            page.$eval('Button.button', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminPage');
    })

})

describe('Admin Page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/AdminPage');
    })

    it('should Display Mainpage while click logo', async () => {
        await Promise.all([
            page.$eval('a#logo', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminPage');
    })

    it('should Display Info for Edit while click Edit in page MainPage Admin', async () => {
        await page.goto('http://localhost:3000/AdminPage');
        await Promise.all([
            await page.waitForSelector('a#o1'),
            await page.$eval('a#o1', element =>
                element.click()
            )
        ])
        expect(page.url()).toBe('http://localhost:3000/info?id=1');
    })

    it('should Display EventManage while click add', async () => {
        await page.goto('http://localhost:3000/AdminPage');
        await Promise.all([
            page.$eval('a#add1', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/EventManage');

        await page.goto('http://localhost:3000/AdminPage');
        await Promise.all([
            page.$eval('a#add2', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/EventManage');
    })

    it('should Display seeAllNewsAdmin while click readmore of news', async () => {
        await page.goto('http://localhost:3000/AdminPage');
        await Promise.all([
            page.$eval('a#readmore', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/seeAllNewsAdmin');
    })

    it('should Display Info for Edit while click Edit in page seeAllNewsAdmin', async () => {
        await Promise.all([
            await page.waitForSelector('a#o1'),
            await page.$eval('a#o1', element =>
                element.click()
            )
        ])
        expect(page.url()).toBe('http://localhost:3000/info?id=1');
    })

    it('should Display seeAllEventsAdmin while click readmore of event', async () => {
        await page.goto('http://localhost:3000/AdminPage');
        await Promise.all([
            page.$eval('a#readmoreevent', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/seeAllEventsAdmin');
    })

    it('should Display Info for Edit while click Edit in page seeAllEventsAdmin', async () => {
        await Promise.all([
            await page.waitForSelector('a#o2'),
            await page.$eval('a#o2', element =>
                element.click()
            )
        ])
        expect(page.url()).toBe('http://localhost:3000/info?id=2');
    })

    it('should Display Mainpage while click logout', async () => {
        await page.goto('http://localhost:3000/AdminPage');
        await Promise.all([
            page.$eval('a#btnlogout', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/');
    })
})

describe('EventManage Page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/EventManage');
    })

    it('should Display AdminPage while click logo', async () => {
        await Promise.all([
            page.$eval('a#logo', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminPage');
    })

    it('should Display Mainpage while click logout', async () => {
        await page.goto('http://localhost:3000/EventManage');
        await Promise.all([
            page.$eval('a#btnlogout', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/');
    })

})

describe('seeAllNewsAdmin Page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/seeAllNewsAdmin');
    })

    it('should Display AdminPage while click logo', async () => {
        await Promise.all([
            page.$eval('a#logo', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminPage');
    })

    it('should Display Info for Edit while click Edit in page seeAllNewsAdmin', async () => {
        await page.goto('http://localhost:3000/seeAllNewsAdmin');
        await Promise.all([
            await page.waitForSelector('a#o1'),
            await page.$eval('a#o1', element =>
                element.click()
            )
        ])
        expect(page.url()).toBe('http://localhost:3000/info?id=1');
    })

    it('should Display Mainpage while click logout', async () => {
        await page.goto('http://localhost:3000/seeAllNewsAdmin');
        await Promise.all([
            page.$eval('a#btnlogout', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/');
    })
})

describe('seeAllEventsAdmin Page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/seeAllEventsAdmin');
    })

    it('should Display AdminPage while click logo', async () => {
        await Promise.all([
            page.$eval('a#logo', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/AdminPage');
    })

    it('should Display Info for Edit while click Edit in page seeAllEventsAdmin', async () => {
        await page.goto('http://localhost:3000/seeAllEventsAdmin');
        await Promise.all([
            await page.waitForSelector('a#o2'),
            await page.$eval('a#o2', element =>
                element.click()
            )
        ])
        expect(page.url()).toBe('http://localhost:3000/info?id=2');
    })

    it('should Display Mainpage while click logout', async () => {
        await page.goto('http://localhost:3000/seeAllEventsAdmin');
        await Promise.all([
            page.$eval('a#btnlogout', element =>
                element.click()
            ),
            await page.waitForNavigation(),
        ])
        expect(page.url()).toBe('http://localhost:3000/');
    })
})


//Back-end Test
describe("BackEndTest GET /", () => {
    it("test / page return 200", async () => {
        const response = await request(baseURL).get("/");
        expect(response.statusCode).toBe(200);
    });
});

describe("BackEndTest /AdminLogin", () => {
    it("test /AdminLogin page return 200", async () => {
        const response = await request(baseURL).get("/AdminLogin");
        expect(response.statusCode).toBe(200);
    });

    it("test /AdminLogin page Login password return 200", async () => {
        const response = await request(baseURL).post("/api/login").send({
            username: "Admin",
            password: "Admin"
        })
        expect(response.statusCode).toBe(200);
    });

    it("test /AdminLogin page Login fail return 401", async () => {
        const response = await request(baseURL).post("/api/login").send({
            username: "Admin1",
            password: "Admin"
        })
        expect(response.statusCode).toBe(401);
    });

    it("test Login fail when input is empty return 401", async () => {
        const response = await request(baseURL).post("/api/login").send({
            username: "",
            password: ""
        })
        expect(response.statusCode).toBe(401);
    });

    it("test Login fail when username is empty return 401", async () => {
        const response = await request(baseURL).post("/api/login").send({
            username: "",
            password: "Admin"
        })
        expect(response.statusCode).toBe(401);
    });

    it("test Login fail when password is empty return 401", async () => {
        const response = await request(baseURL).post("/api/login").send({
            username: "Admin",
            password: ""
        })
        expect(response.statusCode).toBe(401);
    });
});

describe("BackEndTest /EventManage", () => {
    it("test /EventManage page return 200", async () => {
        const response = await request(baseURL).get("/EventManage");
        expect(response.statusCode).toBe(200);
    });
    it("test input events complete return 200 ", async () => {
        const response = await request(baseURL).post("/api/save").send({
            type: "events",
            event: "Fix",
            detail: "Fix",
            date: "2022-12-15T14:01",
            outdate: "2022-12-16T14:01",
            img: "./src/images/events/af8774d9-66e8-447b-952e-38ef7a7bf6bb-profile_banner-480.png"
        })
        expect(response.statusCode).toBe(200);
    });

    it("test input not complete return 404", async () => {
        const response = await request(baseURL).post("/api/save").send({
            type: "events",
            event: "",
            detail: "Fix",
            date: "2022-12-15T14:01",
            outdate: "2022-12-16T14:01",
            img: "./src/images/events/af8774d9-66e8-447b-952e-38ef7a7bf6bb-profile_banner-480.png"
        })
        expect(response.statusCode).toBe(404);
    });
})

describe("BackEndTest /Info", () => {
    it("test /info?id=1 page return 200", async () => {
        const response = await request(baseURL).get("/info?id=1");
        expect(response.statusCode).toBe(200);
    });

    it("test input events complete return 200 ", async () => {
        const message = JSON.stringify({
            type: "events",
            event: "Fix",
            detail: "Fix",
            date: "2022-12-15T14:01",
            outdate: "2022-12-16T14:01",
            img: "./src/images/events/af8774d9-66e8-447b-952e-38ef7a7bf6bb-profile_banner-480.png"
        });
        const response = await request(baseURL).post("/api/update").send(message + '+' + 1)
        expect(response.statusCode).toBe(200);
    });
})

describe("BackEndTest /Chatbot", () => {
    it("test Chatbot response return 200", async () => {
        const response = await request(baseURL).get("/api/welcome")
        expect(response.statusCode).toBe(200)
    })

    it("test Chatbot response return 200", async () => {
        const response = await request(baseURL).get("/api/question/?q=%E0%B8%82%E0%B8%AD%E0%B9%82%E0%B8%84%E0%B8%A7%E0%B8%95%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%9A&_")
        expect(response.statusCode).toBe(200)
        expect(response.body.responseText).toBe("ติดต่อขอโควตาที่คณะเจ้าของวิชา")
    })

    it("test Chatbot response return 200", async () => {
        const response = await request(baseURL).get("/api/question/?q=lo&_")
        expect(response.statusCode).toBe(200)
        expect(response.body.responseText).toMatch(/(ขอโทษครับ ผมยังไม่เข้าใจสิ่งที่คุณพิมพ์|ขอโทษค่ะ ฉันยังไม่เข้าใจสิ่งที่คุณพิมพ์)/i)
    })

    it("test Chatbot response return 200", async () => {
        const response = await request(baseURL).get("/api/question/?q=%E0%B8%AE%E0%B8%B2%E0%B9%82%E0%B8%AB%E0%B8%A5&_")
        expect(response.statusCode).toBe(200)
        expect(response.body.responseText).toBe("คุณพิมพ์สุ่มมาใช่ไหม :)")
    })
});
