// API Configuration and Integration Layer
// Handles communication between Frontend, FastAPI, Django, and ML services

class APIClient {
  constructor() {
    this.fastApiUrl = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';
    this.djangoUrl = process.env.REACT_APP_DJANGO_URL || 'http://localhost:8001';
    this.mlUrl = process.env.REACT_APP_ML_URL || 'http://localhost:8889';
    this.wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws';
    
    // Default headers
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set authentication headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    return token ? {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    } : this.defaultHeaders;
  }

  // Generic request handler with error handling
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ===== FASTAPI SERVICE METHODS (Lightweight operations) =====
  
  // Authentication
  async login(username, password) {
    const response = await this.makeRequest(`${this.fastApiUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('authToken');
    return await this.makeRequest(`${this.fastApiUrl}/auth/logout`, {
      method: 'POST'
    });
  }

  // Real-time posture monitoring
  async startPostureSession(sessionConfig) {
    return await this.makeRequest(`${this.fastApiUrl}/yoga/session/start`, {
      method: 'POST',
      body: JSON.stringify(sessionConfig)
    });
  }

  async endPostureSession(sessionId) {
    return await this.makeRequest(`${this.fastApiUrl}/yoga/session/${sessionId}/end`, {
      method: 'POST'
    });
  }

  // Get basic posture data
  async getPostures() {
    return await this.makeRequest(`${this.fastApiUrl}/yoga/postures`);
  }

  // Health check
  async healthCheck() {
    return await this.makeRequest(`${this.fastApiUrl}/health`);
  }

  // ===== DJANGO SERVICE METHODS (Heavy data operations) =====
  
  // User management
  async getUserProfile(userId) {
    return await this.makeRequest(`${this.djangoUrl}/api/users/${userId}/profile`);
  }

  async updateUserProfile(userId, profileData) {
    return await this.makeRequest(`${this.djangoUrl}/api/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Analytics and reporting
  async getAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.makeRequest(`${this.djangoUrl}/api/analytics?${queryString}`);
  }

  async getUserProgress(userId, timeRange = '30d') {
    return await this.makeRequest(`${this.djangoUrl}/api/users/${userId}/progress?range=${timeRange}`);
  }

  // Session history
  async getSessionHistory(userId, limit = 50) {
    return await this.makeRequest(`${this.djangoUrl}/api/users/${userId}/sessions?limit=${limit}`);
  }

  async getSessionDetails(sessionId) {
    return await this.makeRequest(`${this.djangoUrl}/api/sessions/${sessionId}`);
  }

  // Posture library management
  async createCustomPosture(postureData) {
    return await this.makeRequest(`${this.djangoUrl}/api/postures/custom`, {
      method: 'POST',
      body: JSON.stringify(postureData)
    });
  }

  async getCustomPostures(userId) {
    return await this.makeRequest(`${this.djangoUrl}/api/users/${userId}/postures/custom`);
  }

  // ===== ML SERVICE METHODS (AI/ML operations) =====
  
  // Posture analysis
  async analyzePosture(imageData, postureType) {
    const formData = new FormData();
    formData.append('image', imageData);
    formData.append('posture_type', postureType);

    return await this.makeRequest(`${this.mlUrl}/analyze/posture`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
        // Don't set Content-Type for FormData, let browser set it
      }
    });
  }

  // Real-time pose estimation
  async estimatePose(frameData) {
    return await this.makeRequest(`${this.mlUrl}/pose/estimate`, {
      method: 'POST',
      body: JSON.stringify({ frame: frameData })
    });
  }

  // Model training status
  async getModelStatus() {
    return await this.makeRequest(`${this.mlUrl}/model/status`);
  }

  // Personalized recommendations
  async getPersonalizedWorkout(userId, preferences = {}) {
    return await this.makeRequest(`${this.mlUrl}/recommendations/workout`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, preferences })
    });
  }

  // Difficulty assessment
  async assessDifficulty(userId, postureId) {
    return await this.makeRequest(`${this.mlUrl}/assess/difficulty`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, posture_id: postureId })
    });
  }

  // ===== WEBSOCKET CONNECTION (Real-time communication) =====
  
  connectWebSocket(onMessage, onError, onClose) {
    const token = this.getAuthToken();
    const wsUrl = token ? `${this.wsUrl}?token=${token}` : this.wsUrl;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      if (onClose) onClose(event);
    };
    
    return ws;
  }

  // ===== INTEGRATED WORKFLOWS =====
  
  // Complete posture analysis workflow
  async performCompleteAnalysis(imageData, postureType, userId) {
    try {
      // 1. Analyze posture with ML service
      const analysisResult = await this.analyzePosture(imageData, postureType);
      
      // 2. Save session data to Django service
      const sessionData = {
        user_id: userId,
        posture_type: postureType,
        analysis_result: analysisResult,
        timestamp: new Date().toISOString()
      };
      
      const session = await this.makeRequest(`${this.djangoUrl}/api/sessions`, {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
      
      // 3. Update real-time stats via FastAPI
      await this.makeRequest(`${this.fastApiUrl}/yoga/stats/update`, {
        method: 'POST',
        body: JSON.stringify({
          session_id: session.id,
          analysis_result: analysisResult
        })
      });
      
      return {
        analysis: analysisResult,
        session: session,
        success: true
      };
    } catch (error) {
      console.error('Complete analysis workflow failed:', error);
      throw error;
    }
  }

  // Get comprehensive dashboard data
  async getDashboardData(userId) {
    try {
      const [
        userProfile,
        recentSessions,
        analytics,
        personalizedWorkout
      ] = await Promise.all([
        this.getUserProfile(userId),
        this.getSessionHistory(userId, 10),
        this.getAnalytics({ user_id: userId, days: 7 }),
        this.getPersonalizedWorkout(userId)
      ]);

      return {
        profile: userProfile,
        recentSessions,
        analytics,
        personalizedWorkout,
        success: true
      };
    } catch (error) {
      console.error('Dashboard data fetch failed:', error);
      throw error;
    }
  }

  // ===== ERROR HANDLING & RETRY LOGIC =====
  
  async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  // Service health monitoring
  async checkServiceHealth() {
    const services = {
      fastapi: `${this.fastApiUrl}/health`,
      django: `${this.djangoUrl}/health/`,
      ml: `${this.mlUrl}/health`
    };

    const healthChecks = Object.entries(services).map(async ([name, url]) => {
      try {
        await this.makeRequest(url);
        return { service: name, status: 'healthy' };
      } catch (error) {
        return { service: name, status: 'unhealthy', error: error.message };
      }
    });

    return await Promise.all(healthChecks);
  }
}

// Create and export singleton instance
const apiClient = new APIClient();
export default apiClient;

// Export individual service clients for specific use cases
export const FastAPIClient = {
  baseUrl: apiClient.fastApiUrl,
  makeRequest: apiClient.makeRequest.bind(apiClient)
};

export const DjangoClient = {
  baseUrl: apiClient.djangoUrl,
  makeRequest: apiClient.makeRequest.bind(apiClient)
};

export const MLClient = {
  baseUrl: apiClient.mlUrl,
  makeRequest: apiClient.makeRequest.bind(apiClient)
};
