# Mission Ready - Mission 3

### Build a DevOps pipeline for your API

Build a pipeline that deploys your API from Mission 1 or 2 to a cloud automatically. You need to build the pipeline using Github Actions so that as soon as you “git push” a new version of the code to your Github repository, the new code will automatically get deployed to Microsoft Azure or Google Cloud, and your new version of API is available on the cloud. Also automate the running of unit tests as part of the pipeline.

# About

That was the first time I got a fair understandment of Cloud services. Still a lot to learn and catch up, but once you get the gist of it a lot of possibilities comes to mind.

I kept using Google Cloud services. This time I deployed the [Mission 1 API](https://github.com/T-Tavares/mission-1) into Google Cloud Functions using Github Actions pipeline.

# Instructions

### Step 1

I'm assuming you followed the instructions on Mission 1 and 2 and by now already have a Google Cloud setup sorted. We are goning to create another [Create a New Project](https://console.cloud.google.com/projectcreate) on the cloud console

### Step 2

Here we're going to [create a Service Account](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project) and a Key (I choose the JSON format.) Pretty standard but worth to say, be careful with that json credential file.

### Step 3

Now those credentials will go to your Github Actions Secrets.
On your repo go to > Settings > Secrets and Variables > Actions
Hit "New Repository Secret" paste the json in there and name it.
This name HAVE TO MATCH how you're calling it on your yml file. On this project is sitting on .github/workflows/gCloudDeploy.yml line 19

```
    with:
        credentials_json: ${{ secrets.GCP_CREDENTIALS }}
```

### Step 4

You'll need to update the project with your own Google Cloud and ID's. I'll point the files and lines you'll find them on this project.

.github/workflows/gCloudDeploy.yml line 25
and
.github/workflows/gCloudDeploy.yml line 33

```
    project_id: <your project id>
    ...
    --project <your project id>

```

package.json line 9 (More about this script and what it does on the next topic.)

```
    "inlineDeploy": "gcloud functions deploy turnersAPI --entry-point turnersAPI --runtime nodejs20 --trigger-http --project <your project id>",

```

### Step 5

This is my scripts set up and here is the reason Google Cloud Functions was so easy to setup.

```
    "scripts": {
        "localGFunc": "npx functions-framework --target=turnersAPI",
        "inlineDeploy": "gcloud functions deploy turnersAPI --entry-point turnersAPI --runtime nodejs20 --trigger-http --project tavares-mission-3",
        "forcePush": "git add .\ngit commit --amend --no-edit\n git push -f"
    },
```

Running

    npm run localGFunc

Will create the server locally. I used that to start building this project and check if everything was working.

Running

    npm run inlineDeploy

As the name says, it'll deploy your code to Google Cloud Functions. ( We are adding it to our yml file for the magic to happen.)

Running

    npm run forcePush

Is just a way to not have 999x commits for every little change or test I was doing.

This code looks a bit scary, but is quite straighforward and easy once you understand it. I'll break it down.

```
gcloud functions deploy turnersAPI --entry-point turnersAPI --runtime nodejs20 --trigger-http --project tavares-mission-3

gcloud functions deploy <Name of the deployment> --entry-point <Function you're exporting> --runtime <runtime and version> --trigger<-http to get a url and http trigger for that function> --project <your project id>

```

A bit more on that [here](https://cloud.google.com/sdk/gcloud/reference/functions/deploy). But those where the ones that worked for me.

# Code Reviews from

Code Review from ...<>
