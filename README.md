# HackTUES-PoC
HackTUES proof of concept for using node
##Website functionalities:

###User
  - Register
  - Login
  - Change any kind of data
  - Can adequately create a new team trhough a form
  - Can change team details
  - Receives system messages, which can inlcude invites to join team. User can join a team if invited.
  
###Admin
  - Exclusive admin page
  - See all users
  - Add pages
  - Add news
  
###Teams
  - Teams are listed in a separate page
  - Team members can invite users
  - Have 
    - name
    - creator
    - captain
    - members
    - member invites
    - project name
    - project description
    - technology used

###Adding pages
  - Pages have their own name
  - Pages have their own href
  - Pages have their own html
  - Pages are rendered in a template

###Navigation
  - Navigation renders all pages, that have the nav flag set to 'true'
  - Added dynamically

###News can now be added
  - Title
  - Content
  - Date

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
  
  Start server with 'npm server.js'.
  
  For dynamic changes install nodemon. It restarts the server, when a file is edited.  
  
  Start server with 'nodemon server.js'.
  
  You would probably want to change the port on which the server listens. Change it in server.js.
