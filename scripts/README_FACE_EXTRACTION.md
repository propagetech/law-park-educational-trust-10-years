# Face Extraction Scripts

These scripts extract individual face photos from gallery images for use in the "Our Supporters & Partners" section.

## Quick Start

### Option 1: Using MediaPipe (Recommended - Easier Installation)

```bash
# Install dependencies
pip install mediapipe opencv-python pillow numpy

# Run the script
python scripts/extract_faces_mediapipe.py
```

### Option 2: Using face_recognition (Better Accuracy)

```bash
# Install dependencies (may require system libraries)
pip install face-recognition opencv-python pillow numpy

# On macOS, you might need:
brew install cmake
pip install dlib  # Required for face-recognition

# Run the script
python scripts/extract_faces.py
```

## What the Scripts Do

1. **Scan Images**: Processes all images in `public/images/`
2. **Detect Faces**: Uses AI to find faces in each image
3. **Extract Faces**: Crops individual faces with padding
4. **Save Results**: Saves extracted faces to `public/images/supporters/`
5. **Generate Report**: Creates `extraction_summary.json` with statistics

## Output

Extracted faces are saved as:
- `face_00_source_image_name.jpg`
- `face_01_source_image_name.jpg`
- etc.

## Configuration

You can modify these settings in the script:

- **min_face_size**: Minimum face size in pixels (default: 100)
- **padding**: Padding around face (default: 20px or 20%)
- **jpeg_quality**: Image quality 1-100 (default: 95)
- **min_detection_confidence**: Detection threshold 0.0-1.0 (default: 0.5)

## After Extraction

1. Review extracted faces in `public/images/supporters/`
2. Rename files with actual names:
   - `face_00_slide_01.jpg` → `john_doe_donor.jpg`
   - `face_01_slide_05.jpg` → `jane_smith_volunteer.jpg`
3. Update `src/data/websiteContent.ts` to include image paths:

```typescript
supporters: [
  {
    name: 'John Doe',
    type: 'donor',
    contribution: 'Long-term Educational Support',
    description: '...',
    image: '/images/supporters/john_doe_donor.jpg', // Add this
  },
  // ...
]
```

## Troubleshooting

### No faces detected
- Try lowering `min_detection_confidence`
- Check if images are clear and faces are visible
- Try the other script (MediaPipe vs face_recognition)

### Installation issues
- **face_recognition**: Requires dlib, which needs cmake. Use MediaPipe instead.
- **MediaPipe**: Usually installs without issues on all platforms.

### Poor quality extractions
- Increase `min_face_size` to filter out small faces
- Adjust `padding` to include more context
- Increase `jpeg_quality` for better output

## Notes

- The scripts process all images in the gallery
- Multiple faces per image are extracted separately
- Faces smaller than `min_face_size` are skipped
- A summary JSON file is created with extraction statistics
