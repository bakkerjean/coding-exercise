Exercise description:
- Create an interface that allows a user to login to view its to-do lists (if any).
- The user has the possibility to create a new to-do list.
- The user should be able to delete the to-do lists.
- The total number of the available to-do lists should be visible and updated.
- The user should be able to log out.

Client created with angular cli 8
Server created with express generator (<-- but ended up not using express at all :))
Node v10+

Client - server communication with socket.io
Basic authentication with socketio-auth

To run this project:

git clone git@gitlab.com:bakkerjean/coding-exercise.git

cd client
npm i
ng serve

cd server
npm i
npm start
