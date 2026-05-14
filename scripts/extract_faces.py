#!/usr/bin/env python3
"""
Extract candid photos of individual people from gallery images.

This script:
1. Scans through images in the gallery folder
2. Detects faces in each image
3. Extracts and crops individual faces
4. Saves them with descriptive filenames
5. Optionally groups faces by person using face recognition

Requirements:
    pip install face-recognition opencv-python pillow numpy

Usage:
    python scripts/extract_faces.py
"""

import os
import sys
from pathlib import Path
from typing import List, Tuple, Optional
import json
from datetime import datetime

try:
    import face_recognition
    import cv2
    import numpy as np
    from PIL import Image
except ImportError as e:
    print(f"Error: Missing required library. Please install: {e.name}")
    print("Run: pip install face-recognition opencv-python pillow numpy")
    sys.exit(1)


class FaceExtractor:
    def __init__(
        self,
        input_dir: str = "public/images",
        output_dir: str = "public/images/supporters",
        min_face_size: int = 100,
        padding: int = 20,
        jpeg_quality: int = 95,
    ):
        """
        Initialize the face extractor.

        Args:
            input_dir: Directory containing source images
            output_dir: Directory to save extracted faces
            min_face_size: Minimum face size in pixels (width or height)
            padding: Padding around face in pixels
            jpeg_quality: JPEG quality (1-100)
        """
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.min_face_size = min_face_size
        self.padding = padding
        self.jpeg_quality = jpeg_quality

        # Create output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Supported image formats
        self.supported_formats = {".jpg", ".jpeg", ".png", ".webp"}

        # Statistics
        self.stats = {
            "images_processed": 0,
            "faces_found": 0,
            "faces_extracted": 0,
            "errors": [],
        }

    def load_image(self, image_path: Path) -> Optional[np.ndarray]:
        """Load image using face_recognition (handles various formats)."""
        try:
            image = face_recognition.load_image_file(str(image_path))
            return image
        except Exception as e:
            self.stats["errors"].append(f"Error loading {image_path}: {str(e)}")
            return None

    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """
        Detect faces in image.

        Returns:
            List of (top, right, bottom, left) face locations
        """
        # Use HOG model for faster processing (use 'cnn' for better accuracy)
        face_locations = face_recognition.face_locations(
            image, model="hog"  # Change to "cnn" for better accuracy but slower
        )
        return face_locations

    def extract_face(
        self, image: np.ndarray, face_location: Tuple[int, int, int, int]
    ) -> Optional[Image.Image]:
        """
        Extract and crop face from image with padding.

        Args:
            image: Full image as numpy array
            face_location: (top, right, bottom, left) face coordinates

        Returns:
            Cropped face as PIL Image or None if too small
        """
        top, right, bottom, left = face_location

        # Add padding
        height, width = image.shape[:2]
        top = max(0, top - self.padding)
        right = min(width, right + self.padding)
        bottom = min(height, bottom + self.padding)
        left = max(0, left - self.padding)

        # Extract face region
        face_image = image[top:bottom, left:right]

        # Check minimum size
        face_height, face_width = face_image.shape[:2]
        if face_height < self.min_face_size or face_width < self.min_face_size:
            return None

        # Convert to PIL Image
        pil_image = Image.fromarray(face_image)

        return pil_image

    def save_face(
        self,
        face_image: Image.Image,
        source_image: str,
        face_index: int,
        person_id: Optional[int] = None,
    ) -> str:
        """
        Save extracted face to file.

        Args:
            face_image: PIL Image of the face
            source_image: Name of source image file
            face_index: Index of face in source image
            person_id: Optional person ID if grouping enabled

        Returns:
            Filename of saved face
        """
        # Create filename
        source_name = Path(source_image).stem
        if person_id is not None:
            filename = f"person_{person_id:03d}_face_{face_index:02d}_{source_name}.jpg"
        else:
            filename = f"face_{face_index:02d}_{source_name}.jpg"

        filepath = self.output_dir / filename

        # Convert to RGB if needed (for JPEG)
        if face_image.mode != "RGB":
            face_image = face_image.convert("RGB")

        # Save with quality setting
        face_image.save(
            filepath, "JPEG", quality=self.jpeg_quality, optimize=True
        )

        return filename

    def process_image(self, image_path: Path, group_faces: bool = False) -> List[str]:
        """
        Process a single image and extract all faces.

        Args:
            image_path: Path to image file
            group_faces: Whether to group faces by person

        Returns:
            List of saved face filenames
        """
        print(f"Processing: {image_path.name}")

        # Load image
        image = self.load_image(image_path)
        if image is None:
            return []

        self.stats["images_processed"] += 1

        # Detect faces
        face_locations = self.detect_faces(image)
        if not face_locations:
            print(f"  No faces found in {image_path.name}")
            return []

        print(f"  Found {len(face_locations)} face(s)")

        self.stats["faces_found"] += len(face_locations)

        saved_files = []

        # Extract each face
        for idx, face_location in enumerate(face_locations):
            face_image = self.extract_face(image, face_location)
            if face_image is None:
                continue

            # Save face
            filename = self.save_face(face_image, image_path.name, idx)
            saved_files.append(filename)
            self.stats["faces_extracted"] += 1
            print(f"    Extracted: {filename}")

        return saved_files

    def process_all_images(self, group_faces: bool = False) -> dict:
        """
        Process all images in input directory.

        Args:
            group_faces: Whether to group faces by person (requires face encoding)

        Returns:
            Dictionary with processing results
        """
        print(f"\n{'='*60}")
        print("Face Extraction Started")
        print(f"{'='*60}")
        print(f"Input directory: {self.input_dir}")
        print(f"Output directory: {self.output_dir}")
        print(f"Min face size: {self.min_face_size}px")
        print(f"Padding: {self.padding}px")
        print(f"{'='*60}\n")

        # Get all image files
        image_files = []
        for ext in self.supported_formats:
            image_files.extend(self.input_dir.glob(f"*{ext}"))
            image_files.extend(self.input_dir.glob(f"*{ext.upper()}"))

        if not image_files:
            print(f"No images found in {self.input_dir}")
            return self.stats

        print(f"Found {len(image_files)} image(s) to process\n")

        # Process each image
        all_extracted_faces = []
        for image_path in sorted(image_files):
            try:
                faces = self.process_image(image_path, group_faces)
                all_extracted_faces.extend(faces)
            except Exception as e:
                error_msg = f"Error processing {image_path}: {str(e)}"
                self.stats["errors"].append(error_msg)
                print(f"  ERROR: {error_msg}")

        # Print summary
        print(f"\n{'='*60}")
        print("Processing Complete")
        print(f"{'='*60}")
        print(f"Images processed: {self.stats['images_processed']}")
        print(f"Faces found: {self.stats['faces_found']}")
        print(f"Faces extracted: {self.stats['faces_extracted']}")
        print(f"Output directory: {self.output_dir}")
        if self.stats["errors"]:
            print(f"\nErrors encountered: {len(self.stats['errors'])}")
            for error in self.stats["errors"]:
                print(f"  - {error}")

        # Save summary to JSON
        summary_file = self.output_dir / "extraction_summary.json"
        summary_data = {
            "timestamp": datetime.now().isoformat(),
            "input_directory": str(self.input_dir),
            "output_directory": str(self.output_dir),
            "statistics": self.stats,
            "extracted_files": all_extracted_faces,
        }
        with open(summary_file, "w") as f:
            json.dump(summary_data, f, indent=2)

        print(f"\nSummary saved to: {summary_file}")
        print(f"{'='*60}\n")

        return self.stats


def main():
    """Main function."""
    # Configuration
    input_dir = "public/images"
    output_dir = "public/images/supporters"

    # Check if input directory exists
    if not os.path.exists(input_dir):
        print(f"Error: Input directory '{input_dir}' not found!")
        print("Please run this script from the project root directory.")
        sys.exit(1)

    # Create extractor
    extractor = FaceExtractor(
        input_dir=input_dir,
        output_dir=output_dir,
        min_face_size=100,  # Minimum 100x100 pixels
        padding=20,  # 20px padding around face
        jpeg_quality=95,  # High quality JPEG
    )

    # Process all images
    extractor.process_all_images(group_faces=False)

    print("\nNext steps:")
    print("1. Review extracted faces in:", output_dir)
    print("2. Rename files with actual names (e.g., 'person_001_john_doe.jpg')")
    print("3. Update websiteContent.ts with supporter names and image paths")


if __name__ == "__main__":
    main()
