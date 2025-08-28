# Hydratr - Water Intake Tracker

A modern, responsive web application for tracking daily water intake and maintaining hydration goals.

## Features

- **Daily Water Logging**: Track your water intake throughout the day with customizable amounts
- **Progress Visualization**: Real-time progress bars and weekly charts to monitor your hydration habits
- **Goal Setting**: Set personalized daily hydration goals
- **Streak Tracking**: Monitor consecutive days of meeting your hydration goals
- **Quick Log Options**: Fast logging with preset amounts (250ml, 500ml, 1L, 1.5L)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Export**: Export your hydration data as PDF reports or JSON
- **Smart Notifications**: Gentle reminders to stay hydrated throughout the day

## Technology Stack

- **Backend**: Flask (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **Charts**: Chart.js for data visualization
- **Authentication**: Flask-Login for user sessions
- **PDF Generation**: ReportLab for export functionality

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize the database:
   ```bash
   python init_db.py
   ```
4. Run the application:
   ```bash
   python app.py
   ```

The application will be available at `http://localhost:5001`

## Usage

1. **Sign Up**: Create a new account or log in with existing credentials
2. **Set Goals**: Configure your daily hydration goal in the profile settings
3. **Log Water**: Use the input form or quick log buttons to record water intake
4. **Track Progress**: Monitor your daily progress and weekly trends
5. **Export Data**: Generate PDF reports or export data as JSON

## Project Structure

```
hydratr-enhanced/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── routes/               # Route handlers
│   ├── auth.py          # Authentication routes
│   ├── dashboard.py     # Main dashboard functionality
│   └── export.py        # Data export features
├── static/              # Static assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── icons/          # Application icons
├── templates/           # HTML templates
├── utils/              # Utility functions
└── instance/           # Database and uploads
```

## Configuration

The application supports multiple environments through configuration classes:

- **Development**: Debug mode enabled, verbose logging
- **Testing**: In-memory database, CSRF disabled
- **Production**: Optimized for deployment

Environment variables:
- `FLASK_CONFIG`: Set to 'development', 'testing', or 'production'
- `SECRET_KEY`: Application secret key for sessions
- `DATABASE_URL`: Database connection string

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

