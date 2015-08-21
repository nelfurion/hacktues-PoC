# HackTUES-PoC
HackTUES proof of concept for using node
##Website functionalities:

###User
  - Register
  - Login
  - Change any kind of data
  - Little team control
  
###Admin
  - Exclusive admin page
  - See all users
  
###Adding pages
  - Pages have their own name
  - Pages have their own href
  - Pages have their own html (for now we just render the href of the page)

###Navigation
  - Navigation renders all pages, that have the nav flag set to 'true'
  - Added dynamically

##Dependencies

  Just for reference. Only the main(first) passport dependency is used. Others will be removed in a future commit.
  
  "dependencies": {
    "bcrypt-nodejs": "latest",
    "body-parser": "~1.0.0",
    "connect-flash": "~0.1.1",
    "cookie-parser": "~1.0.0",
    "ejs": "~0.8.5",
    "express": "~4.0.0",
    "express-session": "~1.0.0",
    "method-override": "~1.0.0",
    "mongoose": "~3.8.1",
    "morgan": "~1.0.0",
    "passport": "~0.1.17",
    "passport-facebook": "~1.0.2",
    "passport-google-oauth": "~0.1.5",
    "passport-local": "~0.1.6",
    "passport-twitter": "~1.0.2"
  }

##Want to help?

  Clone and open a command window inside the project directory. Install dependencies with 'npm install'.
