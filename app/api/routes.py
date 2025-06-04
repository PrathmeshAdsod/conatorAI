from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from google.adk import AgentManager, AgentContext
from typing import Dict, Any, List
import asyncio

from app.agents.query_handler_agent import QueryHandlerAgent
from app.agents.content_generator_agent import ContentGeneratorAgent
from app.agents.feedback_collector_agent import FeedbackCollectorAgent
from app.agents.content_refiner_agent import ContentRefinerAgent
from app.agents.image_generator_agent import ImageGeneratorAgent
from app.agents.output_formatter_agent import OutputFormatterAgent

app = FastAPI(title="conatorAI Multi-Agent API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent manager
agent_manager = AgentManager()

# Register agents
agent_manager.register_agent("query_handler", QueryHandlerAgent())
agent_manager.register_agent("content_generator", ContentGeneratorAgent())
agent_manager.register_agent("feedback_collector", FeedbackCollectorAgent())
agent_manager.register_agent("content_refiner", ContentRefinerAgent())
agent_manager.register_agent("image_generator", ImageGeneratorAgent())
agent_manager.register_agent("output_formatter", OutputFormatterAgent())

@app.post("/generate")
async def generate_content(request: Dict[str, Any] = Body(...)):
    """Generate content based on user query."""
    try:
        # Create agent context with the request
        context = AgentContext(request=request)
        
        # Process through query handler
        query_response = await agent_manager.execute_agent("query_handler", context)
        if query_response.status_code != 200:
            return query_response.response
        
        # Process through content generator
        content_context = AgentContext(request=query_response.response)
        content_response = await agent_manager.execute_agent("content_generator", content_context)
        if content_response.status_code != 200:
            return content_response.response
        
        # Process through image generator if requested
        if request.get("generate_images", False):
            image_context = AgentContext(request={
                **content_response.response,
                "generate_images": True,
                "image_style": request.get("image_style", "realistic")
            })
            image_response = await agent_manager.execute_agent("image_generator", image_context)
            if image_response.status_code != 200:
                return image_response.response
            
            # Update content response with images
            content_response.response["images"] = image_response.response.get("images", [])
        
        # Process through output formatter
        formatter_context = AgentContext(request={
            **content_response.response,
            "output_format": request.get("output_format", "text")
        })
        formatter_response = await agent_manager.execute_agent("output_formatter", formatter_context)
        
        return formatter_response.response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@app.post("/refine")
async def refine_content(request: Dict[str, Any] = Body(...)):
    """Refine content based on user feedback."""
    try:
        # Extract content and feedback
        content = request.get("content")
        feedback = request.get("feedback")
        feedback_options = request.get("feedback_options", [])
        section_comments = request.get("section_comments", {})
        iteration = request.get("iteration", 0)
        
        if not content:
            raise HTTPException(status_code=400, detail="Content is required")
        
        # Process through feedback collector
        feedback_context = AgentContext(request={
            "content": content,
            "feedback": feedback,
            "feedback_options": feedback_options,
            "section_comments": section_comments
        })
        feedback_response = await agent_manager.execute_agent("feedback_collector", feedback_context)
        if feedback_response.status_code != 200:
            return feedback_response.response
        
        # Process through content refiner
        refiner_context = AgentContext(request={
            **feedback_response.response,
            "iteration": iteration,
            "changelog": request.get("changelog", [])
        })
        refiner_response = await agent_manager.execute_agent("content_refiner", refiner_context)
        if refiner_response.status_code != 200:
            return refiner_response.response
        
        # Process through image generator if requested
        if request.get("generate_images", False):
            image_context = AgentContext(request={
                **refiner_response.response,
                "generate_images": True,
                "image_style": request.get("image_style", "realistic")
            })
            image_response = await agent_manager.execute_agent("image_generator", image_context)
            if image_response.status_code == 200:
                refiner_response.response["images"] = image_response.response.get("images", [])
        
        # Process through output formatter
        formatter_context = AgentContext(request={
            **refiner_response.response,
            "output_format": request.get("output_format", "text")
        })
        formatter_response = await agent_manager.execute_agent("output_formatter", formatter_context)
        
        return formatter_response.response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refining content: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "agents": list(agent_manager.agents.keys())}