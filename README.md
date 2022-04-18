# PasuNashi

First of all, this is **NOT** a secure password manager, since key to decrypt everything on the database is stored as an environment variable on the backend server.

This is a personal project in which I put all my effort to learn a lot of technologies, some new, and some not so much, like React Hooks, Typescript, Redux and its Hooks, and many more.

I always tried to follow standards, and respect good practices (something that I hadn't yet gotten used to...).

My original intention was to use Next JS for this project, but I ended up diciding to use React JS due to some problems I could'nt solve, and that I didn't know well how to handle the authentication in Next JS.

Whithout further ado, lets start with the documentation:

You can check out the docs generated with JsDocs on [this link](https://pasusewa.github.io/Web-Frontend/).

---

## How to initialize the project

First of all, you will need to properly set up the .env.local file. This projects include a .env.example file which shows what variables you need to fill up.

##### All the variables needed in the environment are the following:

1. REACT_APP_ENV_LOCAL: If there is nothing, the app will asume that the environment is "production", else, if there is anything, the app will change to "local" / "development" environment.
   <br/>
   <br/>
2. REACT_APP_USE_LOCAL_API: If empty, the app will call the production api, else, it will use http://localhost:8000/api (see src/hooks/useApi.ts to change the base uri for both options).
   <br/>
   <br/>
3. REACT_APP_RECAPTCHA_SITE_KEY & REACT_APP_RECAPTCHA_SECRET_KEY: These are required to use the Captcha component, you can get them by signing up here: [Google ReCaptcha Admin Site](https://www.google.com/recaptcha/admin)
   <br/>
   <br/>
4. REACT_APP_PAYPAL_CLIENT_ID: This is your client ID for PayPal, you can get it on the [Developers Paypal](https://developer.paypal.com) site. Once signed up, create an application, and then go to the "live" credentials.
   No secret key is required to use the magic buttons of PayPal.
   <br/>
   <br/>
5. REACT_APP_COINBASE_API_KEY: This is required to use the Coinbase API in order to let the user pay with cryptos.
   You can get your Coinbase credentials on [Coinbase Commerce](https://commerce.coinbase.com).
   <br/>
   <br/>
   Once you are done with all of that, the last thing is to run the following:

    `npm install`

---

## Folder Structure

I don't know if this is a good practise or not, but I tried keep everything as simple as possible.

Basically, all the components that don't require a unit test, and don't use styles from Material-UI, are stored in their respective file, with the name of the component as the name of the file.

Then, the components that do have a test, and / or use the Material-UI styles, are stored in a folder with the name of the component, with the test named as `componentName.test.tsx`, and styles as `styles.ts`.

And lastly, there are a few components that aren't being used outside of their parent components, and those are stored inside of the folder of the parent component (for example the Drawer component, which is stored in src/components/Navbar/Drawer since it isn't used outside of the navbar).

---

## Project Dependencies

[Material UI](https://material-ui.com/) - As the UI

[Fontawesome](https://fontawesome.com/) - For the icons

[Dexie](https://www.npmjs.com/package/dexie) - To handle all the interactions with Indexed DB (I don't recomment using it, its really simple to use, but very limited in my opinion).

[react-google-recaptcha](https://www.npmjs.com/package/react-google-recaptcha) - As the Captcha component

[react-hook-form](https://www.npmjs.com/package/react-hook-form) - To handle all the forms

[react-paypal-button-v2](https://www.npmjs.com/package/react-paypal-button-v2) - To create PayPal's magic buttons

[react-qrcode-logo](https://www.npmjs.com/package/react-qrcode-logo) - For the QR codes

[react-redux](https://www.npmjs.com/package/react-redux) - To handle the global state

[JsDocs](https://www.npmjs.com/package/jsdocs) and [gh-pages](https://www.npmjs.com/package/gh-pages) - For the documenation

And lastly, this is not a dependency perse, but since I had a lot of problems using the package i18n, I decided to follow [this tutorial](https://www.youtube.com/watch?v=GtaKTDNQ6vo&list=PLXlNY59rhzeIlEiTIznuqji-ORgKjEhGa) to make the translation system.
