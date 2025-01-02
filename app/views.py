from flask import Blueprint, render_template, request, jsonify
from .models import Tasks
from . import db
from datetime import datetime
from werkzeug.utils import secure_filename
from .s3_handler import upload_image_to_s3, delete_image_from_s3

views = Blueprint('views', __name__)


@views.route('/save_suggestion_bug', methods=['POST'])
def save_suggestion_bug():
    # Debug: Log the method and headers
    print("Request Method:", request.method)
    print("Request Headers:", request.headers)
    
    # Debug: Log incoming form data and files
    print("Request Form Data:", request.form)
    print("Request Files:", request.files)

    data = request.form
    file = request.files.get('image')
    picture_removed = data.get('picture_removed') == 'true'
    
    try:
        suggestion_bug_id = data.get('id')

        if suggestion_bug_id:
            print("Suggestion Bug ID:", suggestion_bug_id)
            suggestion_bug = Tasks.query.get(suggestion_bug_id)
            if suggestion_bug:
                print("Updating existing Tasks")
                suggestion_bug.type = data['type']
                suggestion_bug.description = data['description']
                suggestion_bug.created_by = data['created_by']
                suggestion_bug.priority = data['priority']
                suggestion_bug.status = data['status']

                # Handle image removal
                if picture_removed and suggestion_bug.image_url:
                    print("Picture removed. Deleting existing image.")
                    delete_image_from_s3(suggestion_bug.image_url)
                    suggestion_bug.image_url = None

            else:
                print("Suggestion or Bug not found in the database")
                return jsonify({'error': 'Suggestion or Bug not found'}), 404
        else:
            print("Creating new Tasks")
            suggestion_bug = Tasks(
                type=data['type'],
                description=data['description'],
                created_by=data['created_by'],
                created_date=datetime.utcnow(),
                priority=data['priority'],
                status=data['status'],
            )
            db.session.add(suggestion_bug)

        # Handle image upload
        if file:
            filename = secure_filename(file.filename)
            print("Uploading file:", filename)
            image_url = upload_image_to_s3(file, 'suggestion_bugs', suggestion_bug.id or 'temp', filename)
            print("Uploaded file URL:", image_url)
            suggestion_bug.image_url = image_url

        db.session.commit()
        print("Tasks saved successfully")
        return jsonify({
            'message': 'Success',
            'id': suggestion_bug.id,
            'created_date': suggestion_bug.created_date.strftime('%Y-%m-%d %H:%M'),
            'image_url': suggestion_bug.image_url
        }), 200
    except Exception as e:
        print("Exception occurred during processing:", str(e))
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@views.route('/')
def home():
    suggestions = Tasks.query.order_by(Tasks.created_date.desc()).all()

    # Define the order of statuses
    status_order = {
        None: 1,
        '': 1, 
        'Still problem': 2,
        'Ready to test': 3,
        'Completed': 4
    }

    priority_order = {
        'HIGH': 1,
        'MEDIUM': 2,
        'LOW': 3,
        None: 4,  
        '': 4 
    }

    # Custom sort function
    def sort_key(suggestion):
        status_value = status_order.get(suggestion.status, 5)  # default to 5 for any unknown status
        priority_value = priority_order.get(suggestion.priority.upper(), 4)  # default to 4 for any unknown priority
        return (status_value, priority_value, suggestion.created_date)

    # Sort filtered suggestions by status, priority, and then by created date descending
    sorted_suggestions = sorted(suggestions, key=sort_key)

    formatted_suggestions = [
        {
            'id': suggestion.id,
            'type': suggestion.type,
            'description': suggestion.description,
            'created_by': suggestion.created_by,
            'created_date': suggestion.created_date.strftime('%Y-%m-%d %H:%M'),
            'priority': suggestion.priority,
            'status': suggestion.status,
            'image_url': suggestion.image_url
        } for suggestion in sorted_suggestions
    ]

    return render_template('main.html', active_page='clients', suggestions=formatted_suggestions)


@views.route('/delete_reporting/<int:id>', methods=['DELETE'])
def delete_reporting(id):
    try:
        delete_reporting_by_id(id)
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        return jsonify({'message': 'Error', 'details': str(e)}), 500

def delete_reporting_by_id(reporting_id):
    reporting = Tasks.query.get(reporting_id)
    if reporting:
        # If there's an image associated, delete it from S3
        if reporting.image_url:
            delete_image_from_s3(reporting.image_url)
        
        db.session.delete(reporting)
        db.session.commit()
    else:
        raise ValueError('Reporting not found')
    


