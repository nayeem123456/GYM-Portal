// Data models matching the exact SQLite Room tables and DTOs reverse engineered from the APK

export interface CachedMember {
  memberId: string;
  gymOwnerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  trainingType: 'General' | 'Personal' | 'Cardio' | 'Crossfit' | 'Strength';
  packageId: string;
  packageName: string;
  tamount: string; // total amount
  pamount: string; // paid amount
  damount: string; // due amount
  pdate: string;   // payment date (YYYY-MM-DD)
  doj: string;     // date of joining (YYYY-MM-DD)
  edate: string;   // expiry date (YYYY-MM-DD)
  discount: string;
  batchId: string;
  batchName: string;
  trainerId: string;
  trainerName: string;
  isBlocked: number; // 0 = active, 1 = blocked
  regCode: string;
  age: number;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  cached_at: number; // epoch ms
  avatarUrl?: string;
}

export interface CachedMemberPackagePlan {
  memberPackageId: string;
  packageName: string;
  gymOwnerId: string;
  memberId: string;
  packageId: string;
  tamount: string;
  pamount: string;
  damount: string;
  pdate: string;
  edate: string;
  discount: string;
  doj: string;
  discountType: 'flat' | 'percentage';
  tax: number;
  billNo: number;
  admissionFee: number;
  paymentMode: string;
  cached_at: number;
}

export interface CachedMemberServicePlan {
  memberServiceId: string;
  serviceName: string;
  gymOwnerId: string;
  memberId: string;
  serviceId: string;
  tamount: string;
  pamount: string;
  pdate: string;
  cached_at: number;
}

export interface CacheSyncMetadata {
  dataType: string;
  lastSyncedAt: number;
  lastRemoteCheckAt: number;
  remoteLastModifiedAt: number;
  recordCount: number;
}

// Features & Modules
export interface ExpenseDto {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  receiptNumber?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Batch {
  batchId: string;
  name: string;
  startTime: string;
  endTime: string;
  trainerName: string;
  trainerId: string;
  capacity: number;
  activeMembersCount: number;
}

export interface Package {
  packageId: string;
  name: string;
  durationMonths: number;
  price: number;
  admissionFee: number;
  taxPercent: number;
  description: string;
  status: 'active' | 'inactive';
}

export interface Service {
  serviceId: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  status: 'active' | 'inactive';
}

export interface Trainer {
  trainerId: string;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  experienceYears: number;
  status: 'active' | 'on_leave';
  salary: number;
  joinedDate: string;
  avatarUrl?: string;
}

export interface Exercise {
  exerciseId: string;
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  equipment: string;
  defaultSets: number;
  defaultReps: number;
  restSeconds: number;
  instructions: string;
}

export interface WorkoutPlan {
  planId: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  daysPerWeek: number;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    day: string; // e.g., 'Monday - Chest & Triceps'
    sets: number;
    reps: string;
    rest: string;
  }[];
  assignedMemberIds: string[];
}

export interface Meal {
  mealId: string;
  name: string;
  timeOfDay: 'Breakfast' | 'Mid-Morning' | 'Lunch' | 'Evening Snack' | 'Dinner' | 'Post-Workout';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  ingredients: string;
}

export interface DietPlan {
  dietId: string;
  title: string;
  targetGoal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Athletic Performance';
  totalCalories: number;
  meals: {
    mealId: string;
    mealName: string;
    timeOfDay: string;
    portion: string;
  }[];
  assignedMemberIds: string[];
}

export interface MemberMeasurement {
  id: string;
  memberId: string;
  date: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  chestInches?: number;
  waistInches?: number;
  hipsInches?: number;
  bicepsInches?: number;
  thighsInches?: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  regCode: string;
  timestamp: string; // ISO
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  method: 'QR_SCAN' | 'MANUAL' | 'BIOMETRIC';
  status: 'PRESENT' | 'LATE';
}

export interface Inquiry {
  inquiryId: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  date: string;
  followUpDate: string;
  status: 'New' | 'Followed-Up' | 'Converted' | 'Lost';
  notes: string;
}

export interface MessageTemplate {
  templateId: string;
  title: string;
  type: 'Payment Reminder' | 'Welcome' | 'Membership Expiry' | 'Birthday' | 'Special Offer';
  body: string; // Can contain variables like {{name}}, {{amount}}, {{gym_name}}, {{expiry_date}}
}

export interface GymSettings {
  gymOwnerId: string;
  gymName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
  currencySymbol: string;
  razorpayKeyId?: string;
  branches: {
    branchId: string;
    branchName: string;
    location: string;
    phone: string;
  }[];
}

