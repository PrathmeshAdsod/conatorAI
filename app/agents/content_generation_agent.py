import google.generativeai as genai
from typing import Optional, Dict
import os
from dotenv import load_dotenv

class ContentGenerationAgent:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set in .env file")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def _build_prompt(self, query_text: str, content_type: Optional[list] = None, length: str = "medium") -> str:
        length_tokens = {
            "small": "approximately 200-300 words",
            "medium": "approximately 500-700 words",
            "big": "approximately 1000-1500 words"
        }
        
        content_type_str = " and ".join(content_type) if content_type else "content"
        prompt = f"""Generate {length_tokens[length]} of {content_type_str} based on the following query:
        {query_text}
        
        Make sure the content is engaging, creative, and follows proper structure."""
        
        return prompt

    async def generate_content(self, query_text: str, content_type: Optional[list] = None, 
                             length: str = "medium") -> Dict[str, str]:
        prompt = self._build_prompt(query_text, content_type, length)
        response = await self.model.generate_content_async(prompt)
        
        return {
            "content": response.text,
            "prompt": prompt
        }
