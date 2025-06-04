from dataclasses import dataclass
from typing import Optional, List

@dataclass
class UserQuery:
    text: str
    generate_images: bool = False
    content_type: List[str] = None  # ["story", "novel", "fantasy", "articles", "poems"]
    length: str = "medium"  # "small", "medium", "big"

class UserQueryAgent:
    def __init__(self):
        self.supported_types = ["story", "novel", "fantasy", "articles", "poems"]
        self.supported_lengths = ["small", "medium", "big"]

    def validate_and_parse_query(self, text: str, generate_images: bool = False, 
                               content_type: Optional[List[str]] = None, length: str = "medium") -> UserQuery:
        # Validate content type
        if content_type:
            content_type = [t.lower() for t in content_type]
            for t in content_type:
                if t not in self.supported_types:
                    raise ValueError(f"Unsupported content type: {t}")
        
        # Validate length
        if length.lower() not in self.supported_lengths:
            raise ValueError(f"Unsupported length: {length}")

        return UserQuery(
            text=text,
            generate_images=generate_images,
            content_type=content_type,
            length=length.lower()
        )
