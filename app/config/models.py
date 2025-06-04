from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class ContentRequest:
    """Model for content generation request."""
    text: str
    generate_images: bool = False
    content_type: List[str] = field(default_factory=lambda: ["story"])
    length: str = "medium"
    themes: List[str] = field(default_factory=list)
    tone: str = "neutral"
    custom_elements: List[str] = field(default_factory=list)

@dataclass
class ContentResponse:
    """Model for content generation response."""
    content: str
    quality_score: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class FeedbackRequest:
    """Model for feedback on generated content."""
    content: str
    feedback: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ImageResponse:
    """Model for generated image."""
    url: str
    prompt: str
    style: str = "realistic"

@dataclass
class AgentConfig:
    """Configuration for an agent in the system."""
    agent_id: str
    agent_class: str
    description: str
    input_schema: Dict[str, Any] = field(default_factory=dict)
    output_schema: Dict[str, Any] = field(default_factory=dict)
    dependencies: List[str] = field(default_factory=list)

@dataclass
class WorkflowConfig:
    """Configuration for a multi-agent workflow."""
    workflow_id: str
    description: str
    agents: List[AgentConfig] = field(default_factory=list)
    entry_point: str = ""
    max_iterations: int = 5