# Configuring the Site

The config folder contains the configuration files for the website. One of my goals with this website was to make it accessible to anyone who wanted to host it with their own information. With this in mind, the client is entirely configurable using the `config.json` file. All you have to do is enter your own data into the `config_template.json` file (and then rename it to `config.json`) or replace the data in the `config.json` file.

## Mandatory Fields

The `config.json` file includes mandatory fields that need to be filled in before deploying the site. The two mandatory fields are:

- `productionClientUrl`: The URL of the client server when it is deployed.
- `productionServerUrl`: The URL of the server when it is deployed.

## Plausible Analytics

The `config.json` file also includes a field for configuring Plausible Analytics. If you don't want to use Plausible Analytics, you can leave this field blank. If you do want to use Plausible Analytics, you can get your information from the Plausible Analytics dashboard and add it to the `config.json` file. The `analytics` field includes two sub-fields:

- `dataDomain`: The domain name that you want to track.
- `analyticsSrc`: The URL of the Plausible Analytics script.

## Connect Page

The connect page on the website includes links to your social media profiles. The `config.json` file includes a field for adding your social media links. The supported links on the connect page are:

- github
- linkedin
- twitter
- instagram
- youtube
- gitlab
- codepen

You can add your own links to the `config.json` file by updating the `links` array in the `connect` section. For each link, you need to specify the `name` of the social media platform and the `url` to your profile on that platform.

## Server

All configuration for the server is done to the `.env` file in the `server` directory. Refer [here](../server/README.md#environment-variables) for more on the environment variables. This file needs to be with the release executable when it is deployed but updated with the info for your deployment and a strong admin password.
