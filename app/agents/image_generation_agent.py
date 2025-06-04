import google.generativeai as genai
from typing import List
import requests
import os
from dotenv import load_dotenv

class ImageGenerationAgent:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set in .env file")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def _generate_image_prompt(self, content: str) -> str:
        prompt = f"""Based on the following content, create a vivid and detailed image description that would work well for image generation:
        
        Content: {content}
        
        Generate a clear, specific, and visual description that captures the essence of this content."""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    async def generate_images(self, content: str, num_images: int = 1) -> List[str]:
        # Here you would integrate with an image generation service like DALL-E or Stable Diffusion
        # For now, this is a placeholder that returns a description of what the image would be
        image_prompt = self._generate_image_prompt(content)
        
        return [
            f"Image description {i+1}: {image_prompt}"
            for i in range(num_images)
        ]
