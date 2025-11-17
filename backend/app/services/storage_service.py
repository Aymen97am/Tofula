"""
Storage service for handling file uploads to local storage, GCS, or Firebase Storage.
"""
import os
import uuid
from pathlib import Path
from typing import Optional

from app.core.config import get_settings


class StorageService:
    """Service for storing and retrieving files."""
    
    def __init__(self):
        self.settings = get_settings()
        self.storage_type = self.settings.STORAGE_TYPE
        
        if self.storage_type == "local":
            self.base_path = Path(self.settings.LOCAL_STORAGE_PATH)
            self.base_path.mkdir(parents=True, exist_ok=True)
            (self.base_path / "pdfs").mkdir(exist_ok=True)
            (self.base_path / "images").mkdir(exist_ok=True)
            (self.base_path / "audio").mkdir(exist_ok=True)
    
    def save_pdf(self, pdf_path: str, filename: Optional[str] = None) -> str:
        """
        Save a PDF file and return its URL/path.
        
        Args:
            pdf_path: Local path to the PDF file
            filename: Optional custom filename
            
        Returns:
            URL or path to the saved PDF
        """
        if not filename:
            filename = f"{uuid.uuid4()}.pdf"
        
        if self.storage_type == "local":
            dest_path = self.base_path / "pdfs" / filename
            
            # Copy the file
            with open(pdf_path, "rb") as src:
                with open(dest_path, "wb") as dst:
                    dst.write(src.read())
            
            # Return relative URL
            return f"/storage/pdfs/{filename}"
        
        elif self.storage_type == "gcs":
            # TODO: Implement GCS upload
            return self._upload_to_gcs(pdf_path, f"pdfs/{filename}")
        
        elif self.storage_type == "firebase":
            # TODO: Implement Firebase Storage upload
            return self._upload_to_firebase(pdf_path, f"pdfs/{filename}")
        
        raise ValueError(f"Unknown storage type: {self.storage_type}")
    
    def save_image(self, image_data: bytes, filename: Optional[str] = None) -> str:
        """
        Save an image file and return its URL/path.
        
        Args:
            image_data: Image file data as bytes
            filename: Optional custom filename
            
        Returns:
            URL or path to the saved image
        """
        if not filename:
            filename = f"{uuid.uuid4()}.png"
        
        if self.storage_type == "local":
            dest_path = self.base_path / "images" / filename
            
            with open(dest_path, "wb") as f:
                f.write(image_data)
            
            return f"/storage/images/{filename}"
        
        elif self.storage_type == "gcs":
            return self._upload_bytes_to_gcs(image_data, f"images/{filename}")
        
        elif self.storage_type == "firebase":
            return self._upload_bytes_to_firebase(image_data, f"images/{filename}")
        
        raise ValueError(f"Unknown storage type: {self.storage_type}")
    
    def save_audio(self, audio_path: str, filename: Optional[str] = None) -> str:
        """
        Save an audio file and return its URL/path.
        
        Args:
            audio_path: Local path to the audio file
            filename: Optional custom filename
            
        Returns:
            URL or path to the saved audio
        """
        if not filename:
            filename = f"{uuid.uuid4()}.mp3"
        
        if self.storage_type == "local":
            dest_path = self.base_path / "audio" / filename
            
            with open(audio_path, "rb") as src:
                with open(dest_path, "wb") as dst:
                    dst.write(src.read())
            
            return f"/storage/audio/{filename}"
        
        elif self.storage_type == "gcs":
            return self._upload_to_gcs(audio_path, f"audio/{filename}")
        
        elif self.storage_type == "firebase":
            return self._upload_to_firebase(audio_path, f"audio/{filename}")
        
        raise ValueError(f"Unknown storage type: {self.storage_type}")
    
    def _upload_to_gcs(self, local_path: str, blob_name: str) -> str:
        """Upload file to Google Cloud Storage."""
        # TODO: Implement GCS upload using google-cloud-storage
        # from google.cloud import storage
        # client = storage.Client()
        # bucket = client.bucket(self.settings.GCS_BUCKET_NAME)
        # blob = bucket.blob(blob_name)
        # blob.upload_from_filename(local_path)
        # return blob.public_url
        raise NotImplementedError("GCS storage not implemented yet")
    
    def _upload_bytes_to_gcs(self, data: bytes, blob_name: str) -> str:
        """Upload bytes to Google Cloud Storage."""
        # TODO: Implement GCS upload
        raise NotImplementedError("GCS storage not implemented yet")
    
    def _upload_to_firebase(self, local_path: str, storage_path: str) -> str:
        """Upload file to Firebase Storage."""
        # TODO: Implement Firebase Storage upload
        raise NotImplementedError("Firebase storage not implemented yet")
    
    def _upload_bytes_to_firebase(self, data: bytes, storage_path: str) -> str:
        """Upload bytes to Firebase Storage."""
        # TODO: Implement Firebase Storage upload
        raise NotImplementedError("Firebase storage not implemented yet")


# Global storage service instance
_storage_service: Optional[StorageService] = None


def get_storage_service() -> StorageService:
    """Get the global storage service instance."""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
