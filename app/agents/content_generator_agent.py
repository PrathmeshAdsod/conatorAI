from google.adk import Agent, AgentContext, AgentResponse
from google.adk.toolkits import llm
from app.config.models import ContentResponse

class ContentGeneratorAgent(Agent):
    """Agent 2: Content Generator - Generates content based on processed query."""
    
    def __init__(self):
        super().__init__()
        self.llm_toolkit = llm.LLMToolkit()
    
    async def handle_request(self, context: AgentContext) -> AgentResponse:
        """Generate content based on the processed query."""
        # Get processed request from previous agent
        content_request = context.request.get("content_request", {})
        themes = context.request.get("themes", [])
        tone = context.request.get("tone", "neutral")
        custom_elements = context.request.get("custom_elements", [])
        
        # Validate input
        if not content_request:
            return AgentResponse(
                status_code=400,
                response={"error": "Invalid content request"}
            )
        
        # Prepare prompt for content generation
        prompt = self._build_prompt(content_request, themes, tone, custom_elements)
        
        # Generate content using LLM
        try:
            generated_content = await self.llm_toolkit.generate_text(
                prompt=prompt,
                max_tokens=self._get_max_tokens(content_request.get("length", "medium"))
            )
            
            # Perform basic quality checks
            quality_score = self._check_quality(generated_content)
            
            # Create response
            content_response = ContentResponse(
                content=generated_content,
                quality_score=quality_score
            )
            
            return AgentResponse(
                status_code=200,
                response={
                    "content": content_response.__dict__,
                    "original_request": content_request
                }
            )
            
        except Exception as e:
            return AgentResponse(
                status_code=500,
                response={"error": f"Content generation failed: {str(e)}"}
            )
    
    def _build_prompt(self, content_request, themes, tone, custom_elements):
        """Build a prompt for the LLM based on request parameters."""
        query = content_request.get("text", "")
        content_type = content_request.get("content_type", ["story"])[0]
        
        prompt = f"Generate a {tone} {content_type} about {query}. "
        
        if themes:
            prompt += f"Include the following themes: {', '.join(themes)}. "
            
        if custom_elements:
            prompt += f"Make sure to include these elements: {', '.join(custom_elements)}."
            
        return prompt
    
    def _get_max_tokens(self, length):
        """Convert length parameter to token count."""
        length_map = {
            "small": 500,
            "medium": 1000,
            "big": 2000
        }
        return length_map.get(length, 1000)
    
    def _check_quality(self, content):
        """Perform basic quality checks on generated content."""
        # Simplified quality check - would be more sophisticated in production
        if not content:
            return 0
            
        quality_score = min(100, max(0, len(content) / 20))
        return quality_score