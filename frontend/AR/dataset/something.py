import os
import json
from pathlib import Path

# --- Dynamic Path Configuration ---
# This finds the directory where 'something.py' actually lives
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Now we build absolute paths relative to the script's location
JSON_FILE_PATH = os.path.join(SCRIPT_DIR, "artifacts.json")
OUTPUT_JSON_FILE_PATH = os.path.join(SCRIPT_DIR, "artifactsjune8.json")
IMAGES_DIR = os.path.join(SCRIPT_DIR, "images_flat") # Paths update seamlessly

def populate_json_images():
    # 1. Load your existing JSON data
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find '{JSON_FILE_PATH}'")
        return
    
    # 2. Get a list of all image files in the directory
    try:
        image_files = os.listdir(IMAGES_DIR)
    except FileNotFoundError:
        print(f"Error: The directory '{IMAGES_DIR}' was not found.")
        return

    print(f"Found {len(image_files)} total images in folder.")

    # 3. Iterate through each artifact in the JSON
    updated_count = 0
    for item in data:
        artifact_id = item.get("id")
        if not artifact_id:
            continue
        
        # Find all files that start with the artifact ID
        matching_images = []
        for filename in image_files:
            if filename.startswith(artifact_id):
                # Using relative path from the script execution point or keeping it web-friendly:
                # If you need the path relative to the dataset folder for your frontend, 
                # we use 'dataset/images_flat/filename'
                relative_path = os.path.join("dataset", "images_flat", filename)
                matching_images.append(relative_path)
        
        # Sort them so they display consistently
        matching_images.sort()
        
        # Update the images array
        item["images"] = matching_images
        if matching_images:
            updated_count += len(matching_images)

    # 4. Save the updated data to the NEW JSON file
    with open(OUTPUT_JSON_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print(f"Success! Saved updated data to '{OUTPUT_JSON_FILE_PATH}'. Mapped {updated_count} images to their IDs.")

if __name__ == "__main__":
    populate_json_images()