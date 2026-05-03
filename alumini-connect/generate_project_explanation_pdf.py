from pathlib import Path
import textwrap


TITLE = "Alumni Connect Portal Project Explanation"

CONTENT = """
Project Overview

Your project is an Alumni Connect Portal. Its main purpose is to connect students with alumni of the same institution so students can get guidance, build professional networks, and discover job opportunities shared by alumni.

In simple words, this project solves a real college problem:
- Students often do not know how to reach alumni.
- Alumni want to help, but there is no simple platform.
- Opportunities and guidance stay scattered in WhatsApp groups or personal contacts.

So your platform creates one place where:
- Students can register and search alumni.
- Students can send connection requests.
- Alumni can accept or decline requests.
- Alumni can post job opportunities.
- Both can chat after a connection is accepted.

How To Explain It To Your Teacher

You can explain it like this:

My project is a full-stack web application called Alumni Connect Portal. It is designed to bridge the gap between current students and alumni. In this system, users can register either as a student or as an alumni. Students can browse alumni profiles, search by name, company, location, course, or institution, and send connection requests with a message. Alumni can receive these requests, accept or decline them, and also post job opportunities. Once a connection request is accepted, both users can chat inside the portal.

Technically, I built the frontend using HTML, CSS, and Vanilla JavaScript. The backend is built using Node.js and Express.js. MongoDB is used as the database, and Mongoose is used for schema modeling. For authentication and authorization, I used JWT. Passwords are hashed using bcrypt before storing them in the database.

The project has role-based access control. For example, only alumni can post jobs, and only students can send connection requests. This makes the platform secure and role-specific.

Overall, the system helps students get mentorship, networking support, and job opportunities from alumni in an organized way.

Best Order To Present

1. Problem statement: Students and alumni do not have a structured platform to connect.
2. Objective: To create a portal for networking, mentorship, and job sharing.
3. Users: Two types, student and alumni.
4. Main features: Registration, login, profile management, alumni browsing, connection requests, job posting, network view, and chat.
5. Tech stack: HTML, CSS, JavaScript, Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.
6. Working flow: Register, login, browse alumni and jobs, send request, accept request, chat.
7. Security: JWT auth, password hashing, protected routes, role-based middleware.
8. Conclusion: This project digitizes alumni-student interaction and makes career support easier.

Main Modules In Your Project

- Authentication module: Register, login, JWT token generation, protected profile access.
- User and profile module: Alumni and student profiles with name, course, institution, company, location, bio, and graduation year.
- Alumni directory: Students can search alumni and filter by institution.
- Connection request module: Students send requests, alumni receive them, alumni accept or decline them.
- Network module: Accepted connections become part of the user network.
- Job module: Alumni can post jobs, and students can browse and view job details.
- Messaging module: Chat is available only for accepted connections.

Technical Architecture

- Frontend: Static pages such as index, login, register, dashboard, alumni, jobs, and chat pages.
- Frontend logic: Vanilla JavaScript handles API calls, authentication storage, rendering, and interactions.
- Backend: Express server with routes, controllers, middleware, and models.
- Database: MongoDB stores users, jobs, connection requests, and messages.
- Authentication: JWT token stored in localStorage.
- Authorization: Middleware checks whether a user is logged in and whether the role is student or alumni.

Database Collections and Models

- User: Stores student or alumni details, email, password, role, bio, institution, company, and other profile data.
- Job: Stores job title, company, location, description, contact info, and who posted it.
- ConnectionRequest: Stores student id, alumni id, request message, and status as pending, accepted, or declined.
- Message: Stores connection id, sender, receiver, and chat text.

How The Flow Works

- A user registers as either student or alumni.
- Login returns a JWT token.
- Protected routes use that token for validation.
- A student can search alumni and send a connection request.
- An alumni can see incoming requests and update the status.
- Once a request is accepted, it appears in both users' network section.
- Then chat becomes available between both users.
- Alumni can also post jobs, and students can use the job details to contact or connect.

Strong Points Of Your Project

- It solves a real academic and career networking problem.
- It supports two different user roles.
- It has role-based permissions.
- It uses a proper full-stack architecture.
- It includes CRUD operations.
- It includes authentication and authorization.
- It includes real workflow logic, not just static pages.
- It supports search, connection building, and messaging.

Limitations And Future Scope

- Real-time chat is not implemented yet; current chat is request-response based.
- No email verification or password reset.
- JWT is stored in localStorage, which can be improved in production.
- No admin panel yet.
- File upload or profile picture feature is not added.
- Job application tracking is not added.
- Search can be improved further with advanced filters.

What Teacher Can Ask

1. Why did you choose this project?
Because alumni-student interaction is very useful for mentorship and placement support, but in many colleges it is unorganized. I wanted to build a practical platform that solves this.

2. What is the main objective of your project?
To create a portal where students can connect with alumni, get guidance, and explore opportunities shared by alumni.

3. Who are the users of this system?
There are two users: students and alumni.

4. Why did you use Node.js and Express?
Because Node.js is efficient for web applications, and Express makes it easy to create REST APIs and manage routes and middleware.

5. Why did you use MongoDB?
MongoDB is flexible and works well for document-based data like users, jobs, messages, and connection requests.

6. Why did you use Mongoose?
Mongoose helps define schemas, validate data, and manage relationships between collections more easily.

7. Why did you use JWT?
JWT is used for authentication. After login, it helps verify the user on protected routes without storing session data on the server.

8. Why did you hash passwords?
To improve security. Passwords should never be stored in plain text, so bcrypt is used to hash them.

9. How do you differentiate student and alumni actions?
By using the role field and middleware. For example, only alumni can post jobs, and only students can send connection requests.

10. What is role-based access control in your project?
It means different users have different permissions based on role. This is enforced using middleware on the backend.

11. How is chat controlled?
Users can chat only if there is an accepted connection request between them.

12. What happens when a student sends a request?
A connection request is stored with status pending. Alumni can later accept or decline it.

13. What happens after a request is accepted?
The connection appears in both users' network section, and chat becomes available.

14. How does job posting work?
Only alumni can access the job posting API. They submit job details, which are saved in the Job collection.

15. What are the API routes in your project?
Auth routes, user routes, job routes, connection routes, and message routes.

16. What is middleware in Express?
Middleware is a function that runs before the final request handler. In this project it is used for token verification and role checking.

17. What are the collections in MongoDB for this project?
Users, Jobs, ConnectionRequests, and Messages.

18. What kind of relationships are used?
Reference-based relationships using ObjectId. For example, jobs reference the user who posted them, and messages reference a connection and sender or receiver.

19. What validations did you use?
Required fields, password length, unique email, allowed request status, role checking, and non-empty messages.

20. How is the frontend connected to backend?
Using JavaScript fetch API calls to backend endpoints like /api/auth, /api/jobs, /api/connections, and /api/messages.

21. Where is the token stored?
In localStorage.

22. What are the drawbacks of storing token in localStorage?
It can be vulnerable to XSS if the app is not properly secured. In production, HTTP-only cookies are often safer.

23. What if an unauthorized user tries to access protected routes?
The middleware checks for a valid Bearer token and returns an unauthorized error if it is missing or invalid.

24. What if a student tries to post a job?
The alumniOnly middleware blocks the action and returns a forbidden response.

25. What if an alumni tries to send a connection request?
The studentOnly middleware prevents that action.

26. What makes your project different from a simple CRUD app?
It is workflow-based. It includes role-based logic, connection approval, networking, and controlled messaging, not just add, view, update, and delete operations.

27. What future improvements can be added?
Real-time chat with Socket.IO, notifications, admin panel, profile image upload, email verification, resume upload, and better search filters.

If Teacher Asks For Internal Working

When a user registers, data is stored in MongoDB. The password is hashed using bcrypt before saving. During login, credentials are checked and JWT is generated. The frontend stores the token and sends it in the Authorization header for protected API requests. The backend middleware verifies this token and identifies the logged-in user. Based on role, the system allows or blocks certain actions like posting jobs or sending requests.

Short Viva Answer For "Explain Your Project"

My project is Alumni Connect Portal, a full-stack web application made for connecting students with alumni. It has two roles: student and alumni. Students can register, browse alumni profiles, send connection requests, and explore jobs posted by alumni. Alumni can accept or decline requests, post job opportunities, and chat with students after connection is accepted. I built the frontend using HTML, CSS, and JavaScript, and the backend using Node.js, Express.js, and MongoDB. For security, I used JWT authentication and bcrypt password hashing. The project helps create a structured digital network between students and alumni for mentorship and career support.

How To Impress Teacher

Use terms like role-based authentication, REST API, protected routes, schema validation, full-stack architecture, real-world problem statement, and scalable future scope.

Final Tip

Do not try to explain every file. Explain in this order: problem, solution, users, features, tech stack, working, security, and future scope.
"""


def wrap_paragraphs(text: str, width: int = 92) -> list[str]:
    lines: list[str] = []
    for raw in text.strip().splitlines():
        line = raw.rstrip()
        if not line:
            lines.append("")
            continue
        if line.startswith("- ") or line[:2].isdigit() and line[1] == ".":
            wrapped = textwrap.wrap(
                line,
                width=width,
                subsequent_indent="   ",
                break_long_words=False,
                break_on_hyphens=False,
            )
            lines.extend(wrapped or [""])
        else:
            wrapped = textwrap.wrap(
                line,
                width=width,
                break_long_words=False,
                break_on_hyphens=False,
            )
            lines.extend(wrapped or [""])
    return lines


def escape_pdf_text(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("(", "\\(")
        .replace(")", "\\)")
    )


def build_pdf(text_lines: list[str]) -> bytes:
    page_width = 595
    page_height = 842
    margin_x = 50
    start_y = 790
    line_height = 16
    bottom_margin = 55
    pages: list[list[str]] = []
    page: list[str] = []
    y = start_y

    title_block = [TITLE, ""]
    all_lines = title_block + text_lines

    for line in all_lines:
      if y < bottom_margin:
          pages.append(page)
          page = []
          y = start_y
      page.append(line)
      y -= line_height

    if page:
        pages.append(page)

    objects: list[bytes] = []

    def add_object(data: str | bytes) -> int:
        obj_id = len(objects) + 1
        if isinstance(data, str):
            data = data.encode("latin-1", errors="replace")
        objects.append(data)
        return obj_id

    font_id = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    page_ids: list[int] = []
    content_ids: list[int] = []
    pages_id_placeholder = len(objects) + 1

    for page_number, page_lines in enumerate(pages, start=1):
        commands = ["BT", "/F1 12 Tf"]
        y = start_y
        for index, line in enumerate(page_lines):
            font_size = 16 if page_number == 1 and index == 0 else 12
            if page_number == 1 and index == 0:
                commands.append(f"/F1 {font_size} Tf")
            else:
                commands.append("/F1 12 Tf")
            commands.append(f"1 0 0 1 {margin_x} {y} Tm")
            commands.append(f"({escape_pdf_text(line)}) Tj")
            y -= line_height
        commands.append("ET")
        stream = "\n".join(commands).encode("latin-1", errors="replace")
        content_id = add_object(
            b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream"
        )
        content_ids.append(content_id)
        page_id = add_object(
            f"<< /Type /Page /Parent {pages_id_placeholder} 0 R /MediaBox [0 0 {page_width} {page_height}] "
            f"/Resources << /Font << /F1 {font_id} 0 R >> >> /Contents {content_id} 0 R >>"
        )
        page_ids.append(page_id)

    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    pages_id = add_object(f"<< /Type /Pages /Kids [{kids}] /Count {len(page_ids)} >>")
    catalog_id = add_object(f"<< /Type /Catalog /Pages {pages_id} 0 R >>")

    pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for obj_number, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{obj_number} 0 obj\n".encode("ascii"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    pdf.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\nstartxref\n{xref_offset}\n%%EOF".encode(
            "ascii"
        )
    )
    return bytes(pdf)


def main() -> None:
    output_path = Path("Alumni-Connect-Project-Explanation.pdf")
    wrapped_lines = wrap_paragraphs(CONTENT)
    pdf_bytes = build_pdf(wrapped_lines)
    output_path.write_bytes(pdf_bytes)
    print(output_path.resolve())


if __name__ == "__main__":
    main()
