import { InspectionRecord } from '../types';
import { inspectionRecords as initialRecords } from '../data/mockData';

class InspectionStore {
  private records: InspectionRecord[] = [...initialRecords];

  getRecords(): InspectionRecord[] {
    return this.records;
  }

  addRecord(record: InspectionRecord): void {
    this.records.unshift(record);
  }

  updateRecord(id: string, updates: Partial<InspectionRecord>): void {
    const index = this.records.findIndex(r => r.id === id);
    if (index !== -1) {
      this.records[index] = { ...this.records[index], ...updates };
    }
  }

  getPendingReviewRecords(): InspectionRecord[] {
    return this.records.filter(r => r.status === 'submitted');
  }

  getRecordById(id: string): InspectionRecord | undefined {
    return this.records.find(r => r.id === id);
  }
}

export const inspectionStore = new InspectionStore();
