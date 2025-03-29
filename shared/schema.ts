import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Emergency contact schema
export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  countryCode: text("country_code").notNull(),
  phoneNumber: text("phone_number").notNull(),
  userId: integer("user_id").references(() => users.id),
});

// Video recording schema
export const videoRecordings = pgTable("video_recordings", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadStatus: boolean("upload_status").notNull().default(false),
  userId: integer("user_id").references(() => users.id),
});

// Emergency alert schema
export const emergencyAlerts = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  userId: integer("user_id").references(() => users.id),
  contactId: integer("contact_id").references(() => emergencyContacts.id),
  status: text("status").notNull().default("pending"),
});

// Insert schemas using drizzle-zod
export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).pick({
  countryCode: true,
  phoneNumber: true,
});

export const insertVideoRecordingSchema = createInsertSchema(videoRecordings).pick({
  fileName: true,
  mimeType: true,
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).pick({
  latitude: true,
  longitude: true,
});

// Define types for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

export type InsertVideoRecording = z.infer<typeof insertVideoRecordingSchema>;
export type VideoRecording = typeof videoRecordings.$inferSelect;

export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;

// Validations for phone number
export const phoneNumberSchema = z.object({
  countryCode: z.string().min(2, "Country code is required"),
  phoneNumber: z.string().regex(
    /^\d{10}$|^\(\d{3}\)\s?\d{3}-\d{4}$|^\d{3}-\d{3}-\d{4}$/,
    "Please enter a valid phone number"
  ),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
