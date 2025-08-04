import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def validate_model():
    """Validate the trained model on unseen data."""
    model = tf.keras.models.load_model('./data/models/yoga_posture_model.h5')

    datagen = ImageDataGenerator(rescale=1./255)
    test_data = datagen.flow_from_directory(
        './data/processed',
        target_size=(128, 128),
        batch_size=32,
        class_mode='categorical'
    )

    loss, accuracy = model.evaluate(test_data)
    print(f"Validation Loss: {loss}")
    print(f"Validation Accuracy: {accuracy}")

if __name__ == "__main__":
    validate_model()