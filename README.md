# EXP Looney Shots Game Designer

Static website of the EXP Looney Shots Game Designer experience.

## Main dependencies

- React
- Webpack
- Babel
- Node.js
- NPM or yarn
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html)
- [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

See details of the version requirements in `package.json`.

## Required .env file

A `.env` file is required to compile correctly. Please see `.env.example` for what needs to be defined there.

`CMS_ACCESS_KEY` can be found on the user profile, [API User](https://spacejam-gamedesigner-directus.attexp.com/admin/users/48e7cc63-a149-4271-8b8c-170ec996fc67), in the Directus CMS.

## Development

    npm i

All project dependencies (except for Node/NPM and the AWS CLI) will be installed locally in `/node_modules`.

    npm start

Runs a development server at `localhost:8080` on your machine. The server is also accessible to other devices who are connected to the same network.

The address of the server on your local network depends on the IP of your machine but the port is the same as the `localhost` one. To get the address of the development server on your local network:

    npm run network-info

Entry point of the application is located at `./src/index.js`.

A prettier config file is located at the root of the project so that your IDE can use it to apply linting rules while you're working with the code.

### Special Keyboard Keys
If `config.dev.specialKeys` is set to true, this will enable some dev/debug keys in the gameplay.

These keys should not be enabled in production builds!

## Deployment

    npm version patch

This command will increment the semantic version of the application, run a script to create a production build, and deploy it to AWS.
