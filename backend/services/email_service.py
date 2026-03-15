import os
from dotenv import load_dotenv, find_dotenv
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

load_dotenv(find_dotenv(), override=True)

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
GMAIL_USER = os.getenv("GMAIL_USER", "bloodlink26@gmail.com")

print(f"EMAIL CONFIG: sendgrid_set={SENDGRID_API_KEY is not None}")

def send_donor_request_email(donor_name, donor_email, requester_name, requester_contact, blood_group, location, message=""):
    try:
        print(f"Attempting to send email to {donor_email}")

        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

            <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">BloodLink</h1>
              <p style="color: #fecaca; margin: 8px 0 0;">Urgent Blood Donation Request</p>
            </div>

            <div style="padding: 32px;">
              <p style="font-size: 18px; color: #111; margin-bottom: 8px;">Dear <strong>{donor_name}</strong>,</p>
              <p style="color: #555; line-height: 1.6;">
                Someone urgently needs your help! A patient requires <strong style="color: #dc2626;">{blood_group}</strong> blood and you have been identified as a compatible donor.
              </p>

              <div style="background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #dc2626; margin: 0 0 12px;">Request Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="color: #666; padding: 6px 0; width: 40%;">Blood Group Needed</td><td style="font-weight: bold; color: #dc2626;">{blood_group}</td></tr>
                  <tr><td style="color: #666; padding: 6px 0;">Requester Name</td><td style="font-weight: bold;">{requester_name}</td></tr>
                  <tr><td style="color: #666; padding: 6px 0;">Contact Number</td><td style="font-weight: bold;">{requester_contact}</td></tr>
                  <tr><td style="color: #666; padding: 6px 0;">Location</td><td style="font-weight: bold;">{location}</td></tr>
                  {"<tr><td style='color: #666; padding: 6px 0;'>Message</td><td style='font-weight: bold;'>" + message + "</td></tr>" if message else ""}
                </table>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="tel:{requester_contact}"
                   style="background: #dc2626; color: white; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                  Call Requester Now - {requester_contact}
                </a>
              </div>

              <p style="color: #555; line-height: 1.6;">
                Your donation can save a life. Please contact the requester as soon as possible. Every minute matters!
              </p>
            </div>

            <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">This request was sent via BloodLink - AI-Powered Blood Donation Platform</p>
              <p style="color: #999; font-size: 12px; margin: 4px 0 0;">If you did not expect this email, please ignore it.</p>
            </div>
          </div>
        </body>
        </html>
        """

        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
        from_email = Email(GMAIL_USER)
        to_email = To(donor_email)
        subject = f"Urgent Blood Donation Request - {blood_group}"
        content = Content("text/html", html)
        mail = Mail(from_email, to_email, subject, content)

        response = sg.client.mail.send.post(request_body=mail.get())
        print(f"SendGrid response: {response.status_code}")

        if response.status_code in (200, 202):
            print(f"Email sent successfully to {donor_email}")
            return True
        else:
            print(f"SendGrid error: {response.status_code}")
            return False

    except Exception as e:
        print(f"Email failed with error: {type(e).__name__}: {e}")
        return False