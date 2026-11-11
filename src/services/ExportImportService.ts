export class ExportImportService {
  public static exportDatabaseToJson(): string {
    const keys = [
      'cached_members',
      'cached_member_package_plans',
      'cached_member_service_plans',
      'expenses',
      'expense_categories',
      'batches',
      'packages',
      'services',
      'trainers',
      'exercises',
      'workout_plans',
      'meals',
      'diet_plans',
      'measurements',
      'attendance_records',
      'inquiries',
      'message_templates',
      'gym_settings'
    ];

    const backupData: Record<string, unknown> = {};
    keys.forEach(k => {
      const item = localStorage.getItem('gym_cache_db_' + k);
      if (item) {
        backupData[k] = JSON.parse(item);
      }
    });

    return JSON.stringify(backupData, null, 2);
  }

  public static importDatabaseFromJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      for (const [key, val] of Object.entries(data)) {
        localStorage.setItem('gym_cache_db_' + key, JSON.stringify(val));
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  public static downloadBackupFile(): void {
    const json = this.exportDatabaseToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mygym_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

