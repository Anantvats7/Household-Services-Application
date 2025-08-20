🏠 Household Services Application - V2
📌 Project Statement

It is a multi-user household services platform that connects admins, service professionals, and customers for seamless home servicing and solutions.

The application provides:

  Service discovery
  
  Service requests and management
  
  Role-based dashboards
  
  Background job scheduling with reminders, reports, and exports

👥 Roles and Features
1. Admin

  Superuser (no registration required)
  
  Manage all users (customers & professionals)
  
  Create, update, delete services
  
  Approve professionals after profile verification
  
  Block fraudulent/poorly rated users
  
  Trigger CSV exports

2. Service Professional

  Register/Login
  
  View assigned service requests
  
  Accept/Reject requests
  
  Close completed services
  
  Profile management with ratings/reviews

3. Customer

  Register/Login
  
  Search services (by name, location, pin code)
  
  Create, edit, close service requests
  
  Post reviews/remarks after service completion

📂 Terminologies

  Service: A type of work (e.g., AC servicing, plumbing)
  
  Attributes: id, name, price, time_required, description
  
  Service Request: Request raised by customer for a service
  
  Attributes: id, service_id, customer_id, professional_id, date_of_request, date_of_completion, status, remarks

⚙️ Tech Stack

  Backend: Flask (Python)
  
  Database: SQLite
  
  UI: VueJS + Bootstrap 
  
  Templating : Jinja2
  
  Caching: Redis
  
  Batch Jobs & Scheduling: Celery + Redis

  Mail Testing: Mailhog

📌 Core Functionalities

    ✔️ Authentication & RBAC (Admin, Professional, Customer)
    ✔️ Admin Dashboard for user/service management
    ✔️ Service Requests (create, edit, close)
    ✔️ Search Services & Professionals
    ✔️ Professional Actions (accept/reject/close requests)
    ✔️ Background Jobs:
    
    Daily reminders (Google Chat webhook/SMS/Mail)
    
    Monthly activity reports (HTML/PDF)
    
    CSV export for closed services
    ✔️ Performance & Caching (with expiry)

🚀 Setup Instructions:
  1️⃣ Clone the Repository
  
      git clone <repo-url>
      cd foldername

2️⃣ Create Virtual Environment

    python3 -m venv venv3
    source venv3/bin/activate   # On Mac/Linux
    venv3\Scripts\activate      # On Windows

3️⃣ Install Dependencies

    pip install -r requirements.txt

4️⃣ Start Redis (Mac with Homebrew)

    brew services start redis

5️⃣ Start Mailhog (for email testing)

    mailhog

6️⃣ Run Flask Application

    python app.py

7️⃣ Start Celery Workers

  For worker only:

    celery -A app:celery_app worker --loglevel=info


  For worker + beat (scheduler):

    celery -A app:celery_app worker --loglevel=info --beat
