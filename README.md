# About the project
This application gets weather forecast by city name (using an API) and shows the Forecasts period, date/time, min temperature, max temperature, wind speed.

# Tech Stack
- Laravel (v9.33.0)
- React JS (v18.2.0)
- MySQL (v^5.6)
- PHP (v^8.0)

# How to install project on local machine

1. Clone the repository
2. Run `composer install`
3. Run `npm install`
4. Create .env file from .env.example
5. In the .env file specify the DB settings corresponding to your environment
6. Run `php artisan key:generate`
7. Run `php artisan config:cache`
8. Run `php artisan migrate:fresh`

NOTE:
The frontend component runs on default port 3000 and the backend component runs on port 8000. Please adjust them to your environment settings if they are different.

# To launch project on dev server
1. Run `npm run dev`
2. Run `php artisan serve`

