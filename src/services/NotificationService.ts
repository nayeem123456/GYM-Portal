import { db } from '../core/cache/db/GymCacheDatabase';

export interface AlertNotification {
  id: string;
  type: 'due_payment' | 'expiring_soon' | 'expired' | 'inquiry_followup';
  title: string;
  message: string;
  memberId?: string;
  phone?: string;
  amount?: string;
  severity: 'high' | 'medium' | 'info';
}

export class NotificationService {
  public static getActiveAlerts(): AlertNotification[] {
    const members = db.getMembers();
    const inquiries = db.getInquiries();
    const alerts: AlertNotification[] = [];

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Check members with due payments
    members.forEach(m => {
      const due = parseFloat(m.damount);
      if (due > 0) {
        alerts.push({
          id: `due_${m.memberId}`,
          type: 'due_payment',
          title: `Pending Fee: ${m.name}`,
          message: `Has an outstanding balance of ₹${m.damount} on package ${m.packageName}.`,
          memberId: m.memberId,
          phone: m.phone,
          amount: m.damount,
          severity: 'high'
        });
      }

      // Check expiry dates
      const expDate = new Date(m.edate);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        alerts.push({
          id: `exp_${m.memberId}`,
          type: 'expired',
          title: `Membership Expired: ${m.name}`,
          message: `Package expired ${Math.abs(diffDays)} days ago on ${m.edate}.`,
          memberId: m.memberId,
          phone: m.phone,
          severity: 'high'
        });
      } else if (diffDays <= 5) {
        alerts.push({
          id: `exp_soon_${m.memberId}`,
          type: 'expiring_soon',
          title: `Expiring in ${diffDays} day${diffDays === 1 ? '' : 's'}: ${m.name}`,
          message: `Package ${m.packageName} expires on ${m.edate}. Renewal due soon.`,
          memberId: m.memberId,
          phone: m.phone,
          severity: 'medium'
        });
      }
    });

    // Check inquiries needing follow-up
    inquiries.forEach(inq => {
      if (inq.status !== 'Converted' && inq.status !== 'Lost' && inq.followUpDate <= todayStr) {
        alerts.push({
          id: `inq_${inq.inquiryId}`,
          type: 'inquiry_followup',
          title: `Inquiry Follow-up: ${inq.name}`,
          message: `Scheduled follow-up for interest: ${inq.interest}.`,
          phone: inq.phone,
          severity: 'info'
        });
      }
    });

    return alerts;
  }
}

