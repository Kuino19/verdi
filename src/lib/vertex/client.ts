import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI with Service Account Credentials
// The SDK automatically checks for GOOGLE_APPLICATION_CREDENTIALS or can be passed an auth object.
// Here we use the existing Firebase Admin environment variables which are standard for GCP Service Accounts.

const project = process.env.FIREBASE_PROJECT_ID || 'verdi-491800';
const location = 'us-central1'; // Default region for Vertex AI

const vertexAI = new VertexAI({
  project: project,
  location: location,
  googleAuthOptions: {
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }
  }
});

/**
 * Returns a generative model instance from Vertex AI.
 * @param modelName - The name of the model (e.g., 'gemini-1.5-flash').
 */
export function getVertexModel(modelName: string = 'gemini-1.5-flash') {
  return vertexAI.getGenerativeModel({
    model: modelName,
  });
}
