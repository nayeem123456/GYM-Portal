import {
  CachedMember,
  CachedMemberPackagePlan,
  CachedMemberServicePlan,
  CacheSyncMetadata,
  ExpenseDto,
  CategoryDto,
  Batch,
  Package,
  Service,
  Trainer,
  Exercise,
  WorkoutPlan,
  Meal,
  DietPlan,
  MemberMeasurement,
  AttendanceRecord,
  Inquiry,
  MessageTemplate,
  GymSettings
} from '../../../types';

const STORAGE_PREFIX = 'gym_cache_db_';

class GymCacheDatabase {
  private static instance: GymCacheDatabase;

  private constructor() {
    this.initializeDefaults();
  }

  public static getInstance(): GymCacheDatabase {
    if (!GymCacheDatabase.instance) {
      GymCacheDatabase.instance = new GymCacheDatabase();
    }
    return GymCacheDatabase.instance;
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      this.updateSyncMetadata(key, Array.isArray(value) ? value.length : 1);
    } catch (e) {
      console.error('Storage error for', key, e);
    }
  }

  private updateSyncMetadata(dataType: string, recordCount: number) {
    const metaList = this.getItem<CacheSyncMetadata[]>('sync_metadata', []);
    const now = Date.now();
    const existingIndex = metaList.findIndex(m => m.dataType === dataType);
    const newEntry: CacheSyncMetadata = {
      dataType,
      lastSyncedAt: now,
      lastRemoteCheckAt: now,
      remoteLastModifiedAt: now,
      recordCount
    };
    if (existingIndex >= 0) {
      metaList[existingIndex] = newEntry;
    } else {
      metaList.push(newEntry);
    }
    localStorage.setItem(STORAGE_PREFIX + 'sync_metadata', JSON.stringify(metaList));
  }

  // --- Members (cached_members) ---
  public getMembers(): CachedMember[] {
    return this.getItem<CachedMember[]>('cached_members', []);
  }

  public saveMember(member: CachedMember): void {
    const members = this.getMembers();
    const index = members.findIndex(m => m.memberId === member.memberId);
    if (index >= 0) {
      members[index] = { ...member, cached_at: Date.now() };
    } else {
      members.unshift({ ...member, cached_at: Date.now() });
    }
    this.setItem('cached_members', members);
  }

  public deleteMember(memberId: string): void {
    const members = this.getMembers().filter(m => m.memberId !== memberId);
    this.setItem('cached_members', members);
  }

  public toggleMemberBlock(memberId: string): void {
    const members = this.getMembers();
    const member = members.find(m => m.memberId === memberId);
    if (member) {
      member.isBlocked = member.isBlocked === 1 ? 0 : 1;
      this.setItem('cached_members', members);
    }
  }

  // --- Member Package Plans (cached_member_package_plans) ---
  public getMemberPackagePlans(): CachedMemberPackagePlan[] {
    return this.getItem<CachedMemberPackagePlan[]>('cached_member_package_plans', []);
  }

  public saveMemberPackagePlan(plan: CachedMemberPackagePlan): void {
    const plans = this.getMemberPackagePlans();
    plans.unshift({ ...plan, cached_at: Date.now() });
    this.setItem('cached_member_package_plans', plans);
  }

  // --- Member Service Plans (cached_member_service_plans) ---
  public getMemberServicePlans(): CachedMemberServicePlan[] {
    return this.getItem<CachedMemberServicePlan[]>('cached_member_service_plans', []);
  }

  public saveMemberServicePlan(service: CachedMemberServicePlan): void {
    const services = this.getMemberServicePlans();
    services.unshift({ ...service, cached_at: Date.now() });
    this.setItem('cached_member_service_plans', services);
  }

  // --- Expenses & Categories ---
  public getExpenses(): ExpenseDto[] {
    return this.getItem<ExpenseDto[]>('expenses', []);
  }

  public saveExpense(expense: ExpenseDto): void {
    const expenses = this.getExpenses();
    const idx = expenses.findIndex(e => e.id === expense.id);
    if (idx >= 0) {
      expenses[idx] = expense;
    } else {
      expenses.unshift(expense);
    }
    this.setItem('expenses', expenses);
  }

  public deleteExpense(id: string): void {
    this.setItem('expenses', this.getExpenses().filter(e => e.id !== id));
  }

  public getCategories(): CategoryDto[] {
    return this.getItem<CategoryDto[]>('expense_categories', []);
  }

  public saveCategory(category: CategoryDto): void {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      cats[idx] = category;
    } else {
      cats.push(category);
    }
    this.setItem('expense_categories', cats);
  }

  // --- Batches ---
  public getBatches(): Batch[] {
    return this.getItem<Batch[]>('batches', []);
  }

  public saveBatch(batch: Batch): void {
    const batches = this.getBatches();
    const idx = batches.findIndex(b => b.batchId === batch.batchId);
    if (idx >= 0) {
      batches[idx] = batch;
    } else {
      batches.push(batch);
    }
    this.setItem('batches', batches);
  }

  public deleteBatch(batchId: string): void {
    this.setItem('batches', this.getBatches().filter(b => b.batchId !== batchId));
  }

  // --- Packages ---
  public getPackages(): Package[] {
    return this.getItem<Package[]>('packages', []);
  }

  public savePackage(pkg: Package): void {
    const packages = this.getPackages();
    const idx = packages.findIndex(p => p.packageId === pkg.packageId);
    if (idx >= 0) {
      packages[idx] = pkg;
    } else {
      packages.push(pkg);
    }
    this.setItem('packages', packages);
  }

  public deletePackage(packageId: string): void {
    this.setItem('packages', this.getPackages().filter(p => p.packageId !== packageId));
  }

  // --- Services ---
  public getServices(): Service[] {
    return this.getItem<Service[]>('services', []);
  }

  public saveService(service: Service): void {
    const services = this.getServices();
    const idx = services.findIndex(s => s.serviceId === service.serviceId);
    if (idx >= 0) {
      services[idx] = service;
    } else {
      services.push(service);
    }
    this.setItem('services', services);
  }

  public deleteService(serviceId: string): void {
    this.setItem('services', this.getServices().filter(s => s.serviceId !== serviceId));
  }

  // --- Trainers ---
  public getTrainers(): Trainer[] {
    return this.getItem<Trainer[]>('trainers', []);
  }

  public saveTrainer(trainer: Trainer): void {
    const trainers = this.getTrainers();
    const idx = trainers.findIndex(t => t.trainerId === trainer.trainerId);
    if (idx >= 0) {
      trainers[idx] = trainer;
    } else {
      trainers.push(trainer);
    }
    this.setItem('trainers', trainers);
  }

  public deleteTrainer(trainerId: string): void {
    this.setItem('trainers', this.getTrainers().filter(t => t.trainerId !== trainerId));
  }

  // --- Exercises & Workouts ---
  public getExercises(): Exercise[] {
    return this.getItem<Exercise[]>('exercises', []);
  }

  public saveExercise(exercise: Exercise): void {
    const ex = this.getExercises();
    const idx = ex.findIndex(e => e.exerciseId === exercise.exerciseId);
    if (idx >= 0) {
      ex[idx] = exercise;
    } else {
      ex.push(exercise);
    }
    this.setItem('exercises', ex);
  }

  public getWorkoutPlans(): WorkoutPlan[] {
    return this.getItem<WorkoutPlan[]>('workout_plans', []);
  }

  public saveWorkoutPlan(plan: WorkoutPlan): void {
    const plans = this.getWorkoutPlans();
    const idx = plans.findIndex(p => p.planId === plan.planId);
    if (idx >= 0) {
      plans[idx] = plan;
    } else {
      plans.push(plan);
    }
    this.setItem('workout_plans', plans);
  }

  // --- Meals & Diet Plans ---
  public getMeals(): Meal[] {
    return this.getItem<Meal[]>('meals', []);
  }

  public saveMeal(meal: Meal): void {
    const meals = this.getMeals();
    const idx = meals.findIndex(m => m.mealId === meal.mealId);
    if (idx >= 0) {
      meals[idx] = meal;
    } else {
      meals.push(meal);
    }
    this.setItem('meals', meals);
  }

  public getDietPlans(): DietPlan[] {
    return this.getItem<DietPlan[]>('diet_plans', []);
  }

  public saveDietPlan(plan: DietPlan): void {
    const plans = this.getDietPlans();
    const idx = plans.findIndex(p => p.dietId === plan.dietId);
    if (idx >= 0) {
      plans[idx] = plan;
    } else {
      plans.push(plan);
    }
    this.setItem('diet_plans', plans);
  }

  // --- Member Measurements ---
  public getMeasurements(memberId?: string): MemberMeasurement[] {
    const list = this.getItem<MemberMeasurement[]>('measurements', []);
    return memberId ? list.filter(m => m.memberId === memberId) : list;
  }

  public saveMeasurement(measurement: MemberMeasurement): void {
    const list = this.getMeasurements();
    list.unshift(measurement);
    this.setItem('measurements', list);
  }

  // --- Attendance Records ---
  public getAttendance(date?: string): AttendanceRecord[] {
    const records = this.getItem<AttendanceRecord[]>('attendance_records', []);
    return date ? records.filter(r => r.date === date) : records;
  }

  public markAttendance(record: AttendanceRecord): { success: boolean; message: string } {
    const records = this.getAttendance();
    const alreadyMarked = records.find(r => r.memberId === record.memberId && r.date === record.date);
    if (alreadyMarked) {
      return { success: false, message: `Attendance for ${record.memberName} is already recorded today at ${alreadyMarked.time}.` };
    }
    records.unshift(record);
    this.setItem('attendance_records', records);
    return { success: true, message: `Attendance marked successfully for ${record.memberName}.` };
  }

  // --- Inquiries ---
  public getInquiries(): Inquiry[] {
    return this.getItem<Inquiry[]>('inquiries', []);
  }

  public saveInquiry(inquiry: Inquiry): void {
    const inq = this.getInquiries();
    const idx = inq.findIndex(i => i.inquiryId === inquiry.inquiryId);
    if (idx >= 0) {
      inq[idx] = inquiry;
    } else {
      inq.unshift(inquiry);
    }
    this.setItem('inquiries', inq);
  }

  // --- Message Templates ---
  public getTemplates(): MessageTemplate[] {
    return this.getItem<MessageTemplate[]>('message_templates', []);
  }

  public saveTemplate(template: MessageTemplate): void {
    const templates = this.getTemplates();
    const idx = templates.findIndex(t => t.templateId === template.templateId);
    if (idx >= 0) {
      templates[idx] = template;
    } else {
      templates.push(template);
    }
    this.setItem('message_templates', templates);
  }

  // --- Gym Settings ---
  public getSettings(): GymSettings {
    return this.getItem<GymSettings>('gym_settings', {
      gymOwnerId: 'owner_101',
      gymName: 'IronPulse Fitness & Gym',
      tagline: 'Forge Your Strength. Master Your Body.',
      phone: '+91 98765 43210',
      email: 'contact@ironpulse.fitness',
      address: 'Plot 42, 2nd Floor, Apex Tower, Tech Hub Road',
      gstin: '07AAAAA0000A1Z5',
      currencySymbol: '₹',
      razorpayKeyId: 'rzp_live_a0KDM6ohQvje5c',
      branches: [
        { branchId: 'b_main', branchName: 'Main Elite Branch', location: 'Downtown Apex Hub', phone: '+91 98765 43210' },
        { branchId: 'b_west', branchName: 'West End Power Gym', location: 'West Avenue Sector 4', phone: '+91 98765 43211' }
      ]
    });
  }

  public saveSettings(settings: GymSettings): void {
    this.setItem('gym_settings', settings);
  }

  // --- Seeder for rich initial data ---
  private initializeDefaults(): void {
    if (localStorage.getItem(STORAGE_PREFIX + 'initialized')) {
      return;
    }

    // 1. Packages
    const samplePackages: Package[] = [
      { packageId: 'pkg_1m', name: 'Monthly Standard', durationMonths: 1, price: 1500, admissionFee: 500, taxPercent: 18, description: 'Access to general gym equipment & locker room', status: 'active' },
      { packageId: 'pkg_3m', name: 'Quarterly Pro', durationMonths: 3, price: 3900, admissionFee: 300, taxPercent: 18, description: 'General floor access + 1 free fitness assessment', status: 'active' },
      { packageId: 'pkg_6m', name: 'Half-Yearly Muscle', durationMonths: 6, price: 7200, admissionFee: 0, taxPercent: 18, description: 'Unrestricted workout access + diet consultation', status: 'active' },
      { packageId: 'pkg_12m', name: 'Annual Beast Mode', durationMonths: 12, price: 12999, admissionFee: 0, taxPercent: 18, description: 'VIP all-access + sauna + guest passes', status: 'active' }
    ];
    this.setItem('packages', samplePackages);

    // 2. Services
    const sampleServices: Service[] = [
      { serviceId: 'srv_pt', name: 'Personal Training (10 Sessions)', price: 4500, durationDays: 30, description: '1-on-1 dedicated coach sessions', status: 'active' },
      { serviceId: 'srv_sauna', name: 'Steam & Sauna Pass', price: 1200, durationDays: 30, description: 'Unlimited weekly steam bath access', status: 'active' },
      { serviceId: 'srv_locker', name: 'Dedicated VIP Locker', price: 600, durationDays: 30, description: 'Personal lockable cabinet', status: 'active' }
    ];
    this.setItem('services', sampleServices);

    // 3. Batches
    const sampleBatches: Batch[] = [
      { batchId: 'b_morning_1', name: 'Early Bird Blast', startTime: '06:00 AM', endTime: '08:00 AM', trainerName: 'Alex Rivera', trainerId: 't_1', capacity: 35, activeMembersCount: 24 },
      { batchId: 'b_morning_2', name: 'Morning Fit Power', startTime: '08:00 AM', endTime: '10:00 AM', trainerName: 'Sarah Jenkins', trainerId: 't_2', capacity: 30, activeMembersCount: 18 },
      { batchId: 'b_evening_1', name: 'Evening Prime Push', startTime: '05:30 PM', endTime: '07:30 PM', trainerName: 'Vikram Rajput', trainerId: 't_3', capacity: 40, activeMembersCount: 36 },
      { batchId: 'b_evening_2', name: 'Night Owl Heavy', startTime: '07:30 PM', endTime: '09:30 PM', trainerName: 'Alex Rivera', trainerId: 't_1', capacity: 30, activeMembersCount: 22 }
    ];
    this.setItem('batches', sampleBatches);

    // 4. Trainers
    const sampleTrainers: Trainer[] = [
      { trainerId: 't_1', name: 'Alex Rivera', phone: '+91 98111 22334', email: 'alex@ironpulse.fitness', specialization: 'Crossfit & Strength Conditioning', experienceYears: 7, status: 'active', salary: 38000, joinedDate: '2023-01-15' },
      { trainerId: 't_2', name: 'Sarah Jenkins', phone: '+91 98222 33445', email: 'sarah@ironpulse.fitness', specialization: 'Cardio, HIIT & Functional Training', experienceYears: 5, status: 'active', salary: 32000, joinedDate: '2023-06-01' },
      { trainerId: 't_3', name: 'Vikram Rajput', phone: '+91 98333 44556', email: 'vikram@ironpulse.fitness', specialization: 'Hypertrophy & Competitive Bodybuilding', experienceYears: 9, status: 'active', salary: 45000, joinedDate: '2022-09-10' }
    ];
    this.setItem('trainers', sampleTrainers);

    // 5. Members (cached_members)
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);

    const sampleMembers: CachedMember[] = [
      {
        memberId: 'mem_1001',
        gymOwnerId: 'owner_101',
        name: 'Rohan Sharma',
        phone: '+91 98765 11223',
        email: 'rohan.sharma@example.com',
        address: 'Flat 302, Green Valley Apartments',
        dob: '1996-04-12',
        gender: 'Male',
        trainingType: 'Strength',
        packageId: 'pkg_3m',
        packageName: 'Quarterly Pro',
        tamount: '4200',
        pamount: '4200',
        damount: '0',
        pdate: formatDate(addDays(today, -30)),
        doj: formatDate(addDays(today, -30)),
        edate: formatDate(addDays(today, 60)),
        discount: '0',
        batchId: 'b_morning_1',
        batchName: 'Early Bird Blast',
        trainerId: 't_1',
        trainerName: 'Alex Rivera',
        isBlocked: 0,
        regCode: 'GYM-0101',
        age: 28,
        paymentMode: 'UPI',
        cached_at: Date.now()
      },
      {
        memberId: 'mem_1002',
        gymOwnerId: 'owner_101',
        name: 'Priya Kapoor',
        phone: '+91 98765 22334',
        email: 'priya.k@example.com',
        address: 'B-14, Parkview Residency',
        dob: '1999-08-25',
        gender: 'Female',
        trainingType: 'Cardio',
        packageId: 'pkg_6m',
        packageName: 'Half-Yearly Muscle',
        tamount: '7200',
        pamount: '5000',
        damount: '2200', // Due amount alert!
        pdate: formatDate(addDays(today, -15)),
        doj: formatDate(addDays(today, -15)),
        edate: formatDate(addDays(today, 165)),
        discount: '0',
        batchId: 'b_morning_2',
        batchName: 'Morning Fit Power',
        trainerId: 't_2',
        trainerName: 'Sarah Jenkins',
        isBlocked: 0,
        regCode: 'GYM-0102',
        age: 25,
        paymentMode: 'Card',
        cached_at: Date.now()
      },
      {
        memberId: 'mem_1003',
        gymOwnerId: 'owner_101',
        name: 'Aman Verma',
        phone: '+91 98765 33445',
        email: 'aman.v@example.com',
        address: 'H-90, Civil Lines Sector 2',
        dob: '1993-11-04',
        gender: 'Male',
        trainingType: 'Personal',
        packageId: 'pkg_1m',
        packageName: 'Monthly Standard',
        tamount: '2000',
        pamount: '2000',
        damount: '0',
        pdate: formatDate(addDays(today, -28)),
        doj: formatDate(addDays(today, -28)),
        edate: formatDate(addDays(today, 2)), // Expiring soon!
        discount: '0',
        batchId: 'b_evening_1',
        batchName: 'Evening Prime Push',
        trainerId: 't_3',
        trainerName: 'Vikram Rajput',
        isBlocked: 0,
        regCode: 'GYM-0103',
        age: 31,
        paymentMode: 'UPI',
        cached_at: Date.now()
      },
      {
        memberId: 'mem_1004',
        gymOwnerId: 'owner_101',
        name: 'Neha Gupta',
        phone: '+91 98765 44556',
        email: 'neha.g@example.com',
        address: 'Tower C, Silicon Heights',
        dob: '1998-02-18',
        gender: 'Female',
        trainingType: 'Crossfit',
        packageId: 'pkg_1m',
        packageName: 'Monthly Standard',
        tamount: '2000',
        pamount: '2000',
        damount: '0',
        pdate: formatDate(addDays(today, -35)),
        doj: formatDate(addDays(today, -35)),
        edate: formatDate(addDays(today, -5)), // Already expired!
        discount: '0',
        batchId: 'b_evening_2',
        batchName: 'Night Owl Heavy',
        trainerId: 't_1',
        trainerName: 'Alex Rivera',
        isBlocked: 0,
        regCode: 'GYM-0104',
        age: 26,
        paymentMode: 'Cash',
        cached_at: Date.now()
      },
      {
        memberId: 'mem_1005',
        gymOwnerId: 'owner_101',
        name: 'Karan Mehra',
        phone: '+91 98765 55667',
        email: 'karan.m@example.com',
        address: 'Villa 12, Royal Palm County',
        dob: '1991-07-30',
        gender: 'Male',
        trainingType: 'Strength',
        packageId: 'pkg_12m',
        packageName: 'Annual Beast Mode',
        tamount: '12999',
        pamount: '12999',
        damount: '0',
        pdate: formatDate(addDays(today, -60)),
        doj: formatDate(addDays(today, -60)),
        edate: formatDate(addDays(today, 305)),
        discount: '0',
        batchId: 'b_morning_1',
        batchName: 'Early Bird Blast',
        trainerId: 't_3',
        trainerName: 'Vikram Rajput',
        isBlocked: 0,
        regCode: 'GYM-0105',
        age: 33,
        paymentMode: 'UPI',
        cached_at: Date.now()
      }
    ];
    this.setItem('cached_members', sampleMembers);

    // 6. Expense Categories & Expenses (feature/expensemanager)
    const sampleCategories: CategoryDto[] = [
      { id: 'cat_rent', name: 'Gym Space Rent', color: '#ef4444' },
      { id: 'cat_salary', name: 'Staff & Trainer Salaries', color: '#3b82f6' },
      { id: 'cat_equip', name: 'Equipment Maintenance', color: '#f59e0b' },
      { id: 'cat_utility', name: 'Electricity & Water', color: '#10b981' },
      { id: 'cat_supplements', name: 'Supplements & Retail', color: '#8b5cf6' },
      { id: 'cat_marketing', name: 'Marketing & Ads', color: '#ec4899' }
    ];
    this.setItem('expense_categories', sampleCategories);

    const sampleExpenses: ExpenseDto[] = [
      { id: 'exp_1', title: 'Main Floor Rent (Nov)', amount: 45000, categoryId: 'cat_rent', categoryName: 'Gym Space Rent', date: formatDate(addDays(today, -5)), paymentMethod: 'Bank Transfer' },
      { id: 'exp_2', title: 'Trainer Monthly Salaries', amount: 80000, categoryId: 'cat_salary', categoryName: 'Staff & Trainer Salaries', date: formatDate(addDays(today, -8)), paymentMethod: 'Bank Transfer' },
      { id: 'exp_3', title: 'Treadmill Belt Replacement', amount: 6500, categoryId: 'cat_equip', categoryName: 'Equipment Maintenance', date: formatDate(addDays(today, -12)), paymentMethod: 'UPI' },
      { id: 'exp_4', title: 'Commercial Electricity Bill', amount: 14200, categoryId: 'cat_utility', categoryName: 'Electricity & Water', date: formatDate(addDays(today, -15)), paymentMethod: 'Netbanking' }
    ];
    this.setItem('expenses', sampleExpenses);

    // 7. Exercises & Workouts (ui/exercise, ui/workoutplan)
    const sampleExercises: Exercise[] = [
      { exerciseId: 'ex_bench', name: 'Barbell Flat Bench Press', category: 'Chest', equipment: 'Barbell & Bench', defaultSets: 4, defaultReps: 10, restSeconds: 90, instructions: 'Lower bar to mid-chest, drive elbows in, press explosively.' },
      { exerciseId: 'ex_incline', name: 'Incline Dumbbell Press', category: 'Chest', equipment: 'Dumbbells & 30° Bench', defaultSets: 3, defaultReps: 12, restSeconds: 60, instructions: 'Target upper clavicular head with full stretch at bottom.' },
      { exerciseId: 'ex_deadlift', name: 'Conventional Deadlift', category: 'Back', equipment: 'Olympic Barbell', defaultSets: 4, defaultReps: 6, restSeconds: 120, instructions: 'Keep neutral spine, pull slack from bar, drive heels through floor.' },
      { exerciseId: 'ex_latpulldown', name: 'Wide Grip Lat Pulldown', category: 'Back', equipment: 'Cable Machine', defaultSets: 4, defaultReps: 12, restSeconds: 60, instructions: 'Pull to upper chest, squeeze shoulder blades together.' },
      { exerciseId: 'ex_squat', name: 'Barbell Back Squat', category: 'Legs', equipment: 'Squat Rack & Barbell', defaultSets: 4, defaultReps: 8, restSeconds: 120, instructions: 'Break at hips and knees simultaneously, achieve parallel depth.' },
      { exerciseId: 'ex_overhead', name: 'Overhead Standing Military Press', category: 'Shoulders', equipment: 'Barbell', defaultSets: 4, defaultReps: 8, restSeconds: 90, instructions: 'Brace core, press bar in straight vertical line overhead.' }
    ];
    this.setItem('exercises', sampleExercises);

    const sampleWorkoutPlan: WorkoutPlan[] = [
      {
        planId: 'wp_hypertrophy',
        title: '4-Day Classic Muscle Split',
        level: 'Intermediate',
        daysPerWeek: 4,
        assignedMemberIds: ['mem_1001', 'mem_1005'],
        exercises: [
          { exerciseId: 'ex_bench', exerciseName: 'Barbell Flat Bench Press', day: 'Monday (Chest & Triceps)', sets: 4, reps: '8-10', rest: '90s' },
          { exerciseId: 'ex_incline', exerciseName: 'Incline Dumbbell Press', day: 'Monday (Chest & Triceps)', sets: 3, reps: '10-12', rest: '60s' },
          { exerciseId: 'ex_deadlift', exerciseName: 'Conventional Deadlift', day: 'Tuesday (Back & Biceps)', sets: 4, reps: '6-8', rest: '120s' },
          { exerciseId: 'ex_latpulldown', exerciseName: 'Wide Grip Lat Pulldown', day: 'Tuesday (Back & Biceps)', sets: 4, reps: '10-12', rest: '60s' },
          { exerciseId: 'ex_squat', exerciseName: 'Barbell Back Squat', day: 'Thursday (Legs & Abs)', sets: 4, reps: '8', rest: '120s' },
          { exerciseId: 'ex_overhead', exerciseName: 'Overhead Standing Military Press', day: 'Friday (Shoulders & Arms)', sets: 4, reps: '8-10', rest: '90s' }
        ]
      }
    ];
    this.setItem('workout_plans', sampleWorkoutPlan);

    // 8. Meals & Diets (ui/mealsActivity, ui/dietPlan)
    const sampleMeals: Meal[] = [
      { mealId: 'meal_1', name: 'Oatmeal & Whey Protein with Berries', timeOfDay: 'Breakfast', calories: 450, proteinGrams: 35, carbsGrams: 55, fatsGrams: 9, ingredients: '60g rolled oats, 1 scoop whey, almond milk, blueberries' },
      { mealId: 'meal_2', name: 'Grilled Chicken Breast, Brown Rice & Broccoli', timeOfDay: 'Lunch', calories: 600, proteinGrams: 48, carbsGrams: 60, fatsGrams: 12, ingredients: '200g chicken breast, 150g steamed rice, olive oil drizzle' },
      { mealId: 'meal_3', name: 'Greek Yogurt with Mixed Nuts & Honey', timeOfDay: 'Evening Snack', calories: 280, proteinGrams: 20, carbsGrams: 22, fatsGrams: 10, ingredients: '150g greek yogurt, 15g almonds/walnuts' },
      { mealId: 'meal_4', name: 'Grilled Salmon / Paneer Tikka & Quinoa Salad', timeOfDay: 'Dinner', calories: 520, proteinGrams: 40, carbsGrams: 35, fatsGrams: 18, ingredients: 'High protein lean source with fresh leafy greens' }
    ];
    this.setItem('meals', sampleMeals);

    const sampleDietPlan: DietPlan[] = [
      {
        dietId: 'diet_lean_bulk',
        title: 'Lean Muscle Hypertrophy Diet (2600 kcal)',
        targetGoal: 'Muscle Gain',
        totalCalories: 2600,
        assignedMemberIds: ['mem_1001', 'mem_1003'],
        meals: [
          { mealId: 'meal_1', mealName: 'Oatmeal & Whey Protein with Berries', timeOfDay: '08:00 AM', portion: '1 Large Bowl' },
          { mealId: 'meal_2', mealName: 'Grilled Chicken Breast, Brown Rice & Broccoli', timeOfDay: '01:30 PM', portion: 'Standard Meal' },
          { mealId: 'meal_3', mealName: 'Greek Yogurt with Mixed Nuts & Honey', timeOfDay: '05:00 PM', portion: '1 Bowl' },
          { mealId: 'meal_4', mealName: 'Grilled Salmon / Paneer Tikka & Quinoa Salad', timeOfDay: '08:30 PM', portion: 'Standard Dinner' }
        ]
      }
    ];
    this.setItem('diet_plans', sampleDietPlan);

    // 9. Measurements (ui/memberMeasurement)
    const sampleMeasurements: MemberMeasurement[] = [
      { id: 'ms_1', memberId: 'mem_1001', date: formatDate(addDays(today, -30)), weightKg: 82.5, heightCm: 178, bmi: 26.0, chestInches: 40, waistInches: 34, bicepsInches: 14.5, bodyFatPercent: 18 },
      { id: 'ms_2', memberId: 'mem_1001', date: formatDate(today), weightKg: 80.2, heightCm: 178, bmi: 25.3, chestInches: 41, waistInches: 32.5, bicepsInches: 15.2, bodyFatPercent: 15.5, notes: 'Great progress, leaner waist line!' }
    ];
    this.setItem('measurements', sampleMeasurements);

    // 10. Attendance Records (ui/attendance)
    const sampleAttendance: AttendanceRecord[] = [
      { id: 'att_1', memberId: 'mem_1001', memberName: 'Rohan Sharma', regCode: 'GYM-0101', timestamp: new Date().toISOString(), date: formatDate(today), time: '06:15 AM', method: 'QR_SCAN', status: 'PRESENT' },
      { id: 'att_2', memberId: 'mem_1002', memberName: 'Priya Kapoor', regCode: 'GYM-0102', timestamp: new Date().toISOString(), date: formatDate(today), time: '08:20 AM', method: 'MANUAL', status: 'PRESENT' },
      { id: 'att_3', memberId: 'mem_1005', memberName: 'Karan Mehra', regCode: 'GYM-0105', timestamp: new Date().toISOString(), date: formatDate(today), time: '06:40 AM', method: 'BIOMETRIC', status: 'PRESENT' }
    ];
    this.setItem('attendance_records', sampleAttendance);

    // 11. Inquiries (ui/inquiry)
    const sampleInquiries: Inquiry[] = [
      { inquiryId: 'inq_1', name: 'Varun Dhawan', phone: '+91 99887 76655', email: 'varun.d@example.com', interest: 'Personal Training & Muscle Building', date: formatDate(addDays(today, -2)), followUpDate: formatDate(addDays(today, 1)), status: 'Followed-Up', notes: 'Visited gym facility. Interested in 6-month combo.' },
      { inquiryId: 'inq_2', name: 'Ananya Roy', phone: '+91 99112 23344', email: 'ananya.roy@example.com', interest: 'Weight Loss & Evening Zumba/Cardio', date: formatDate(today), followUpDate: formatDate(addDays(today, 2)), status: 'New', notes: 'Inquired through Instagram page.' }
    ];
    this.setItem('inquiries', sampleInquiries);

    // 12. Message Templates (ui/templateMessages)
    const sampleTemplates: MessageTemplate[] = [
      {
        templateId: 'tpl_fee_due',
        title: 'Fee Payment Due Alert',
        type: 'Payment Reminder',
        body: 'Hi {{name}}, this is a friendly reminder from {{gym_name}}. Your membership fee of ₹{{amount}} is currently due. Please renew to keep enjoying uninterrupted workout sessions! Thank you.'
      },
      {
        templateId: 'tpl_expiry_alert',
        title: 'Membership Expiring Soon',
        type: 'Membership Expiry',
        body: 'Hello {{name}}! Your gym package at {{gym_name}} will expire on {{expiry_date}}. Renew today to lock in special renewal perks and keep crushing your fitness goals! 💪'
      },
      {
        templateId: 'tpl_welcome',
        title: 'New Member Welcome Message',
        type: 'Welcome',
        body: 'Welcome to the {{gym_name}} family, {{name}}! 🏋️ Your Reg Code is {{reg_code}}. We are thrilled to partner with you on your transformation journey!'
      },
      {
        templateId: 'tpl_birthday',
        title: 'Birthday Greetings',
        type: 'Birthday',
        body: 'Wishing you a very Happy Birthday, {{name}}! 🎉 May this year bring you unstoppable energy, strength, and great health. From all of us at {{gym_name}}!'
      }
    ];
    this.setItem('message_templates', sampleTemplates);

    localStorage.setItem(STORAGE_PREFIX + 'initialized', 'true');
  }
}

export const db = GymCacheDatabase.getInstance();

