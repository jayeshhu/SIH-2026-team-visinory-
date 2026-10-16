from abc import ABC, abstractmethod
from ..schemas import VerificationResult

class DepartmentAdapter(ABC):
    @abstractmethod
    def verify(self, citizen_id: str) -> VerificationResult:
        raise NotImplementedError
