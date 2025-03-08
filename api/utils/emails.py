import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .env import EMAIL,KEY_EMAIL
from fastapi.exceptions import HTTPException
from fastapi import status

class Email:
    def __init__(self):
        self.smtp_server = 'smtp.gmail.com'
        self.smtp_port = 587
        self.smtp_user = EMAIL
        self.smtp_password = KEY_EMAIL
        
    def send_email(self,receiver, subject, body):
        
        # Creación del mensaje de correo electrónico
        msg = MIMEMultipart()
        msg['From'] = self.smtp_user
        msg['To'] = receiver
        msg['Subject'] = subject

        # Cuerpo del mensaje
        msg.attach(MIMEText(body, 'plain'))

        # Enviar el correo electrónico
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            server.sendmail(self.smtp_user, msg['To'], msg.as_string())
            server.quit()
            return True
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Email not sent. Error: "+str(e))
        

    def send_email_validate_user(self,receiver, code):
        subject = 'Validación de usuario'
        body = f'Codigo de validacion: {code}'
        self.send_email(receiver, subject, body)
        
    def send_email_validate_voter(self,receiver, code):
        subject = 'Validación de votante'
        body = f'Codigo de validacion: {code}'
        self.send_email(receiver, subject, body)