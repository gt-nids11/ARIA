export type EntryType = 'field_observation' | 'action_item' | 'escalation' | 'citizen_grievance';
export type Priority = 'high' | 'medium' | 'low';
export type Urgency = 'Immediate' | 'This Week' | 'This Month';
export type EscalationLevel = 'District' | 'State' | 'Central';

export interface BaseEntry {
    id: string | number;
    type: EntryType;
    lat: number;
    lng: number;
    area: string; // Changed from ward to area
    status: string;
}

export interface FieldObservation extends BaseEntry {
    type: 'field_observation';
    title: string;
    description: string;
    category: string;
    priority: Priority;
    date_observed: string;
    observed_by: string;
}

export interface ActionItem extends BaseEntry {
    type: 'action_item';
    zone_name: string;
    action_required: string;
    department: string;
    urgency: Urgency;
    deadline: string;
    created_by: string;
}

export interface Escalation extends BaseEntry {
    type: 'escalation';
    zone_name: string;
    reason: string;
    escalation_level: EscalationLevel;
    department: string;
    supporting_observations: (string | number)[];
    escalated_by: string;
    date_escalated: string;
}

export interface CitizenGrievance extends BaseEntry {
    type: 'citizen_grievance';
    citizen_name: string;
    citizen_contact?: string;
    title: string;
    description: string;
    category: string;
    priority: Priority;
    source: string;
    logged_by: string;
    created_at: string;
}

export type MapEntry = FieldObservation | ActionItem | Escalation | CitizenGrievance;
