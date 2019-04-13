online-quiz-backend

Firstly, Install MongoDB.

To start quiz-online-backend:

* On localhost:
    run:
        npm install
        npm run start:dev

    Server start on http://localhost:5001

* On Docker:
    Install Docker CE and Docker-compose version >= 3

    run:
        docker-compose up --build
    
    Configurate local host:
        sudo gedit /etc/hosts
        add onlinequiz.com to 127.0.0.1 row

    Server start on http://onlinequiz.com:5001