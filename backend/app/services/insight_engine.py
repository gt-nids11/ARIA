from datetime import datetime, timedelta
from app.models.complaint import Complaint
from app.models.alert import Alert
from app.models.schedule import ScheduleEvent
from sqlalchemy import func

def check_complaint_escalations(db):
    try:
        threshold_date = datetime.utcnow() - timedelta(hours=72)
        escalated_complaints = db.query(Complaint).filter(Complaint.status == "open", Complaint.created_at <= threshold_date).all()
        
        for comp in escalated_complaints:
            # Check if alert already exists to prevent duplicate
            exists = db.query(Alert).filter(Alert.source == f"complaint_{comp.id}").first()
            if not exists:
                days = (datetime.utcnow() - comp.created_at).days
                alert = Alert(
                    title=f"Unresolved Complaint Escalation - {comp.ward}",
                    description=f"Complaint '{comp.title}' has been open for {days} days.",
                    severity="high",
                    suggested_action=f"Immediate review required for ward {comp.ward}. Complaint open for {days} days.",
                    source=f"complaint_{comp.id}"
                )
                db.add(alert)
        db.commit()
    except Exception as e:
        print(e)

def check_upcoming_meetings(db):
    try:
        now = datetime.utcnow()
        threshold = now + timedelta(hours=24)
        upcoming = db.query(ScheduleEvent).filter(ScheduleEvent.start_time >= now, ScheduleEvent.start_time <= threshold, ScheduleEvent.briefing == None).all()
        
        for meeting in upcoming:
            exists = db.query(Alert).filter(Alert.source == f"meeting_{meeting.id}").first()
            if not exists:
                alert = Alert(
                    title=f"Meeting Without Briefing - {meeting.title}",
                    description=f"Meeting '{meeting.title}' is scheduled within 24 hours but has no pre-meeting briefing.",
                    severity="medium",
                    suggested_action=f"Generate pre-meeting briefing before {meeting.start_time}",
                    source=f"meeting_{meeting.id}"
                )
                db.add(alert)
        db.commit()
    except Exception as e:
        print(e)

def check_complaint_clusters(db):
    try:
        clusters = db.query(Complaint.ward, func.count(Complaint.id).label("count")).filter(Complaint.status == "open").group_by(Complaint.ward).having(func.count(Complaint.id) >= 5).all()
        
        for ward, count in clusters:
            exists = db.query(Alert).filter(Alert.source == f"cluster_{ward}").first()
            if not exists:
                alert = Alert(
                    title=f"Complaint Cluster Detected - {ward}",
                    description=f"Ward '{ward}' currently has {count} open complaints.",
                    severity="high",
                    suggested_action=f"Ward {ward} has {count} open complaints. Schedule immediate ward visit.",
                    source=f"cluster_{ward}"
                )
                db.add(alert)
        db.commit()
    except Exception as e:
        print(e)
