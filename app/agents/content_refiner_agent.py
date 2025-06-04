from google.adk import Agent, AgentContext, AgentResponse
from google.adk.toolkits import llm
from app.config.models import ContentResponse

class ContentRefinerAgent(Agent):
    """Agent 4: Content Refiner - Refines content based on user feedback."""
    
    def __init__(self):
        super().__init__()
        self.llm_toolkit = llm.LLMToolkit()
        self.max_iterations = 5
    
    async def handle_request(self, context: AgentContext) -> AgentResponse:
        """Refine content based on user feedback."""
        # Get feedback request from previous agent
        feedback_request = context.request.get("feedback_request", {})
        original_content = context.request.get("original_content", {})
        iteration = context.request.get("iteration", 0)
        
        # Validate input
        if not feedback_request or not original_content:
            return AgentResponse(
                status_code=400,
                response={"error": "Invalid feedback request or missing original content"}
            )
        
        # Check iteration limit
        if iteration >= self.max_iterations:
            return AgentResponse(
                status_code=200,
                response={
                    "content": original_content,
                    "message": "Maximum refinement iterations reached",
                    "iteration": iteration,
                    "changelog": context.request.get("changelog", [])
                }
            )
        
        # Extract feedback and content
        content = feedback_request.get("content", "")
        feedback = feedback_request.get("feedback", {})
        
        # Build refinement prompt
        prompt = self._build_refinement_prompt(content, feedback)
        
        try:
            # Generate refined content
            refined_content = await self.llm_toolkit.generate_text(
                prompt=prompt,
                max_tokens=len(content) * 1.5  # Allow for expansion
            )
            
            # Create changelog entry
            changelog_entry = self._create_changelog_entry(feedback, iteration + 1)
            changelog = context.request.get("changelog", [])
            changelog.append(changelog_entry)
            
            # Create response
            content_response = ContentResponse(
                content=refined_content,
                quality_score=self._check_quality(refined_content)
            )
            
            return AgentResponse(
                status_code=200,
                response={
                    "content": content_response.__dict__,
                    "original_content": original_content,
                    "iteration": iteration + 1,
                    "changelog": changelog
                }
            )
            
        except Exception as e:
            return AgentResponse(
                status_code=500,
                response={"error": f"Content refinement failed: {str(e)}"}
            )
    
    def _build_refinement_prompt(self, content, feedback):
        """Build a prompt for content refinement based on feedback."""
        prompt = f"Refine the following content based on user feedback:\n\n"
        prompt += f"ORIGINAL CONTENT:\n{content}\n\n"
        prompt += "USER FEEDBACK:\n"
        
        # Add general feedback
        if feedback.get("general_feedback"):
            prompt += f"- {feedback['general_feedback']}\n"
        
        # Add feedback options as specific instructions
        for action in feedback.get("actions", []):
            action_type = action.get("action")
            parameter = action.get("parameter")
            
            if action_type == "extend":
                prompt += f"- Make the content approximately {parameter}x longer\n"
            elif action_type == "add_detail":
                prompt += f"- Add more {parameter} detail to descriptions and scenes\n"
            elif action_type == "change_tone":
                prompt += f"- Adjust the tone to be more {parameter}\n"
            elif action_type == "add_characters":
                prompt += f"- Add {parameter} more characters to the narrative\n"
            elif action_type == "adjust_style":
                prompt += f"- Make the style more {parameter}\n"
            elif action_type == "simplify":
                prompt += f"- Simplify the language to be more accessible\n"
        
        # Add section comments
        for section, comment in feedback.get("section_comments", {}).items():
            prompt += f"- For the section about '{section}': {comment}\n"
        
        prompt += "\nREFINED CONTENT:"
        return prompt
    
    def _create_changelog_entry(self, feedback, iteration):
        """Create a changelog entry based on the feedback."""
        changes = []
        
        # Add general feedback
        if feedback.get("general_feedback"):
            changes.append(feedback["general_feedback"])
        
        # Add feedback options
        for action in feedback.get("actions", []):
            action_type = action.get("action")
            if action_type == "extend":
                changes.append("Extended content length")
            elif action_type == "add_detail":
                changes.append("Added more descriptive details")
            elif action_type == "change_tone":
                changes.append("Changed the tone")
            elif action_type == "add_characters":
                changes.append("Added more characters")
            elif action_type == "adjust_style":
                changes.append("Adjusted writing style")
            elif action_type == "simplify":
                changes.append("Simplified language")
        
        changelog_entry = {
            "iteration": iteration,
            "changes": changes
        }
        
        return changelog_entry
    
    def _check_quality(self, content):
        """Perform basic quality checks on refined content."""
        # Simplified quality check - would be more sophisticated in production
        if not content:
            return 0
            
        quality_score = min(100, max(0, len(content) / 20))
        return quality_score