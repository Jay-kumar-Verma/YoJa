import React, { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/apiClient';

const YogaPosture = () => {
    const [postureData, setPostureData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedPosture, setSelectedPosture] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Initialize component and fetch postures
    useEffect(() => {
        const initializeComponent = async () => {
            try {
                setLoading(true);
                
                // Check service health
                const healthStatus = await apiClient.checkServiceHealth();
                console.log('Service health:', healthStatus);
                
                // Fetch postures from FastAPI (lightweight operation)
                const response = await apiClient.getPostures();
                setPostureData(response.postures || response);
                
            } catch (error) {
                console.error('Failed to initialize component:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        initializeComponent();
    }, []);

    // Set up WebSocket connection for real-time updates
    useEffect(() => {
        const ws = apiClient.connectWebSocket(
            (data) => {
                console.log('WebSocket message received:', data);
                if (data.type === 'posture_analysis') {
                    setAnalysisResult(data.result);
                }
            },
            (error) => {
                console.error('WebSocket error:', error);
            },
            (event) => {
                console.log('WebSocket closed:', event);
            }
        );
        
        setWebSocket(ws);
        
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    // Start camera for pose analysis
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Failed to start camera:', error);
            setError('Camera access denied. Please allow camera access to use pose analysis.');
        }
    }, []);

    // Capture frame and analyze posture
    const captureAndAnalyze = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !selectedPosture) {
            setError('Please select a posture and ensure camera is active');
            return;
        }

        try {
            setIsAnalyzing(true);
            setError(null);

            // Capture frame from video
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            
            // Convert to blob for upload
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
            
            // Analyze posture using ML service
            const analysisResult = await apiClient.analyzePosture(blob, selectedPosture.name);
            
            // Perform complete analysis workflow (ML + Django + FastAPI)
            const completeResult = await apiClient.performCompleteAnalysis(
                blob, 
                selectedPosture.name, 
                1 // TODO: Get actual user ID from auth context
            );
            
            setAnalysisResult(completeResult.analysis);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            setError(`Analysis failed: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    }, [selectedPosture]);

    // Get personalized recommendations
    const getRecommendations = useCallback(async () => {
        try {
            const recommendations = await apiClient.getPersonalizedWorkout(
                1, // TODO: Get actual user ID
                { difficulty: 'intermediate', focus: 'flexibility' }
            );
            console.log('Personalized recommendations:', recommendations);
        } catch (error) {
            console.error('Failed to get recommendations:', error);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg">Loading yoga postures...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel - Posture Selection and Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Yoga Posture Library
                        </h2>
                        
                        {postureData && postureData.length > 0 ? (
                            <div className="grid gap-4">
                                {postureData.map((posture, index) => (
                                    <div 
                                        key={index}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedPosture?.name === posture.name 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedPosture(posture)}
                                    >
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {posture.name}
                                        </h3>
                                        <p className="text-gray-600 mt-2">
                                            {posture.description}
                                        </p>
                                        {posture.difficulty && (
                                            <span className={`inline-block mt-2 px-2 py-1 rounded text-sm ${
                                                posture.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                                posture.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {posture.difficulty}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No postures available</p>
                        )}
                        
                        <button
                            onClick={getRecommendations}
                            className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Get Personalized Recommendations
                        </button>
                    </div>
                </div>

                {/* Right Panel - Camera and Analysis */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Real-time Pose Analysis
                        </h3>
                        
                        {/* Camera Feed */}
                        <div className="relative mb-4">
                            <video 
                                ref={videoRef}
                                autoPlay 
                                muted 
                                playsInline
                                className="w-full h-64 bg-gray-200 rounded-lg object-cover"
                            />
                            <canvas 
                                ref={canvasRef} 
                                className="hidden"
                            />
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="flex gap-3 mb-4">
                            <button
                                onClick={startCamera}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Start Camera
                            </button>
                            
                            <button
                                onClick={captureAndAnalyze}
                                disabled={!selectedPosture || isAnalyzing}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    !selectedPosture || isAnalyzing
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Posture'}
                            </button>
                        </div>
                        
                        {/* Selected Posture Info */}
                        {selectedPosture && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <h4 className="font-semibold text-blue-800">
                                    Selected: {selectedPosture.name}
                                </h4>
                                <p className="text-blue-600 text-sm mt-1">
                                    {selectedPosture.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Analysis Results */}
                    {analysisResult && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">
                                Analysis Results
                            </h3>
                            
                            <div className="space-y-4">
                                {analysisResult.accuracy && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Accuracy Score
                                        </label>
                                        <div className="mt-1">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${analysisResult.accuracy}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 mt-1 block">
                                                {analysisResult.accuracy}%
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {analysisResult.feedback && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Feedback
                                        </label>
                                        <p className="mt-1 text-gray-600">
                                            {analysisResult.feedback}
                                        </p>
                                    </div>
                                )}
                                
                                {analysisResult.corrections && analysisResult.corrections.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Suggested Corrections
                                        </label>
                                        <ul className="mt-1 list-disc list-inside text-gray-600">
                                            {analysisResult.corrections.map((correction, index) => (
                                                <li key={index}>{correction}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YogaPosture;