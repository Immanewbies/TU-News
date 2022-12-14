describe('TU News main page', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000')
    })

    it('should display adminlogin button', async() => {
        await page.goto('http://localhost:3000')
        await page.$eval('a#btnlogin', element => element.click());
        expect(page.url()).toBe('http://localhost:3000/AdminLogin');
    })

    it('should display chatbot button', async() => {
        await page.goto('http://localhost:3000')
        await page.click('button.open-button')

        //expect()
    })

    it('should Display Login Admin Page on click button', async () => {
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
describe('Login Page',()=> {
    beforeAll(async ()=>{
        await page.goto('http://localhost:3000/AdminLogin');
    })
    it('should Display Login Admin Page By login fail', async () => {
        await page.type('input.user-box', "Admin1");
        await page.type('input.pass-box', "Admin");
        await Promise.all([
            // await page.click('Button.button'),
            // await page.waitForNavigation()
            page.$eval('Button.button', element =>
                element.click()
            )
        ])
        expect(await page.$eval('Span#errorName', el => el.textContent)).toBe('Username or Password Incorrect');
    })

    it('should Display AdminPage By login pass', async () => {
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

describe('Admin Page',()=> {
    beforeAll(async ()=>{ 
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

describe('EventManage Page',() => {
    beforeAll(async ()=>{
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

describe('seeAllNews Page',() => {
    beforeAll(async ()=>{
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

   /* it('should Display Pop-up while click readmore ', async() => {
        
        await Promise.all([
            await page.waitForSelector('button#o37', { visible: true }),
            await page.$eval('button#o37', element =>
                element.click()
            )
        ])
        const gettext = await page.$eval('h4', (el) => el.innerText)
        expect(gettext).toBe('newsd')


    })*/

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

describe('seeAllEventsAdmin Page',() => {
    beforeAll(async ()=>{
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
