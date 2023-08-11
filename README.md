# Example of RESTful API with NestJS and TypeORM

## Requirements

- Node.js >=16.6.0
- NPM >=7.19.1
- MySQL


## Deployment

1. Clone the application from the repository.

2. Install dependencies:

        npm ci

3. Create the .env file by copying the .env.example file:

	    cp .env.example .env

4. Specify the port, JWT key and database connection settings in the .env file.

5. Create database:

		sudo mysql -uuser -ppass
		> CREATE DATABASE `nest-articles-app` CHARACTER SET utf8 COLLATE utf8_general_ci;
		> exit

	Replace user and pass with your username and password, respectively.

6. Run migrations and seeds:

    	npm run migration:run
    	npm run seed:run

The next steps will be different for development and production modes.

### Development mode

1. Launch the application:

	    npm run start:dev

### Production mode

1. Create the application build:

	    npm run build

2. Launch the application:

	    npm run start:prod


## Testing

### Unit testing

1. Run tests:

	    npm run test

### End-to-end testing

1. Create database:

		sudo mysql -uuser -ppass
		> CREATE DATABASE `nest-articles-app_test` CHARACTER SET utf8 COLLATE utf8_general_ci;
		> exit

	Replace user and pass with your username and password, respectively.

2. Run tests:

	    npm run test:e2e
