from google.adk import Agent, AgentContext, AgentResponse
from google.adk.toolkits import document_processing
import json

class OutputFormatterAgent(Agent):
    """Agent 6: Output Formatter - Formats final content with analytics."""
    
    def __init__(self):
        super().__init__()
        self.doc_toolkit = document_processing.DocumentProcessingToolkit()
    
    async def handle_request(self, context: AgentContext) -> AgentResponse:
        """Format the final content with analytics."""
        # Get content and images from context
        content = context.request.get("content", {}).get("content", "")
        images = context.request.get("images", [])
        output_format = context.request.get("output_format", "text")
        
        # Validate input
        if not content:
            return AgentResponse(
                status_code=400,
                response={"error": "No content provided for formatting"}
            )
        
        try:
            # Generate analytics
            analytics = await self._generate_analytics(content)
            
            # Format content based on requested format
            formatted_content = await self._format_content(
                content, 
                images, 
                output_format
            )
            
            return AgentResponse(
                status_code=200,
                response={
                    "formatted_content": formatted_content,
                    "analytics": analytics,
                    "format": output_format
                }
            )
            
        except Exception as e:
            return AgentResponse(
                status_code=500,
                response={"error": f"Content formatting failed: {str(e)}"}
            )
    
    async def _generate_analytics(self, content):
        """Generate analytics for the content."""
        # Calculate basic metrics
        word_count = len(content.split())
        paragraph_count = len([p for p in content.split('\n\n') if p.strip()])
        character_count = len(content)
        
        # Calculate reading time (average reading speed: 200 words per minute)
        reading_time_minutes = word_count / 200
        if reading_time_minutes < 1:
            reading_time = f"{int(reading_time_minutes * 60)} seconds"
        else:
            reading_time = f"{int(reading_time_minutes)} minute{'s' if reading_time_minutes >= 2 else ''}"
        
        # Determine readability level (simplified)
        avg_word_length = sum(len(word) for word in content.split()) / word_count if word_count > 0 else 0
        avg_sentence_length = word_count / max(1, len([s for s in content.split('.') if s.strip()]))
        
        if avg_word_length > 5.5 or avg_sentence_length > 25:
            readability = "Advanced"
        elif avg_word_length > 4.5 or avg_sentence_length > 18:
            readability = "Medium"
        else:
            readability = "Easy"
        
        # Determine sentiment (simplified)
        positive_words = ["happy", "good", "great", "excellent", "wonderful", "joy", "love", "success"]
        negative_words = ["sad", "bad", "terrible", "awful", "horrible", "hate", "failure", "fear"]
        
        content_lower = content.lower()
        positive_count = sum(content_lower.count(word) for word in positive_words)
        negative_count = sum(content_lower.count(word) for word in negative_words)
        
        if positive_count > negative_count * 2:
            sentiment = "Very Positive"
        elif positive_count > negative_count:
            sentiment = "Positive"
        elif negative_count > positive_count * 2:
            sentiment = "Very Negative"
        elif negative_count > positive_count:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"
        
        # Return analytics
        return {
            "word_count": word_count,
            "paragraph_count": paragraph_count,
            "character_count": character_count,
            "reading_time": reading_time,
            "readability": readability,
            "sentiment": sentiment
        }
    
    async def _format_content(self, content, images, output_format):
        """Format content based on requested format."""
        if output_format == "text":
            # Simple text format
            formatted_content = content
            
            # Add image references if any
            if images:
                formatted_content += "\n\n[Images]\n"
                for i, image in enumerate(images):
                    formatted_content += f"{i+1}. {image.get('prompt', 'Image')}: {image.get('url', '')}\n"
            
            return {"text": formatted_content}
            
        elif output_format == "json":
            # JSON format
            return {
                "content": content,
                "images": images
            }
            
        elif output_format == "pdf":
            # Generate PDF (simplified - in real implementation, would use a PDF library)
            pdf_url = await self.doc_toolkit.generate_pdf(
                content=content,
                images=[img.get("url") for img in images]
            )
            
            return {"pdf_url": pdf_url}
            
        elif output_format == "html":
            # Generate HTML
            html_content = f"<div class='content'>{content.replace('\n\n', '</p><p>')}</div>"
            
            if images:
                html_content += "<div class='images'>"
                for image in images:
                    html_content += f"<figure><img src='{image.get('url')}' alt='{image.get('prompt')}'><figcaption>{image.get('prompt')}</figcaption></figure>"
                html_content += "</div>"
            
            return {"html": html_content}
            
        else:
            # Default to text
            return {"text": content}