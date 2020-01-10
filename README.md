### The hammerdirt! app

#### Purpose

This is a progressive-web-app. Designed as an admin portal and landing page. It is one part of the hammerdirt! infrastructure. 

#### Use

This app is part of the hammerdirt! infrastructure. Authenticated users can log survey results and write articles. System admin is not handled through this app.

### The hammerdirt infrastructure:

These are the main components of the hammerdirt! infrastructure:

1. Data storage and distribution through the API:
  * api url: [https://mwshovel.pythonanywhere.com/](https://mwshovel.pythonanywhere.com/)
  * repo: [https://github.com/hammerdirt/hammerdirt_api](https://github.com/hammerdirt/hammerdirt_api)
  * Authenticated members can enter survey data and edit articles
  * Provides endpoints for client apps
  * Powered by Django REST
2. Data entry and management:
  * url: [https://www.hammerdirt.ch/](https://www.hammerdirt.ch/)
  * repo: this repo
  * Has access to POST and PUT endpoints
  * Includes WYISWYG editor by TinyMCE
  * Forms for entering survey data and commenting on articles
  * Built with ReactJS
3. Data visualisation, communication:
  * url: [https://www.plagespropres.ch/](https://www.plagespropres.ch/)
  * repo: [https://github.com/hammerdirt/client_pwa](https://github.com/hammerdirt/client_pwa)
  * Has access to GET endpoints
  * Built with ReactJS
4. Version control and collaboration:
  * version control : Git
  * collaboration: GitHub
  * url:[https://github.com/hammerdirt](https://github.com/hammerdirt) 

### About hammerdirt!

Hammerdirt! is a non-profit organisation based in Switzerland and dedicated to the collection, analysis and distribution of environmental data.

### About this app

This app is specifically designed to provide data-entry and text editing capabilities for ongoing environmental surveillance projects. Display and communication happens through the client app.

1. Manages the services for multiple projects
2. Provides authentication and access to POST/PUT requests to the API
3. Houses all documents for all projects. 

### Contributing 

1. Log your issues through GitHub in the usual way
2. If you have a fix submit a pull request 

### Joining hammerdirt!

1. see hammerdirt.ch in the docs tab "members"
