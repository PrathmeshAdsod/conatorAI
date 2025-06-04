class FeedbackAgent:
    def __init__(self, content_agent):
        self.content_agent = content_agent
        
    async def process_feedback(self, original_content: str, feedback: str, 
                             content_type: list = None, length: str = "medium") -> str:
        feedback_prompt = f"""Original content:
        {original_content}
        
        User feedback:
        {feedback}
        
        Please revise the content based on the feedback while maintaining the original style and structure."""
        
        response = await self.content_agent.generate_content(feedback_prompt, content_type, length)
        return response["content"]
