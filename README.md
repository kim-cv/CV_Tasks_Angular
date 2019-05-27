# What is this

This is two repositories for my CV to display how I would construct a simple task app with Angular and Firebase.

Q: Is it complete?  
A: It works but there is still elements that needs to be refined and completed.

Q: Is it screensize responsive?  
A: It uses Bootstrap grid layout but its not set up to be all screensize + mobile friendly. Maybe in the future.


## This Angular repository includes the following
* Usage of Firebase Auth and Firebase Hosting.
* Lazy loaded modules/components.
* 1 Custom formgroup validator.
* 1 Pipe for shortening long strings and appending dots.
* 1 Route guard used to lock access if not logged in.
* 1 Service used to communicate with the backend API which is hosted on Firebase Cloud Functions.
* 2 Angular Animations and 1 CSS animation because it looks fancy 😋


## The API repository includes the following
* Firebase Auth, Firebase Firestore and Firebase Cloud Functions.
* Usage of ExpressJS to deploy a whole API on Cloud Functions.
* A few unittests for the task models and controller.



# Installation
## General
1. Create a new project at https://console.firebase.google.com/ and add a web app with Firebase Hosting to your project.
2. Info: When adding Firebase hosting you dont have to add any extra scripts as everything is already supplied in the project. Regarding deploying we'll get to that later.
3. Go to Project Overview -> cog"icon" -> Project Settings -> Service Accounts -> Firebase Admin SDK
4. Below "Admin SDK configuration snippet" choose Node.js and click "Generate new private key" and save it somewhere safe.
5. Create a Firestore database for our project and for security rules choose "locked mode".
6. In Authentication goto "Sign-in Method" and enable "Email/Password" but keep passwordless disabled.



## For the Angular project
Code found here https://github.com/kim-cv/CV_Tasks_Angular  
1. In the root folder run the command "npm i"
2. In folder "src" create new folder "environments" and create two new files "environment.ts" "environment.prod.ts"
3. In environment.prod.ts add content
```javascript
export const environment = {
    production: true
}
```

4. In environment.ts add content
```javascript
export const environment = {
    production: false,
    apiUrlDev: '',
    firebase: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
    }
}
```

6. In your project at https://console.firebase.google.com/ Next to Project Overview click the settings cog"icon" and choose "Project Settings"
7. Click "General" and find your app in "Your apps" section and below "Firebase SDK snippet" choose "Config"
8. Replace each key value into their right spot inside our file "environment.ts", remember they must be put in the "firebase" section.
9. In the root folder use the commands "firebase list" and "firebase use" to link your code with your Firebase project.
10. In the root folder run the command "npm run deploy" to deploy the project to Firebase Hosting.



## For the API project
Code found here https://github.com/kim-cv/CV_Tasks_API  
1. In folder "functions" run the command "npm i"
2. In folder "functions" create a new folder "environments" and inside that folder create a new file "environment.ts" with content
```javascript
export const environment = {
    production: false,
    firebase: {
        databaseURL: ''
    }
};
```
3. Goto our Angular Project "environment.ts" file and copy the value from the key "databaseURL" and paste it into the key "databaseURL" in our API project "environment.ts" file.
3. The private key you generated earlier, rename that to "service-account-credentials.json" and put it inside the folder "functions"
4. In folder "functions" use the commands "firebase list" and "firebase use" to link your code with your Firebase project.
5. In folder "functions" first run the command "npm run deploy_indexes" and then run the command "npm run deploy" this will first create a composite index in your Firestore database and then deploy the API to your Firebase project.
6. After your API is deployed to go your project at https://console.firebase.google.com/ -> Functions -> Dashboard. Copy the URL from the Trigger column and open your Angular project, open the file "environment.ts" and paste the URL into the key "apiUrlDev". Please make sure the URL ends with a forward slash. If you have already deployed your Angular project, you must deploy it again.