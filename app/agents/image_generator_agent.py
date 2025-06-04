from google.adk import Agent, AgentContext, AgentResponse
from google.adk.toolkits import nlp, image_generation
from app.config.models import ImageResponse

class ImageGeneratorAgent(Agent):
    """Agent 5: Image Generator - Generates images based on content."""
    
    def __init__(self):
        super().__init__()
        self.nlp_toolkit = nlp.NLPToolkit()
        self.image_toolkit = image_generation.ImageGenerationToolkit()
    
    async def handle_request(self, context: AgentContext) -> AgentResponse:
        """Generate images based on content if requested."""
        # Get content from context
        content = context.request.get("content", {}).get("content", "")
        generate_images = context.request.get("generate_images", False)
        image_style = context.request.get("image_style", "realistic")
        
        # Check if image generation is requested
        if not generate_images or not content:
            return AgentResponse(
                status_code=200,
                response={
                    "images": [],
                    "message": "Image generation not requested or no content provided"
                }
            )
        
        try:
            # Extract key scenes for image generation
            key_scenes = await self._extract_key_scenes(content)
            
            # Generate images for each key scene
            images = []
            for scene in key_scenes:
                image_prompt = self._create_image_prompt(scene, image_style)
                image_url = await self.image_toolkit.generate_image(
                    prompt=image_prompt,
                    style=image_style
                )
                
                images.append(ImageResponse(
                    url=image_url,
                    prompt=image_prompt,
                    style=image_style
                ).__dict__)
            
            return AgentResponse(
                status_code=200,
                response={
                    "images": images,
                    "content": context.request.get("content")
                }
            )
            
        except Exception as e:
            return AgentResponse(
                status_code=500,
                response={"error": f"Image generation failed: {str(e)}"}
            )
    
    async def _extract_key_scenes(self, content, max_scenes=2):
        """Extract key scenes from content for image generation."""
        # Use NLP to identify important scenes
        # This is a simplified implementation
        paragraphs = content.split('\n\n')
        key_scenes = []
        
        # Select paragraphs with the most visual descriptions
        for paragraph in paragraphs:
            if len(paragraph) > 100 and any(word in paragraph.lower() for word in ["saw", "looked", "appeared", "scene", "view"]):
                key_scenes.append(paragraph)
                if len(key_scenes) >= max_scenes:
                    break
        
        # If we couldn't find enough scenes, just take the first paragraphs
        if len(key_scenes) < max_scenes:
            for paragraph in paragraphs:
                if paragraph not in key_scenes and len(paragraph) > 50:
                    key_scenes.append(paragraph)
                    if len(key_scenes) >= max_scenes:
                        break
        
        return key_scenes
    
    def _create_image_prompt(self, scene, style):
        """Create an image generation prompt from a scene."""
        # Extract key visual elements
        keywords = self.nlp_toolkit.extract_keywords(scene, max_keywords=10)
        
        # Create a concise prompt
        prompt = f"Create a {style} image of: {', '.join(keywords)}"
        
        return prompt