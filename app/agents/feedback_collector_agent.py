from google.adk import Agent, AgentContext, AgentResponse
from app.config.models import FeedbackRequest

class FeedbackCollectorAgent(Agent):
    """Agent 3: Feedback Collector - Collects and structures user feedback."""
    
    def __init__(self):
        super().__init__()
    
    async def handle_request(self, context: AgentContext) -> AgentResponse:
        """Process user feedback on generated content."""
        # Get content and feedback from context
        content = context.request.get("content", {})
        feedback_text = context.request.get("feedback", "")
        section_comments = context.request.get("section_comments", {})
        feedback_options = context.request.get("feedback_options", [])
        
        # Validate input
        if not content:
            return AgentResponse(
                status_code=400,
                response={"error": "No content provided for feedback"}
            )
        
        # Structure the feedback
        structured_feedback = self._structure_feedback(
            feedback_text, 
            section_comments, 
            feedback_options
        )
        
        # Create feedback request for the content refiner
        feedback_request = FeedbackRequest(
            content=content.get("content", ""),
            feedback=structured_feedback
        )
        
        return AgentResponse(
            status_code=200,
            response={
                "feedback_request": feedback_request.__dict__,
                "original_content": content
            }
        )
    
    def _structure_feedback(self, feedback_text, section_comments, feedback_options):
        """Convert raw feedback into structured format."""
        structured_feedback = {
            "general_feedback": feedback_text,
            "section_comments": section_comments,
            "feedback_options": feedback_options
        }
        
        # Map feedback options to specific actions
        action_mapping = {
            "Make it longer": {"action": "extend", "parameter": 1.5},
            "Add more detail": {"action": "add_detail", "parameter": "high"},
            "Change the tone": {"action": "change_tone", "parameter": None},
            "Add more characters": {"action": "add_characters", "parameter": 2},
            "Make it more dramatic": {"action": "adjust_style", "parameter": "dramatic"},
            "Simplify the language": {"action": "simplify", "parameter": 0.7}
        }
        
        # Extract actions from feedback options
        actions = []
        for option in feedback_options:
            if option in action_mapping:
                actions.append(action_mapping[option])
        
        structured_feedback["actions"] = actions
        
        return structured_feedback