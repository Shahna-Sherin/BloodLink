from fastapi import APIRouter, HTTPException
from graphrag import get_compatible_donors, get_compatible_recipients, check_compatibility

router = APIRouter(prefix="/graph", tags=["GraphRAG"])

@router.get("/compatible-donors/{blood_type}")
def compatible_donors(blood_type: str):
    """Get all blood types that can donate to the given blood type"""
    try:
        donors = get_compatible_donors(blood_type.upper())
        return {
            "recipient_blood_type": blood_type.upper(),
            "compatible_donors": donors,
            "count": len(donors)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/compatible-recipients/{blood_type}")
def compatible_recipients(blood_type: str):
    """Get all blood types this donor can donate to"""
    try:
        recipients = get_compatible_recipients(blood_type.upper())
        return {
            "donor_blood_type": blood_type.upper(),
            "compatible_recipients": recipients,
            "count": len(recipients)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/check/{donor}/{recipient}")
def check(donor: str, recipient: str):
    """Check if donor blood type is compatible with recipient"""
    try:
        compatible = check_compatibility(donor.upper(), recipient.upper())
        return {
            "donor": donor.upper(),
            "recipient": recipient.upper(),
            "compatible": compatible,
            "message": "✅ Compatible" if compatible else "❌ Not compatible"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
