from google.adk import Agent, AgentContext, AgentResponse
from google.adk.toolkits import nlp
from app.config.models import ContentRequest

class QueryHandlerAgent(Agent):
    """Agent 1: Query Handler - Processes user input and extracts key details."""
    
    def __init__(self):
        super().__init__()
        self.nlp_toolkit = nlp.NLPToolkit()
    
    async def handle_request(self, context: AgentContext) -> AgentResponse:
        """Process the user query and extract key details."""
        # Get user input from context
        query = context.request.get("query", "")
        generate_images = context.request.get("generate_images", False)
        content_type = context.request.get("type", "story")
        length = context.request.get("length", "medium")
        themes = context.request.get("themes", "")
        tone = context.request.get("tone", "serious")
        custom_elements = context.request.get("custom_elements", "")
        
        # Validate input
        if not query:
            return AgentResponse(
                status_code=400,
                response={"error": "Query cannot be empty"}
            )
        
        # Use NLP to extract key details (simplified for now)
        extracted_themes = self.nlp_toolkit.extract_keywords(themes)
        extracted_elements = self.nlp_toolkit.extract_keywords(custom_elements)
        
        # Create a structured request for the content generator
        content_request = ContentRequest(
            text=query,
            generate_images=generate_images,
            content_type=[content_type],
            length=length
        )
        
        # Add additional context for the next agent
        processed_request = {
            "content_request": content_request.__dict__,
            "themes": extracted_themes,
            "tone": tone,
            "custom_elements": extracted_elements
        }
        
        return AgentResponse(
            status_code=200,
            response=processed_request
        )