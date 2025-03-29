import { 
  users, 
  emergencyContacts, 
  videoRecordings, 
  emergencyAlerts,
  type User, 
  type InsertUser, 
  type EmergencyContact, 
  type InsertEmergencyContact,
  type VideoRecording,
  type InsertVideoRecording,
  type EmergencyAlert,
  type InsertEmergencyAlert
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Emergency contact methods
  savePhoneNumber(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  getPhoneNumber(id: number): Promise<EmergencyContact | undefined>;
  
  // Video recording methods
  saveVideoRecording(recording: InsertVideoRecording): Promise<VideoRecording>;
  getVideoRecording(id: number): Promise<VideoRecording | undefined>;
  
  // Emergency alert methods
  saveEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  getEmergencyAlert(id: number): Promise<EmergencyAlert | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private videoRecordings: Map<number, VideoRecording>;
  private emergencyAlerts: Map<number, EmergencyAlert>;
  
  currentUserId: number;
  currentContactId: number;
  currentVideoId: number;
  currentAlertId: number;

  constructor() {
    this.users = new Map();
    this.emergencyContacts = new Map();
    this.videoRecordings = new Map();
    this.emergencyAlerts = new Map();
    
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentVideoId = 1;
    this.currentAlertId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Emergency contact methods
  async savePhoneNumber(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.currentContactId++;
    const contact: EmergencyContact = { 
      ...insertContact, 
      id,
      userId: null // In a real app, this would be set to the current user's ID
    };
    this.emergencyContacts.set(id, contact);
    return contact;
  }
  
  async getPhoneNumber(id: number): Promise<EmergencyContact | undefined> {
    return this.emergencyContacts.get(id);
  }
  
  // Video recording methods
  async saveVideoRecording(insertRecording: InsertVideoRecording): Promise<VideoRecording> {
    const id = this.currentVideoId++;
    const recording: VideoRecording = { 
      ...insertRecording, 
      id,
      userId: null, // In a real app, this would be set to the current user's ID
      uploadStatus: false // Simulate failed upload
    };
    this.videoRecordings.set(id, recording);
    return recording;
  }
  
  async getVideoRecording(id: number): Promise<VideoRecording | undefined> {
    return this.videoRecordings.get(id);
  }
  
  // Emergency alert methods
  async saveEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const id = this.currentAlertId++;
    const alert: EmergencyAlert = { 
      ...insertAlert, 
      id,
      userId: null, // In a real app, this would be set to the current user's ID
      contactId: null, // In a real app, this would be set to a contact ID
      status: 'failed' // Simulate failed alert
    };
    this.emergencyAlerts.set(id, alert);
    return alert;
  }
  
  async getEmergencyAlert(id: number): Promise<EmergencyAlert | undefined> {
    return this.emergencyAlerts.get(id);
  }
}

export const storage = new MemStorage();
