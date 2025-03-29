import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { phoneNumberSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  app.use('/api', (req, res, next) => {
    next();
  });

  // Save phone number
  app.post('/api/phone', async (req, res) => {
    try {
      const validatedData = phoneNumberSchema.parse(req.body);
      const savedContact = await storage.savePhoneNumber(validatedData);
      res.status(200).json({ message: 'Contact information saved successfully', contact: savedContact });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: 'Failed to save contact information' });
      }
    }
  });

  // SOS alert endpoint
  app.post('/api/sos', async (req, res) => {
    try {
      const locationSchema = z.object({
        latitude: z.string(),
        longitude: z.string(),
        phoneNumberId: z.number().optional()
      });

      const validatedData = locationSchema.parse(req.body);
      
      // Simulate a failed message sent
      // In a real application, this would integrate with an emergency service API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const alert = await storage.saveEmergencyAlert({
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      });
      
      // Always return a "failed" response for this mockup
      res.status(500).json({ 
        message: 'Emergency message failed to send. Please try again or call emergency services directly.',
        alert 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ 
          message: 'Error processing emergency alert',
          error: (error as Error).message 
        });
      }
    }
  });

  // Mock video upload endpoint
  app.post('/api/video/upload', async (req, res) => {
    try {
      const videoSchema = z.object({
        fileName: z.string(),
        mimeType: z.string()
      });

      const validatedData = videoSchema.parse(req.body);
      
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const recording = await storage.saveVideoRecording({
        fileName: validatedData.fileName,
        mimeType: validatedData.mimeType
      });
      
      // Always return a "failed" response for this mockup
      res.status(500).json({ 
        message: 'Video upload failed. Please check your connection and try again later.',
        recording 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ 
          message: 'Error uploading video',
          error: (error as Error).message 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
