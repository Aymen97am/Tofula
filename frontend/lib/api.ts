import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/app/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('auth_token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('auth_token');
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('auth_token', token);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// API methods

// Catalog
export const getCatalog = () => 
  apiClient.get('/api/v1/catalog');

export const getStory = (storyId: string) => 
  apiClient.get(`/api/v1/catalog/${storyId}`);

// Personalization
export const personalizeStory = (data: any) => 
  apiClient.post('/api/v1/stories/personalize', data);

export const getUserLibrary = () => 
  apiClient.get('/api/v1/stories/library');

export const getUserStory = (instanceId: string) => 
  apiClient.get(`/api/v1/stories/library/${instanceId}`);

// Studio endpoints
export const generateStory = (data: any) => 
  apiClient.post('/api/v1/studio/stories/generate', data);

export const createStoryTemplate = (data: any) => 
  apiClient.post('/api/v1/studio/stories', data);

export const getStudioStories = (status?: string) => 
  apiClient.get('/api/v1/studio/stories', { params: { status_filter: status } });

export const getStudioStory = (templateId: string) => 
  apiClient.get(`/api/v1/studio/stories/${templateId}`);

export const updateStoryTemplate = (templateId: string, data: any) => 
  apiClient.patch(`/api/v1/studio/stories/${templateId}`, data);

export const approveStoryTemplate = (templateId: string) => 
  apiClient.post(`/api/v1/studio/stories/${templateId}/approve`);

export const deleteStoryTemplate = (templateId: string) => 
  apiClient.delete(`/api/v1/studio/stories/${templateId}`);
