from fastapi import APIRouter
router = APIRouter(prefix="/services", tags=["services"])
@router.get("")
def services():
    return [{"id":"scholarship-verification","name":"Scholarship Verification","description":"Education, income and welfare verification"}]
