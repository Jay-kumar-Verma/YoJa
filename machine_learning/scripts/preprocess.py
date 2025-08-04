import os
import cv2
import numpy as np

def preprocess_data(input_dir, output_dir):
    """Preprocess raw video data for training."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for file_name in os.listdir(input_dir):
        if file_name.endswith(".mp4"):
            video_path = os.path.join(input_dir, file_name)
            process_video(video_path, output_dir)

def process_video(video_path, output_dir):
    """Extract frames from video and save as images."""
    cap = cv2.VideoCapture(video_path)
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_path = os.path.join(output_dir, f"frame_{frame_count}.jpg")
        cv2.imwrite(frame_path, frame)
        frame_count += 1

    cap.release()

if __name__ == "__main__":
    preprocess_data("./data/raw", "./data/processed")