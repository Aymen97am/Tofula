"""
Core dependencies and utilities.
"""
from typing import Annotated, Optional

from fastapi import Depends, HTTPException, Header, status

from app.core.config import Settings, get_settings


async def get_current_user_id(
    authorization: Annotated[Optional[str], Header()] = None,
    x_user_id: Annotated[Optional[str], Header()] = None,
) -> str:
    """
    Get current user ID from authorization header or x-user-id header.
    
    In production, this should verify Firebase ID tokens.
    For development, we allow x-user-id header override.
    """
    if x_user_id:
        return x_user_id
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Extract token from "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
        
        # TODO: Verify Firebase ID token here
        # For now, we'll use a simple approach
        # In production, use firebase_admin.auth.verify_id_token(token)
        
        return "user_from_token"
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )


async def verify_studio_password(
    x_studio_password: Annotated[Optional[str], Header()] = None,
    settings: Settings = Depends(get_settings),
) -> bool:
    """
    Verify the Studio password from the X-Studio-Password header.
    
    This is a simple password-based authentication for Studio access.
    """
    if not x_studio_password:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Studio password required. Please provide X-Studio-Password header."
        )
    
    if x_studio_password != settings.STUDIO_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid studio password"
        )
    
    return True


async def get_admin_user(
    authorization: Annotated[Optional[str], Header()] = None,
    x_user_id: Annotated[Optional[str], Header()] = None,
    settings: Settings = Depends(get_settings),
) -> str:
    """
    Verify that the current user is an admin.
    
    In development mode, authentication is optional.
    In production, check against a list of admin user IDs or roles.
    """
    # In development mode, allow unauthenticated access
    if settings.ENVIRONMENT == "development":
        if x_user_id:
            return x_user_id
        return "dev_admin"
    
    # In production, require authentication
    if not authorization and not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    if x_user_id:
        return x_user_id
    
    # Extract token from "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
        
        # TODO: Verify Firebase ID token here
        return "user_from_token"
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
