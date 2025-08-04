// Frontend Service Integration for Dual Backend Architecture
// src/services/dualApiClient.js

import axios from 'axios';

/**
 * Dual API Client for YoJa Application
 * Routes requests intelligently between FastAPI (lightweight) and Django (heavy data)
 */
class DualAPIClient {
  constructor() {
    // Environment configuration
    this.fastApiBaseURL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';
    this.djangoBaseURL = process.env.REACT_APP_DJANGO_URL || 'http://localhost:8001';
    
    // FastAPI Client - For lightweight, real-time operations
    this.fastApiClient = axios.create({
      baseURL: `${this.fastApiBaseURL}/api/v1`,
      timeout: 5000, // Fast operations should be quick
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Django Client - For heavy data operations
    this.djangoClient = axios.create({
      baseURL: `${this.djangoBaseURL}/api/v1`,
      timeout: 30000, // Heavy operations can take longer
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    this.setupInterceptors();
    this.setupWebSocket();
  }
  
  setupInterceptors() {
    // Request interceptors for authentication
    const requestInterceptor = (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timing
      config.metadata = { startTime: new Date() };
      return config;
    };
    
    // Response interceptors for logging and error handling
    const responseInterceptor = (response) => {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API Request: ${response.config.url} took ${duration}ms`);
      return response;
    };
    
    const errorInterceptor = (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    };
    
    // Apply interceptors to both clients
    [this.fastApiClient, this.djangoClient].forEach(client => {
      client.interceptors.request.use(requestInterceptor);
      client.interceptors.response.use(responseInterceptor, errorInterceptor);
    });
  }
  
  setupWebSocket() {
    // WebSocket connection for real-time features
    this.websocket = null;
    this.websocketCallbacks = new Map();
  }
  
  connectWebSocket(userId) {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      return;
    }
    
    const token = localStorage.getItem('auth_token');
    const wsUrl = `${this.fastApiBaseURL.replace('http', 'ws')}/ws/${userId}?token=${token}`;
    
    this.websocket = new WebSocket(wsUrl);
    
    this.websocket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const callback = this.websocketCallbacks.get(data.type);
      if (callback) {
        callback(data);
      }
    };
    
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  subscribeToWebSocket(eventType, callback) {
    this.websocketCallbacks.set(eventType, callback);
  }
  
  // ============================================================================
  // FASTAPI METHODS (Lightweight Operations)
  // ============================================================================
  
  // Authentication & Session Management
  async login(credentials) {
    const response = await this.fastApiClient.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
  }
  
  async logout() {
    await this.fastApiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    if (this.websocket) {
      this.websocket.close();
    }
  }
  
  async refreshToken() {
    const response = await this.fastApiClient.post('/auth/refresh');
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    return response.data;
  }
  
  // Real-time Session Management
  async startYogaSession(sessionData) {
    const response = await this.fastApiClient.post('/sessions/start', sessionData);
    return response.data;
  }
  
  async endYogaSession(sessionId, sessionSummary) {
    const response = await this.fastApiClient.post(`/sessions/end/${sessionId}`, sessionSummary);
    return response.data;
  }
  
  async pauseYogaSession(sessionId) {
    const response = await this.fastApiClient.post(`/sessions/pause/${sessionId}`);
    return response.data;
  }
  
  async resumeYogaSession(sessionId) {
    const response = await this.fastApiClient.post(`/sessions/resume/${sessionId}`);
    return response.data;
  }
  
  // Real-time Pose Analysis
  async analyzePoseRealtime(poseData) {
    const response = await this.fastApiClient.post('/realtime/analyze', poseData);
    return response.data;
  }
  
  async getRealtimeFeedback(sessionId) {
    const response = await this.fastApiClient.get(`/realtime/feedback/${sessionId}`);
    return response.data;
  }
  
  // Cache Operations
  async getCachedUserData(userId) {
    const response = await this.fastApiClient.get(`/cache/user/${userId}`);
    return response.data;
  }
  
  async setCachedData(key, data, ttl = 3600) {
    const response = await this.fastApiClient.post('/cache/set', { key, data, ttl });
    return response.data;
  }
  
  // ============================================================================
  // DJANGO METHODS (Heavy Data Operations)
  // ============================================================================
  
  // User Management (Heavy Profile Data)
  async getUserCompleteProfile(userId) {
    const response = await this.djangoClient.get(`/users/profile/${userId}/complete/`);
    return response.data;
  }
  
  async updateUserProfile(userId, profileData) {
    const response = await this.djangoClient.put(`/users/profile/${userId}/`, profileData);
    return response.data;
  }
  
  async getUserPreferences(userId) {
    const response = await this.djangoClient.get(`/users/preferences/${userId}/`);
    return response.data;
  }
  
  async updateUserPreferences(userId, preferences) {
    const response = await this.djangoClient.put(`/users/preferences/${userId}/`, preferences);
    return response.data;
  }
  
  async getUserAchievements(userId) {
    const response = await this.djangoClient.get(`/users/achievements/${userId}/`);
    return response.data;
  }
  
  // Asanas Library (Heavy Data with Complex Queries)
  async getAsanaLibrary(filters = {}) {
    const response = await this.djangoClient.post('/asanas/search/', filters);
    return response.data;
  }
  
  async getAsanaDetails(asanaId) {
    const response = await this.djangoClient.get(`/asanas/poses/${asanaId}/`);
    return response.data;
  }
  
  async getAsanaSequences(filters = {}) {
    const response = await this.djangoClient.post('/asanas/sequences/search/', filters);
    return response.data;
  }
  
  async getAsanaCategories() {
    const response = await this.djangoClient.get('/asanas/categories/');
    return response.data;
  }
  
  async getAsanasByDifficulty(level) {
    const response = await this.djangoClient.get(`/asanas/poses/?difficulty=${level}`);
    return response.data;
  }
  
  // Progress Tracking (Heavy Analytics)
  async getProgressDashboard(userId, period = '30d') {
    const response = await this.djangoClient.get(`/progress/dashboard/${userId}/?period=${period}`);
    return response.data;
  }
  
  async getSessionHistory(userId, page = 1, filters = {}) {
    const params = new URLSearchParams({ ...filters, page });
    const response = await this.djangoClient.get(`/progress/sessions/${userId}/?${params}`);
    return response.data;
  }
  
  async getProgressAnalytics(userId, period = '7d') {
    const response = await this.djangoClient.get(`/progress/analytics/${userId}/?period=${period}`);
    return response.data;
  }
  
  async getUserGoals(userId) {
    const response = await this.djangoClient.get(`/progress/goals/${userId}/`);
    return response.data;
  }
  
  async setUserGoals(userId, goals) {
    const response = await this.djangoClient.post(`/progress/goals/${userId}/`, goals);
    return response.data;
  }
  
  // Content Management (Heavy Media Data)
  async getVideoLibrary(filters = {}) {
    const response = await this.djangoClient.post('/content/videos/search/', filters);
    return response.data;
  }
  
  async getAudioContent(filters = {}) {
    const response = await this.djangoClient.post('/content/audio/search/', filters);
    return response.data;
  }
  
  async getArticles(filters = {}) {
    const response = await this.djangoClient.post('/content/articles/search/', filters);
    return response.data;
  }
  
  async getCourses(filters = {}) {
    const response = await this.djangoClient.post('/content/courses/search/', filters);
    return response.data;
  }
  
  async getUserPlaylists(userId) {
    const response = await this.djangoClient.get(`/content/playlists/${userId}/`);
    return response.data;
  }
  
  // Analytics & Reporting (Heavy Data Processing)
  async getAdvancedAnalytics(userId, reportType) {
    const response = await this.djangoClient.get(`/analytics/reports/${userId}/${reportType}/`);
    return response.data;
  }
  
  async exportUserData(userId, format = 'json') {
    const response = await this.djangoClient.get(`/analytics/export/${userId}/?format=${format}`);
    return response.data;
  }
  
  async getInsights(userId, insightType) {
    const response = await this.djangoClient.get(`/analytics/insights/${userId}/${insightType}/`);
    return response.data;
  }
  
  async getBehaviorAnalytics(userId, period = '30d') {
    const response = await this.djangoClient.get(`/analytics/behavior/${userId}/?period=${period}`);
    return response.data;
  }
  
  // Bulk Operations (Heavy Data Processing)
  async bulkUploadSessions(userId, sessions) {
    const response = await this.djangoClient.post(`/progress/sessions/bulk/${userId}/`, { sessions });
    return response.data;
  }
  
  async bulkUpdatePreferences(updates) {
    const response = await this.djangoClient.post('/users/preferences/bulk/', updates);
    return response.data;
  }
}

// Export singleton instance
export default new DualAPIClient();

// ============================================================================
// DASHBOARD SERVICE INTEGRATION
// ============================================================================

export class DashboardService {
  constructor() {
    this.apiClient = new DualAPIClient();
  }
  
  // Dashboard data aggregation using both backends
  async getDashboardData(userId) {
    try {
      // Use Promise.allSettled for parallel requests with error handling
      const [
        cachedDataResult,
        profileResult,
        analyticsResult,
        sessionsResult,
        goalsResult
      ] = await Promise.allSettled([
        this.apiClient.getCachedUserData(userId),           // FastAPI - Fast cache
        this.apiClient.getUserCompleteProfile(userId),      // Django - Heavy profile
        this.apiClient.getProgressAnalytics(userId, '7d'),  // Django - Analytics
        this.apiClient.getSessionHistory(userId, 1),        // Django - Recent sessions
        this.apiClient.getUserGoals(userId)                 // Django - User goals
      ]);
      
      return {
        cachedData: cachedDataResult.status === 'fulfilled' ? cachedDataResult.value : null,
        profile: profileResult.status === 'fulfilled' ? profileResult.value : null,
        analytics: analyticsResult.status === 'fulfilled' ? analyticsResult.value : null,
        recentSessions: sessionsResult.status === 'fulfilled' ? sessionsResult.value : null,
        goals: goalsResult.status === 'fulfilled' ? goalsResult.value : null,
        errors: [
          cachedDataResult,
          profileResult,
          analyticsResult,
          sessionsResult,
          goalsResult
        ].filter(result => result.status === 'rejected').map(result => result.reason)
      };
    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      throw error;
    }
  }
  
  // Real-time session management
  async startPracticeSession(sessionData) {
    try {
      // Start session with FastAPI for real-time handling
      const session = await this.apiClient.startYogaSession(sessionData);
      
      // Connect WebSocket for real-time updates
      this.apiClient.connectWebSocket(sessionData.userId);
      
      return session;
    } catch (error) {
      console.error('Failed to start practice session:', error);
      throw error;
    }
  }
  
  // Complete session with heavy data processing
  async completePracticeSession(sessionId, sessionSummary) {
    try {
      // End session with FastAPI
      await this.apiClient.endYogaSession(sessionId, sessionSummary);
      
      // Log detailed session data with Django
      await this.apiClient.bulkUploadSessions(sessionSummary.userId, [sessionSummary]);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to complete practice session:', error);
      throw error;
    }
  }
}

// ============================================================================
// REACT HOOKS INTEGRATION
// ============================================================================

// hooks/useDualBackend.js
import { useState, useEffect, useCallback } from 'react';

export const useDualBackend = () => {
  const [apiClient] = useState(() => new DualAPIClient());
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    // Check connection to both backends
    const checkConnection = async () => {
      try {
        await Promise.all([
          apiClient.fastApiClient.get('/health'),
          apiClient.djangoClient.get('/health/')
        ]);
        setConnected(true);
      } catch (error) {
        setConnected(false);
        console.error('Backend connection failed:', error);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [apiClient]);
  
  return { apiClient, connected };
};

// hooks/useDashboard.js
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const useDashboard = () => {
  const { user } = useContext(UserContext);
  const { apiClient } = useDualBackend();
  const [dashboardService] = useState(() => new DashboardService());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardData(user.id);
      setDashboardData(data);
      
      if (data.errors.length > 0) {
        console.warn('Some dashboard data failed to load:', data.errors);
      }
    } catch (err) {
      setError(err.message);
      console.error('Dashboard data loading failed:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, dashboardService]);
  
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);
  
  const startSession = useCallback(async (sessionData) => {
    try {
      const session = await dashboardService.startPracticeSession({
        ...sessionData,
        userId: user.id
      });
      return session;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.id, dashboardService]);
  
  const endSession = useCallback(async (sessionId, sessionSummary) => {
    try {
      await dashboardService.completePracticeSession(sessionId, {
        ...sessionSummary,
        userId: user.id
      });
      // Refresh dashboard data after session completion
      await loadDashboardData();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.id, dashboardService, loadDashboardData]);
  
  return {
    dashboardData,
    loading,
    error,
    startSession,
    endSession,
    refreshData: loadDashboardData,
    connected: apiClient?.connected || false
  };
};

// ============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================

// utils/apiOptimization.js
export class APIOptimization {
  static cache = new Map();
  static CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  static async cachedRequest(key, requestFn, ttl = this.CACHE_TTL) {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < ttl) {
      return cached.data;
    }
    
    try {
      const data = await requestFn();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using stale cache data due to API error:', error);
        return cached.data;
      }
      throw error;
    }
  }
  
  static clearCache(pattern) {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

export { DualAPIClient, DashboardService };
