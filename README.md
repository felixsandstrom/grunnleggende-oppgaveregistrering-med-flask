
# Grunnleggende applikasjon for oppgaveregistrering (Oppgaveportal demo)

## Oversikt
Et enkelt Flask-basert verktøy for registrering og administrering av oppgaver. Applikasjonen gir mulighet til å legge inn oppgaver med tilhørende beskrivelse, prioritet, status, og bilde (lagret i AWS S3).

---

## Funksjoner
- Registrere nye oppgaver med detaljer som type, beskrivelse, prioritet, status og bilde.
- Vise alle oppgaver i en tabellvisning.
- Redigere og oppdatere oppgaveinformasjon.
- Slette oppgaver etter behov.

---

## Forutsetninger
- **Python 3.7 eller nyere**
- Flask og nødvendige pakker (installert via `requirements.txt`)
- En database (SQLite eller annen DB)
- AWS S3-konfigurasjon for bildeopplasting

---

## Databasestruktur
Databasen administreres ved hjelp av **Flask-Migrate**, som gir fleksibilitet ved fremtidige schema-endringer. Tabellen `tasks` opprettes med følgende struktur:

```python
from . import db
from datetime import datetime

class Tasks(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.String(100), nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    priority = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(200))
```

---

## Installasjon

### 1. Klon repositoriet
```bash
git clone https://github.com/dittbrukernavn/grunnleggende-oppgaveregistrering-med-flask.git
cd oppgaveportal
```

### 2. Installer avhengigheter
```bash
pip install -r requirements.txt
```

### 3. Sett opp miljøvariabler
Opprett en `.env`-fil i prosjektets rotmappe og legg til nødvendig informasjon for databasen og AWS S3:
```bash
DATABASE_URL=sqlite:///tasks.db
AWS_ACCESS_KEY_ID=din-aws-key
AWS_SECRET_ACCESS_KEY=din-aws-secret
AWS_S3_BUCKET=din-s3-bucket
```

---

## Opprette og Migrere Databasen

### Initialiser Flask-Migrate
1. **Initialiser Flask-Migrate i prosjektet**:
    ```bash
    flask db init
    ```

2. **Opprett en ny migrasjon**:
    ```bash
    flask db migrate -m "Initial migration for tasks table"
    ```

3. **Utfør migrasjonen for å opprette databasen**:
    ```bash
    flask db upgrade
    ```

Databasen er nå opprettet med `tasks`-tabellen.

---

## Kjør applikasjonen
Start Flask-serveren:
```bash
flask run
```

---

## Bruk
1. Åpne nettleseren og gå til `http://127.0.0.1:5000`.
2. Registrer, vis og administrer oppgavene dine.

---

## Eksempelbilde
![Oppgaveportal eksempel](https://felixsandstrom-github.s3.eu-north-1.amazonaws.com/oppgaveportal.png)

---

## Lisens
Dette prosjektet er lisensiert under MIT-lisensen.
