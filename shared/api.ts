/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact form data structure
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  subject: string;
  message: string;
}

/**
 * Contact form response type
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    email: string;
    submittedAt: string;
  };
  errors?: {
    field: string;
    message: string;
  }[];
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
  errors?: unknown;
}

export interface MeResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}
