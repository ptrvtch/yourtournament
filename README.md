# YourTournament #
v0.0.1

YourTournament is a pet project which aims at providing a convenient way to create, organize and keep track of complex competitions where many people are involved.

### Setting up  ###

To set the project up, you'll need Python 3.4, Django 1.9, and Node.js with NPM and Bower installed on your machine.
View full list of dependencies at `requirements.txt` and `bower.json`.

1. Setup a virtual environment for this project so that it won't interfere with your other projects. You can read more about it [here](https://virtualenv.pypa.io/en/stable/installation/).
2. After creating virtualenv, follow these [steps](https://virtualenv.pypa.io/en/stable/userguide/) to create and activate the virtual environment.
3. Use command `'pip install -r requirements.txt` to populate your virtual environment with necessary python packages.
4. In the root folder of the project, run `bower install' to install all your front-end dependencies.
5. Start development server via command `python manage.py runserver 8000` and then proceed to `localhost:8000` in your browser.