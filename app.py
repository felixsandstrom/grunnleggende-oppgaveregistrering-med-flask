from app import create_app
import os
import sys

print("Python executable being used:", sys.executable)
app = create_app()

if __name__ == '__main__':
    # Check the environment variable to determine the debug model
    if os.getenv('FLASK_ENV') == 'development':
        app.run(debug=True)
    else:
        app.run(debug=False)


